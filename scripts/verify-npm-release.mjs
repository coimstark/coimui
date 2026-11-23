import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const LIB_PKG_PATH = path.join(ROOT_DIR, "packages/coimui/package.json");

const EXIT_AVAILABLE = 0;
const EXIT_SUBMITTED = 2;
const EXIT_BLOCKED = 3;

function printUsage() {
  console.log(`Usage: node scripts/verify-npm-release.mjs [version] [options]

Options:
  --package <name>     npm package name (default: packages/coimui/package.json name)
  --registry <url>     npm registry base URL (default: https://registry.npmjs.org)
  --status-only        Only inspect registry metadata and provenance (skip temp tarball install)
  --wait               Wait locally until AVAILABLE or BLOCKED/REJECTED (or --timeout expires)
  --interval <sec>     Poll interval in seconds when --wait is enabled (default: 30)
  --timeout <sec>      Maximum wait time in seconds when --wait is enabled (default: 900)
  -h, --help           Show this help message

States & Exit Codes:
  AVAILABLE        (0) Published version, provenance attestation, and tarball install verified
  SUBMITTED        (2) Accepted by npm — registry processing pending (e.g. publish-time malware scan)
  BLOCKED/REJECTED (3) Security hold, rejection, missing provenance, signature failure, or bad tarball`);
}

function parseArgs(argv) {
  const libPkg = JSON.parse(fs.readFileSync(LIB_PKG_PATH, "utf8"));
  const options = {
    pkgName: libPkg.name,
    version: libPkg.version,
    registry: "https://registry.npmjs.org",
    statusOnly: false,
    wait: false,
    intervalSec: 30,
    timeoutSec: 900,
    help: false,
  };

  let positionalVersion = null;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      options.help = true;
    } else if (arg === "--status-only") {
      options.statusOnly = true;
    } else if (arg === "--wait") {
      options.wait = true;
    } else if (arg === "--package") {
      options.pkgName = argv[++i];
    } else if (arg === "--registry") {
      options.registry = argv[++i];
    } else if (arg === "--interval") {
      options.intervalSec = Number(argv[++i]);
    } else if (arg === "--timeout") {
      options.timeoutSec = Number(argv[++i]);
    } else if (!arg.startsWith("-") && positionalVersion === null) {
      positionalVersion = arg.replace(/^v/, "");
    } else {
      throw new Error(`Unknown or duplicate argument: ${arg}`);
    }
  }

  if (positionalVersion) {
    options.version = positionalVersion;
  }
  if (!options.pkgName || !options.version) {
    throw new Error("Package name and version are required.");
  }
  if (!Number.isFinite(options.intervalSec) || options.intervalSec < 5) {
    throw new Error("--interval must be at least 5 seconds.");
  }
  if (!Number.isFinite(options.timeoutSec) || options.timeoutSec < 5) {
    throw new Error("--timeout must be at least 5 seconds.");
  }
  options.registry = options.registry.replace(/\/+$/, "");
  return options;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      accept: "application/json",
      "cache-control": "no-cache",
    },
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: response.status, ok: response.ok, text, json };
}

function detectBlockedReason(versionDoc, packumentDoc, version) {
  const reasons = [];
  if (packumentDoc?.time?.unpublished) {
    reasons.push("Package packument reports an unpublished/takedown record.");
  }
  const versions = packumentDoc?.versions ?? {};
  for (const [ver, meta] of Object.entries(versions)) {
    const dep = typeof meta?.deprecated === "string" ? meta.deprecated.toLowerCase() : "";
    if (
      ver.includes("security") ||
      dep.includes("security holding") ||
      dep.includes("malware") ||
      dep.includes("blocked") ||
      dep.includes("quarantine")
    ) {
      reasons.push(`Version ${ver} carries a security-holding or quarantine marker.`);
    }
  }
  const depCurrent =
    typeof versionDoc?.deprecated === "string" ? versionDoc.deprecated.toLowerCase() : "";
  if (
    depCurrent.includes("security") ||
    depCurrent.includes("malware") ||
    depCurrent.includes("blocked") ||
    depCurrent.includes("quarantine")
  ) {
    reasons.push(`Version ${version} deprecation notice indicates a block/quarantine.`);
  }
  return reasons;
}

async function verifyAttestationEndpoint(versionDoc) {
  const att = versionDoc?.dist?.attestations;
  if (!att?.url) {
    return { ok: false, reason: "dist.attestations.url is missing on published version metadata." };
  }
  if (att.provenance?.predicateType !== "https://slsa.dev/provenance/v1") {
    return {
      ok: false,
      reason: `Unexpected or missing provenance predicateType: ${att.provenance?.predicateType ?? "none"}`,
    };
  }
  const res = await fetchJson(att.url);
  if (!res.ok || !Array.isArray(res.json?.attestations) || res.json.attestations.length === 0) {
    return {
      ok: false,
      reason: `Attestation bundle endpoint returned HTTP ${res.status} without valid attestations.`,
    };
  }
  return {
    ok: true,
    url: att.url,
    predicateType: att.provenance.predicateType,
    bundleCount: res.json.attestations.length,
  };
}

function verifyTarballInstall({ pkgName, version, registry }) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "coimui-release-check-"));
  try {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "release-verify-consumer", private: true, version: "0.0.0" }, null, 2),
    );
    execFileSync(
      "npm",
      [
        "install",
        "--registry",
        registry,
        "--omit=peer",
        "--no-audit",
        "--no-fund",
        "--ignore-scripts",
        `${pkgName}@${version}`,
      ],
      { cwd: tmpDir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );

    const installedPkgPath = path.join(tmpDir, "node_modules", ...pkgName.split("/"), "package.json");
    if (!fs.existsSync(installedPkgPath)) {
      throw new Error(`Installed package.json missing at ${installedPkgPath}`);
    }
    const installedPkg = JSON.parse(fs.readFileSync(installedPkgPath, "utf8"));
    if (installedPkg.version !== version) {
      throw new Error(`Installed version mismatch: expected ${version}, got ${installedPkg.version}`);
    }

    const auditOut = execFileSync("npm", ["audit", "signatures", "--registry", registry], {
      cwd: tmpDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return {
      installedVersion: installedPkg.version,
      auditSummary: auditOut.trim(),
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function checkOnce(options) {
  const encodedPkg = encodeURIComponent(options.pkgName).replace(/^%40/, "@").replace(/%2f/gi, "/");
  const versionUrl = `${options.registry}/${encodedPkg}/${encodeURIComponent(options.version)}`;
  const packumentUrl = `${options.registry}/${encodedPkg}?cb=${Date.now()}`;

  const [verRes, packRes] = await Promise.all([fetchJson(versionUrl), fetchJson(packumentUrl)]);

  if ([403, 410, 451].includes(verRes.status) || [403, 410, 451].includes(packRes.status)) {
    return {
      state: "BLOCKED/REJECTED",
      code: EXIT_BLOCKED,
      detail: `Registry returned HTTP ${verRes.status} (version) / ${packRes.status} (packument).`,
      action:
        "Inspect npm account/security notices or npmjs.com package settings. Do not re-tag or republish this version.",
    };
  }

  const blockedReasons = detectBlockedReason(verRes.json, packRes.json, options.version);
  if (blockedReasons.length > 0) {
    return {
      state: "BLOCKED/REJECTED",
      code: EXIT_BLOCKED,
      detail: blockedReasons.join(" "),
      action:
        "Review npm security holding notice or contact npm Support. Do not blindly retry or move existing git tags.",
    };
  }

  if (verRes.status === 404) {
    const knownVersions = Object.keys(packRes.json?.versions ?? {});
    const distTags = packRes.json?.["dist-tags"] ?? {};
    return {
      state: "SUBMITTED",
      code: EXIT_SUBMITTED,
      detail: `${options.pkgName}@${options.version} is not yet indexed (HTTP 404 — Accepted by npm; registry processing pending).`,
      registrySnapshot: {
        latest: distTags.latest ?? null,
        knownVersions,
        modified: packRes.json?.time?.modified ?? null,
      },
      action:
        "Wait for npm publish-time malware/security scanning to complete, then re-run this verifier locally without republishing.",
    };
  }

  if (!verRes.ok || !verRes.json || verRes.json.version !== options.version) {
    return {
      state: "BLOCKED/REJECTED",
      code: EXIT_BLOCKED,
      detail: `Unexpected registry response: HTTP ${verRes.status} (${verRes.text.slice(0, 200)}).`,
      action: "Inspect npm registry response and package status before creating a GitHub Release.",
    };
  }

  const versionDoc = verRes.json;
  if (!versionDoc.dist?.tarball || !versionDoc.dist?.integrity) {
    return {
      state: "BLOCKED/REJECTED",
      code: EXIT_BLOCKED,
      detail: "Version metadata is missing dist.tarball or dist.integrity.",
      action: "Verify npm registry publication state via npmjs.com maintainer dashboard.",
    };
  }

  const attCheck = await verifyAttestationEndpoint(versionDoc);
  if (!attCheck.ok) {
    return {
      state: "BLOCKED/REJECTED",
      code: EXIT_BLOCKED,
      detail: attCheck.reason,
      action: "Confirm OIDC Trusted Publishing provenance completed cleanly on npmjs.com.",
    };
  }

  const tarballHead = await fetch(versionDoc.dist.tarball, { method: "HEAD", cache: "no-store" });
  if (!tarballHead.ok) {
    return {
      state: "BLOCKED/REJECTED",
      code: EXIT_BLOCKED,
      detail: `Tarball URL ${versionDoc.dist.tarball} returned HTTP ${tarballHead.status}.`,
      action: "Check whether npm quarantined the tarball or propagation is incomplete.",
    };
  }

  let installVerification = null;
  if (!options.statusOnly) {
    try {
      installVerification = verifyTarballInstall(options);
    } catch (error) {
      return {
        state: "BLOCKED/REJECTED",
        code: EXIT_BLOCKED,
        detail: `Tarball install or signature verification failed: ${error instanceof Error ? error.message : String(error)}`,
        action: "Investigate tarball integrity/signatures before creating a GitHub Release.",
      };
    }
  }

  return {
    state: "AVAILABLE",
    code: EXIT_AVAILABLE,
    package: options.pkgName,
    version: options.version,
    distTags: packRes.json?.["dist-tags"] ?? {},
    publishedAt: packRes.json?.time?.[options.version] ?? null,
    tarball: versionDoc.dist.tarball,
    integrity: versionDoc.dist.integrity,
    fileCount: versionDoc.dist.fileCount ?? null,
    provenance: attCheck,
    installVerification,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    process.exit(0);
  }

  const deadline = Date.now() + options.timeoutSec * 1000;
  while (true) {
    const result = await checkOnce(options);
    console.log(JSON.stringify(result, null, 2));

    if (result.state !== "SUBMITTED" || !options.wait) {
      process.exit(result.code);
    }
    if (Date.now() + options.intervalSec * 1000 > deadline) {
      console.error(
        `Timed out after ${options.timeoutSec}s while still SUBMITTED (${options.pkgName}@${options.version}). Re-check locally later without republishing.`,
      );
      process.exit(EXIT_SUBMITTED);
    }
    await new Promise((resolve) => setTimeout(resolve, options.intervalSec * 1000));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

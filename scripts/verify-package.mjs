import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const PKG_DIR = path.join(ROOT_DIR, "packages/coimui");

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Package verification failed: ${message}`);
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(PKG_DIR, "package.json"), "utf8"));
const starterPkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "apps/starter/package.json"), "utf8"));
const showcasePkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "apps/showcase/package.json"), "utf8"));

assert(pkg.name === "@coimui/svelte", `Expected package name "@coimui/svelte", got "${pkg.name}"`);
assert(pkg.private !== true, "packages/coimui/package.json must not have private: true");
assert(pkg.publishConfig?.access === "public", 'publishConfig.access must be "public"');
assert(
  pkg.publishConfig?.registry === "https://registry.npmjs.org",
  'publishConfig.registry must be "https://registry.npmjs.org"',
);
assert(
  pkg.repository?.url === "git+https://github.com/coimstark/coimui.git",
  `Unexpected repository.url: ${pkg.repository?.url}`,
);
assert(
  pkg.repository?.directory === "packages/coimui",
  `Unexpected repository.directory: ${pkg.repository?.directory}`,
);
assert(pkg.homepage === "https://github.com/coimstark/coimui#readme", "homepage must point to GitHub README");
assert(pkg.bugs?.url === "https://github.com/coimstark/coimui/issues", "bugs.url must point to GitHub issues");
assert(starterPkg.private === true, "apps/starter must remain private: true");
assert(showcasePkg.private === true, "apps/showcase must remain private: true");

for (const [subpath, target] of Object.entries(pkg.exports ?? {})) {
  const values = typeof target === "string" ? [target] : Object.values(target);
  for (const relPath of values) {
    const cleanRel = relPath.replace(/^\.\//, "");
    if (cleanRel.includes("*")) {
      const dir = path.join(PKG_DIR, path.dirname(cleanRel));
      assert(fs.existsSync(dir), `Missing wildcard export directory for "${subpath}": ${dir}`);
    } else {
      const fullPath = path.join(PKG_DIR, cleanRel);
      assert(fs.existsSync(fullPath), `Missing export target for "${subpath}": ${relPath}`);
    }
  }
}

const packOutput = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  cwd: PKG_DIR,
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024,
});
const parsedPack = JSON.parse(packOutput);
const packReport = Array.isArray(parsedPack)
  ? parsedPack[0]
  : parsedPack && Array.isArray(parsedPack.files)
    ? parsedPack
    : parsedPack?.[pkg.name] ?? Object.values(parsedPack ?? {})[0];
assert(packReport && Array.isArray(packReport.files), "Unexpected JSON shape from npm pack --dry-run --json");
const packedFiles = packReport.files.map((entry) => entry.path);

const requiredPacked = [
  "package.json",
  "README.md",
  "LICENSE",
  "dist/index.js",
  "dist/index.d.ts",
  "dist/styles/index.css",
  "dist/styles/core.css",
  "dist/data-grid/index.js",
  "dist/data-grid/index.d.ts",
  "dist/styles/data-grid.css",
  "dist/charts/index.js",
  "dist/charts/index.d.ts",
  "dist/styles/charts.css",
  "dist/date-pickers/index.js",
  "dist/date-pickers/index.d.ts",
  "dist/styles/date-pickers.css",
  "dist/plugins/index.js",
  "dist/plugins/index.d.ts",
  "dist/styles/plugins.css",
];

for (const reqPath of requiredPacked) {
  assert(packedFiles.includes(reqPath), `Packed tarball is missing required file: ${reqPath}`);
}

const forbiddenMatches = packedFiles.filter((filePath) =>
  /\.(test|spec)\.|(^|\/)(\.env|\.DS_Store|node_modules|tests\/)|snapshot|^src\//i.test(filePath),
);
assert(forbiddenMatches.length === 0, `Forbidden files in tarball: ${forbiddenMatches.join(", ")}`);

function scanDirForLeaks(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirForLeaks(fullPath);
    } else if (
      !/\.(test|spec)\./i.test(entry.name) &&
      /\.(js|ts|svelte|css|md|map|json)$/i.test(entry.name)
    ) {
      const text = fs.readFileSync(fullPath, "utf8");
      if (/\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+|C:\\\\Users\\\\|file:\/\//i.test(text)) {
        const matches = text.match(/\/Users\/[A-Za-z0-9._-]+/g) || [];
        const hasRealHomePath = matches.some((m) => m.startsWith("/Users/"));
        if (hasRealHomePath || /\/home\/|C:\\\\Users\\\\|file:\/\//i.test(text)) {
          throw new Error(`Workstation path or file:// URI found in distributable file: ${fullPath}`);
        }
      }
    }
  }
}

for (const docFile of [path.join(ROOT_DIR, "README.md"), path.join(PKG_DIR, "README.md")]) {
  const text = fs.readFileSync(docFile, "utf8");
  assert(!/\/Users\/[a-z0-9._-]+|file:\/\//i.test(text), `Workstation path/URI leaked in ${docFile}`);
}
scanDirForLeaks(path.join(PKG_DIR, "dist"));

console.log(
  `Verified ${pkg.name}@${pkg.version}: ${packedFiles.length} tarball files, ${(packReport.size / 1024).toFixed(1)} kB compressed / ${(packReport.unpackedSize / 1024 / 1024).toFixed(2)} MB unpacked.`,
);

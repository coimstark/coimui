import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import { createRawSnippet, tick } from "svelte";
import { CoimPortal } from "./index.js";

describe("CoimPortal", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("mounts children into document.body by default and cleans up on unmount", async () => {
    const host = document.createElement("div");
    host.setAttribute("data-testid", "host");
    document.body.appendChild(host);

    const child = createRawSnippet(() => ({
      render: () => `<span data-testid="portal-content">Portaled</span>`,
    }));

    const view = render(CoimPortal, {
      target: host,
      props: {
        children: child,
      },
    });
    await tick();

    const content = document.body.querySelector('[data-testid="portal-content"]') as HTMLElement;
    expect(content).toBeTruthy();
    expect(host.contains(content)).toBe(false);
    expect(document.body.contains(content)).toBe(true);

    view.unmount();
    expect(document.body.querySelector('[data-testid="portal-content"]')).toBeNull();
  });

  it("mounts into custom container and supports disablePortal toggling", async () => {
    const host = document.createElement("div");
    const customTarget = document.createElement("section");
    document.body.append(host, customTarget);

    const child = createRawSnippet(() => ({
      render: () => `<span data-testid="custom-content">Hello</span>`,
    }));

    const view = render(CoimPortal, {
      target: host,
      props: {
        container: () => customTarget,
        disablePortal: false,
        children: child,
      },
    });
    await tick();

    const content = customTarget.querySelector('[data-testid="custom-content"]') as HTMLElement;
    expect(content).toBeTruthy();
    expect(customTarget.contains(content)).toBe(true);
    expect(host.contains(content)).toBe(false);

    await view.rerender({
      container: () => customTarget,
      disablePortal: true,
      children: child,
    });
    await tick();

    expect(host.contains(content)).toBe(true);
    expect(customTarget.contains(content)).toBe(false);
  });
});

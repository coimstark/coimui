import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
import { createRawSnippet } from "svelte";
import { CoimDivider, CoimTypography } from "../foundation/index.js";
import { CoimContainer, CoimGrid, CoimMasonry, CoimStack } from "../layout/index.js";
import {
  CoimAccordion,
  CoimCard,
  CoimCardContent,
  CoimCardHeader,
  CoimPaper,
  CoimSurface,
} from "./index.js";

describe("Foundation, Layout & Surfaces SSR Safety", () => {
  it("renders typography, grid, masonry, paper, card, and accordion on server cleanly", () => {
    const t = render(CoimTypography, {
      props: { variant: "h1", children: createRawSnippet(() => ({ render: () => "<span>Title</span>" })) },
    });
    expect(t.body).toContain("coim-typography-h1");

    const d = render(CoimDivider, { props: { orientation: "vertical", size: "large" } });
    expect(d.body).toContain('aria-orientation="vertical"');

    const c = render(CoimContainer, { props: { maxWidth: "lg" } });
    expect(c.body).toContain("coim-container");

    const g = render(CoimGrid, { props: { container: true, size: { xs: 12, lg: 6 } } });
    expect(g.body).toContain("coim-grid-lg-6");

    const s = render(CoimStack, { props: { spacing: 2 } });
    expect(s.body).toContain("coim-stack");

    const m = render(CoimMasonry, { props: { columns: 3 } });
    expect(m.body).toContain("--coim-msn-cols-xs: 3");

    const p = render(CoimPaper, { props: { elevation: 2 } });
    expect(p.body).toContain("coim-paper-elevation-2");

    const sf = render(CoimSurface, { props: { variant: "outlined" } });
    expect(sf.body).toContain("coim-surface");

    const card = render(CoimCard, {
      props: {
        children: createRawSnippet(() => ({ render: () => `<div class="card-inner">Card</div>` })),
      },
    });
    expect(card.body).toContain("coim-card");

    const hdr = render(CoimCardHeader, { props: { title: "Revenue", subheader: "Q4" } });
    expect(hdr.body).toContain("Revenue");

    const body = render(CoimCardContent, {});
    expect(body.body).toContain("coim-card-content");

    const acc = render(CoimAccordion, { props: { variant: "surface", defaultExpanded: true } });
    expect(acc.body).toContain("coim-accordion-surface");
  });
});

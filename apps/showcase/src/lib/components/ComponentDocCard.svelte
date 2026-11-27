<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimTab,
    CoimTabPanel,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTabs,
  } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";
  import type { ComponentApiGroup, ComponentPropDoc } from "./doc-types.ts";

  interface Props {
    id?: string;
    title: string;
    description: string;
    packageEntry?: string;
    importPath?: string;
    code: string;
    propsDocs?: ComponentPropDoc[];
    apiGroups?: ComponentApiGroup[];
    accessibilityNotes?: string[];
    controls?: Snippet;
    children?: Snippet;
  }

  let {
    id,
    title,
    description,
    packageEntry,
    importPath,
    code,
    propsDocs = [],
    apiGroups = [],
    accessibilityNotes = [],
    controls,
    children,
  }: Props = $props();

  let activeTab = $state("preview");
  let copied = $state(false);
  let showLiveCode = $state(false);

  const resolvedPackageEntry = $derived(importPath ?? packageEntry ?? "@coimui/svelte");
  const resolvedApiGroups = $derived.by<ComponentApiGroup[]>(() => {
    if (apiGroups.length > 0) return apiGroups;
    if (propsDocs.length > 0) return [{ title: `${title} API`, props: propsDocs }];
    return [];
  });
  const hasApiDocs = $derived(resolvedApiGroups.length > 0);

  async function handleQuickCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        // Ignore clipboard errors in non-HTTPS environments
      }
    }
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 1500);
  }
</script>

<CoimCard {id} class="scroll-mt-20">
  <CoimCardHeader {title} subheader={description}>
    {#snippet action()}
      <div class="flex flex-wrap items-center gap-2">
        <CoimChip
          label={resolvedPackageEntry}
          size="small"
          variant="pastel"
          color="primary"
          class="font-mono text-xs"
        />
        <CoimButton
          size="small"
          variant="outlined"
          onclick={handleQuickCopy}
          aria-label={`${copied ? "Copied" : "Copy Code"} — ${title}`}
        >
          {copied ? "Copied" : "Copy Code"}
        </CoimButton>
      </div>
    {/snippet}
  </CoimCardHeader>
  <CoimCardContent>
    <CoimTabs bind:value={activeTab} hairline>
      {#snippet tabs()}
        <CoimTab value="preview" label="Preview" />
        <CoimTab value="code" label="Snippet" />
        {#if hasApiDocs}
          <CoimTab value="props" label="Props &amp; Events" />
        {/if}
        {#if accessibilityNotes.length > 0}
          <CoimTab value="a11y" label="Accessibility" />
        {/if}
      {/snippet}

      <CoimTabPanel value="preview">
        <div class="border-grey-100 rounded-lg border p-4">
          {@render children?.()}
        </div>

        {#if controls}
          <div class="border-grey-100 bg-grey-25/50 mt-3 rounded-lg border p-3.5">
            <div class="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <span class="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                Interactive Controls
              </span>
              <div class="flex items-center gap-2">
                <CoimButton
                  size="small"
                  variant="text"
                  onclick={() => (showLiveCode = !showLiveCode)}
                >
                  {showLiveCode ? "Hide Live Svelte 5 Code" : "View Live Svelte 5 Code"}
                </CoimButton>
                <CoimButton size="small" variant="outlined" onclick={handleQuickCopy}>
                  {copied ? "Copied" : "Copy"}
                </CoimButton>
              </div>
            </div>
            {@render controls()}
            {#if showLiveCode}
              <div class="mt-3">
                <CoimCodeBlock {code} language="svelte" filename={`${title}.svelte`} />
              </div>
            {/if}
          </div>
        {/if}
        <span class="sr-only" aria-live="polite">{copied ? `${title} snippet copied` : ""}</span>
      </CoimTabPanel>

      <CoimTabPanel value="code">
        <CoimCodeBlock {code} language="svelte" filename={`${title}.svelte`} />
      </CoimTabPanel>

      {#if hasApiDocs}
        <CoimTabPanel value="props">
          <div class="space-y-5">
            {#each resolvedApiGroups as group (group.title)}
              <div>
                {#if resolvedApiGroups.length > 1}
                  <h4 class="text-text-primary mb-2 text-sm font-semibold">{group.title}</h4>
                {/if}
                <CoimTableContainer class="overflow-x-auto">
                  <CoimTable size="small" aria-label={`${group.title} reference`}>
                    <CoimTableHead>
                      <CoimTableRow>
                        <CoimTableCell>Member</CoimTableCell>
                        <CoimTableCell>Type</CoimTableCell>
                        <CoimTableCell>Default</CoimTableCell>
                        <CoimTableCell>Description</CoimTableCell>
                      </CoimTableRow>
                    </CoimTableHead>
                    <CoimTableBody>
                      {#each group.props as row (row.name)}
                        <CoimTableRow>
                          <CoimTableCell class="whitespace-nowrap font-mono text-xs font-semibold">
                            <span>{row.name}</span>
                            {#if row.kind && row.kind !== "prop"}
                              <CoimChip
                                label={row.kind}
                                size="small"
                                variant="pastel"
                                color={row.kind === "bindable" ? "secondary" : row.kind === "event" ? "info" : "warning"}
                                class="ms-1.5"
                              />
                            {/if}
                          </CoimTableCell>
                          <CoimTableCell class="font-mono text-xs">{row.type}</CoimTableCell>
                          <CoimTableCell class="font-mono text-xs">{row.defaultValue ?? "—"}</CoimTableCell>
                          <CoimTableCell class="text-sm">{row.description}</CoimTableCell>
                        </CoimTableRow>
                      {/each}
                    </CoimTableBody>
                  </CoimTable>
                </CoimTableContainer>
              </div>
            {/each}
          </div>
        </CoimTabPanel>
      {/if}

      {#if accessibilityNotes.length > 0}
        <CoimTabPanel value="a11y">
          <ul class="text-text-secondary list-disc space-y-1.5 ps-5 text-sm">
            {#each accessibilityNotes as note, idx (idx)}
              <li>{note}</li>
            {/each}
          </ul>
        </CoimTabPanel>
      {/if}
    </CoimTabs>
  </CoimCardContent>
</CoimCard>

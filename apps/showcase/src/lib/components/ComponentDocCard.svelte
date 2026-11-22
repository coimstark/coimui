<script lang="ts">
  import type { Snippet } from "svelte";
  import {
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

  export interface ComponentPropDoc {
    name: string;
    type: string;
    defaultValue?: string;
    description: string;
  }

  interface Props {
    title: string;
    description: string;
    packageEntry?: string;
    code: string;
    propsDocs?: ComponentPropDoc[];
    accessibilityNotes?: string[];
    children?: Snippet;
  }

  let {
    title,
    description,
    packageEntry = "@coimui/svelte",
    code,
    propsDocs = [],
    accessibilityNotes = [],
    children,
  }: Props = $props();

  let activeTab = $state("preview");
</script>

<CoimCard>
  <CoimCardHeader {title} subheader={description}>
    {#snippet action()}
      <CoimChip label={packageEntry} size="small" variant="pastel" color="primary" />
    {/snippet}
  </CoimCardHeader>
  <CoimCardContent>
    <CoimTabs bind:value={activeTab} hairline>
      {#snippet tabs()}
        <CoimTab value="preview" label="Preview" />
        <CoimTab value="code" label="Snippet" />
        {#if propsDocs.length > 0}
          <CoimTab value="props" label="Props & Events" />
        {/if}
        {#if accessibilityNotes.length > 0}
          <CoimTab value="a11y" label="Accessibility" />
        {/if}
      {/snippet}

      <CoimTabPanel value="preview">
        <div class="border-grey-100 rounded-lg border p-4">
          {@render children?.()}
        </div>
      </CoimTabPanel>

      <CoimTabPanel value="code">
        <CoimCodeBlock {code} language="svelte" filename={`${title}.svelte`} />
      </CoimTabPanel>

      {#if propsDocs.length > 0}
        <CoimTabPanel value="props">
          <CoimTableContainer>
            <CoimTable size="small">
              <CoimTableHead>
                <CoimTableRow>
                  <CoimTableCell>Prop / Event</CoimTableCell>
                  <CoimTableCell>Type</CoimTableCell>
                  <CoimTableCell>Default</CoimTableCell>
                  <CoimTableCell>Notes</CoimTableCell>
                </CoimTableRow>
              </CoimTableHead>
              <CoimTableBody>
                {#each propsDocs as row (row.name)}
                  <CoimTableRow>
                    <CoimTableCell class="font-mono text-xs font-semibold">{row.name}</CoimTableCell>
                    <CoimTableCell class="font-mono text-xs">{row.type}</CoimTableCell>
                    <CoimTableCell class="text-xs">{row.defaultValue ?? "—"}</CoimTableCell>
                    <CoimTableCell class="text-sm">{row.description}</CoimTableCell>
                  </CoimTableRow>
                {/each}
              </CoimTableBody>
            </CoimTable>
          </CoimTableContainer>
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

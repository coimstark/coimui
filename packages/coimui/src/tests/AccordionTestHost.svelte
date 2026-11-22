<script lang="ts">
  import {
    CoimAccordion,
    CoimAccordionActions,
    CoimAccordionDetails,
    CoimAccordionGroup,
    CoimAccordionSummary,
  } from "../lib/components/surfaces/index.js";

  interface Props {
    groupValue?: string;
    standaloneExpanded?: boolean;
    onStandaloneChange?: (expanded: boolean) => void;
  }

  let {
    groupValue = $bindable("one"),
    standaloneExpanded = $bindable(false),
    onStandaloneChange,
  }: Props = $props();
</script>

<CoimAccordionGroup type="single" bind:value={groupValue} variant="bordered">
  <CoimAccordion value="one">
    <CoimAccordionSummary>Section One</CoimAccordionSummary>
    <CoimAccordionDetails>Body One</CoimAccordionDetails>
  </CoimAccordion>
  <CoimAccordion value="two">
    <CoimAccordionSummary>Section Two</CoimAccordionSummary>
    <CoimAccordionDetails>Body Two</CoimAccordionDetails>
    <CoimAccordionActions>
      <button type="button">Action</button>
    </CoimAccordionActions>
  </CoimAccordion>
</CoimAccordionGroup>

<CoimAccordion
  variant="surface"
  bind:expanded={standaloneExpanded}
  onChange={onStandaloneChange}
>
  <CoimAccordionSummary>Standalone Section</CoimAccordionSummary>
  <CoimAccordionDetails>Standalone Body</CoimAccordionDetails>
</CoimAccordion>

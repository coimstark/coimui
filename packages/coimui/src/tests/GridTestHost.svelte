<script lang="ts">
  import { CoimGrid } from "../lib/components/layout/index.js";
</script>

<CoimGrid container spacing={4} data-testid="grid-parent">
  <CoimGrid size={{ xs: 12, lg: 3 }} data-testid="grid-child-a">
    <div>A</div>
  </CoimGrid>
  <CoimGrid size={{ xs: 12, lg: 3 }} data-testid="grid-child-b">
    <div>B</div>
  </CoimGrid>
</CoimGrid>

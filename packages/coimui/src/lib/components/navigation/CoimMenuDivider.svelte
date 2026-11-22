<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    class?: string;
  }

  let { class: className = "" }: Props = $props();
</script>

<DropdownMenu.Separator class={cn("coim-menu-divider", className)} />

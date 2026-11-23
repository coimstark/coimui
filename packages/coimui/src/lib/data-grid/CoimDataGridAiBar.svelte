<script lang="ts" generics="TData extends Record<string, unknown> = Record<string, unknown>">
  import CiCross from "../icons/ui/CiCross.svelte";
  import CiRefresh from "../icons/ui/CiRefresh.svelte";
  import CiSparkle from "../icons/ui/CiSparkle.svelte";
  import type { CoimDataGridAiBarProps } from "./types.js";

  let { columns, aiProvider, onApplyResult, onReset, onClose }: CoimDataGridAiBarProps<TData> =
    $props();

  let prompt = $state("");
  let running = $state(false);
  let errorMsg = $state<string | null>(null);
  let lastSummary = $state<string | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!aiProvider || running) return;
    const trimmed = prompt.trim();
    if (!trimmed) return;
    running = true;
    errorMsg = null;
    try {
      const result = await aiProvider.executeQuery({
        prompt: trimmed,
        columns: columns
          .filter((c) => c.type !== "actions")
          .map((c) => ({
            id: c.id,
            headerName: c.headerName,
            type: c.type,
            options: c.options,
          })),
      });
      lastSummary = result.summary ?? `Applied query from ${aiProvider.label}.`;
      onApplyResult(result);
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : "Failed to execute AI query.";
    } finally {
      running = false;
    }
  }

  function handleResetClick() {
    prompt = "";
    lastSummary = null;
    errorMsg = null;
    onReset?.();
  }
</script>

<div
  role="region"
  aria-label="Data grid AI assistant"
  class="border-grey-50 bg-grey-25/50 border-b px-4 py-3 text-sm"
>
  <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
    <div class="flex items-center gap-2 font-semibold">
      <CiSparkle size="small" class="text-primary" />
      <span>AI Assistant</span>
      {#if aiProvider}
        <span class="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
          {aiProvider.label}
        </span>
      {:else}
        <span class="bg-warning/15 text-warning-pastel-fg rounded px-2 py-0.5 text-xs font-medium">
          Configuration Required
        </span>
      {/if}
    </div>
    {#if onClose}
      <button
        type="button"
        aria-label="Close AI assistant"
        class="border-grey-200 hover:bg-grey-100 inline-flex items-center gap-1 rounded border px-2 py-1 text-xs"
        onclick={onClose}
      >
        <CiCross size="small" />
        <span>Close</span>
      </button>
    {/if}
  </div>

  {#if !aiProvider}
    <div
      role="status"
      class="border-warning/30 bg-warning/10 text-text-primary mb-2 rounded-md border px-3 py-2 text-xs"
    >
      AI provider not configured. Supply an <code class="font-mono">aiProvider</code> adapter implementing
      <code class="font-mono">CoimDataGridAiProvider</code> to run natural-language filtering, sorting,
      grouping, or pivot queries.
    </div>
  {/if}

  <form class="flex flex-wrap items-center gap-2" onsubmit={handleSubmit}>
    <input
      type="text"
      bind:value={prompt}
      disabled={!aiProvider || running}
      aria-label="AI query prompt"
      placeholder={aiProvider
        ? "Ask your provider to filter, sort, group, or pivot rows..."
        : "AI prompt disabled until an aiProvider is configured"}
      class="border-grey-200 bg-background-paper min-w-64 flex-1 rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
    />
    <button
      type="submit"
      disabled={!aiProvider || running || prompt.trim().length === 0}
      class="bg-primary text-primary-contrast inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
    >
      <CiSparkle size="small" />
      <span>{running ? "Running..." : "Apply Prompt"}</span>
    </button>
    {#if aiProvider}
      <button
        type="button"
        aria-label="Reset AI filters"
        class="border-grey-200 hover:bg-grey-50 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm"
        onclick={handleResetClick}
      >
        <CiRefresh size="small" />
        <span>Reset</span>
      </button>
    {/if}
  </form>

  {#if errorMsg}
    <p role="alert" class="text-error mt-2 text-xs">{errorMsg}</p>
  {:else if lastSummary}
    <p role="status" class="text-text-secondary mt-2 text-xs">{lastSummary}</p>
  {/if}
</div>

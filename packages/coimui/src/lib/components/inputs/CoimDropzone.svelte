<script lang="ts">
  import type { Snippet } from "svelte";
  import CiCross from "../../icons/ui/CiCross.svelte";
  import CiDocumentFull from "../../icons/ui/CiDocumentFull.svelte";
  import CiUploadCloud from "../../icons/ui/CiUploadCloud.svelte";
  import { cn } from "../../utilities/utils.js";
  import type {
    CoimDropzoneAccept,
    CoimDropzoneRejection,
  } from "./types.js";
  import { toAcceptAttribute, validateDropzoneFile } from "./utils.js";

  interface Props {
    files?: File[];
    accept?: CoimDropzoneAccept;
    minSize?: number;
    maxSize?: number;
    maxFiles?: number;
    multiple?: boolean;
    outlined?: boolean;
    disabled?: boolean;
    showFileList?: boolean;
    title?: string;
    subtitle?: string;
    onDrop?: (acceptedFiles: File[], rejectedFiles: CoimDropzoneRejection[]) => void;
    onFilesChange?: (files: File[]) => void;
    children?: Snippet<[{ isDragActive: boolean; open: () => void }]>;
    class?: string;
  }

  let {
    files = $bindable<File[]>([]),
    accept,
    minSize,
    maxSize,
    maxFiles,
    multiple = true,
    outlined = true,
    disabled = false,
    showFileList = true,
    title = "Drop files here or click to upload",
    subtitle = "Select or drag files from your device",
    onDrop,
    onFilesChange,
    children,
    class: className = "",
  }: Props = $props();

  let inputEl = $state<HTMLInputElement | null>(null);
  let isDragActive = $state(false);
  let rejections = $state<CoimDropzoneRejection[]>([]);

  function openPicker() {
    if (disabled) return;
    inputEl?.click();
  }

  function processFiles(incoming: FileList | File[]) {
    if (disabled) return;
    const list = Array.from(incoming);
    const accepted: File[] = [];
    const rejected: CoimDropzoneRejection[] = [];

    for (const file of list) {
      const errors = validateDropzoneFile(file, { accept, minSize, maxSize });
      if (errors.length > 0) {
        rejected.push({ file, errors });
      } else {
        accepted.push(file);
      }
    }

    if (maxFiles !== undefined && accepted.length > maxFiles) {
      const overflow = accepted.splice(maxFiles);
      for (const file of overflow) {
        rejected.push({
          file,
          errors: [
            {
              code: "too-many-files",
              message: `Maximum ${maxFiles} file(s) allowed.`,
            },
          ],
        });
      }
    }

    rejections = rejected;
    if (accepted.length > 0) {
      const next = multiple ? [...files, ...accepted].slice(0, maxFiles) : [accepted[0]];
      files = next;
      onFilesChange?.(next);
    }
    onDrop?.(accepted, rejected);
  }

  function removeFile(index: number, event: Event) {
    event.stopPropagation();
    if (disabled) return;
    const next = files.filter((_, i) => i !== index);
    files = next;
    onFilesChange?.(next);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  }
</script>

<div class={cn("flex w-full flex-col gap-2", className)}>
  <div
    role="button"
    tabindex={disabled ? -1 : 0}
    aria-disabled={disabled || undefined}
    onclick={openPicker}
    onkeydown={handleKeyDown}
    ondragenter={(e) => {
      e.preventDefault();
      if (!disabled) isDragActive = true;
    }}
    ondragover={(e) => {
      e.preventDefault();
      if (!disabled) isDragActive = true;
    }}
    ondragleave={(e) => {
      e.preventDefault();
      isDragActive = false;
    }}
    ondrop={(e) => {
      e.preventDefault();
      isDragActive = false;
      if (e.dataTransfer?.files) {
        processFiles(e.dataTransfer.files);
      }
    }}
    class={cn(
      "coim-dropzone items-center justify-center",
      outlined && "coim-dropzone-outlined",
      isDragActive && "coim-dropzone-drag-active",
      rejections.length > 0 && "coim-dropzone-error",
      disabled && "coim-disabled",
    )}
  >
    <input
      bind:this={inputEl}
      type="file"
      accept={toAcceptAttribute(accept)}
      {multiple}
      {disabled}
      hidden
      onchange={(e) => {
        const target = e.currentTarget as HTMLInputElement;
        if (target.files) {
          processFiles(target.files);
          target.value = "";
        }
      }}
    />

    {#if children}
      {@render children({ isDragActive, open: openPicker })}
    {:else}
      <div class="flex flex-col items-center gap-1.5 text-center">
        <div class="bg-primary-light/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
          <CiUploadCloud size="medium" />
        </div>
        <div class="font-body text-text-primary text-base font-medium">{title}</div>
        <div class="font-body text-text-secondary text-sm">{subtitle}</div>
      </div>
    {/if}
  </div>

  {#if showFileList && files.length > 0}
    <ul class="m-0 flex list-none flex-col gap-1.5 p-0">
      {#each files as file, idx (file.name + idx)}
        <li class="border-grey-100 bg-background-paper flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm">
          <span class="flex min-w-0 items-center gap-2">
            <CiDocumentFull size="small" class="text-primary shrink-0" />
            <span class="text-text-primary truncate font-medium">{file.name}</span>
            <span class="text-text-secondary text-xs">({Math.round(file.size / 1024)} KB)</span>
          </span>
          <button
            type="button"
            aria-label="Remove {file.name}"
            onclick={(e) => removeFile(idx, e)}
            class="text-text-secondary hover:text-error inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-xs border-0 bg-transparent"
          >
            <CiCross size="tiny" />
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  {#if rejections.length > 0}
    <div role="alert" class="text-error font-body text-sm">
      {#each rejections as rej, rIdx (rej.file.name + rIdx)}
        <div>{rej.errors.map((e) => e.message).join(" ")}</div>
      {/each}
    </div>
  {/if}
</div>

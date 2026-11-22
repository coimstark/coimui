<script lang="ts">
  import {
    CoimAvatar,
    CoimAvatarGroup,
    CoimBadge,
    CoimChip,
    CoimList,
    CoimListItem,
    CoimListItemButton,
    CoimListItemText,
    CoimListSubheader,
    CoimRichTreeView,
    CoimSimpleTreeView,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTablePagination,
    CoimTableRow,
    CoimTableSortLabel,
    CoimTimeline,
    CoimTimelineConnector,
    CoimTimelineContent,
    CoimTimelineDot,
    CoimTimelineItem,
    CoimTimelineOppositeContent,
    CoimTimelineSeparator,
    CoimTooltip,
    CoimTooltipProvider,
    CoimTreeItem,
    type CoimAvatarItem,
    type CoimTreeItemData,
  } from "../lib/components/data-display/index.js";

  interface Props {
    onDeleteChip?: () => void;
    onSortToggle?: (direction: "asc" | "desc") => void;
    onPageChange?: (page: number) => void;
    onListAction?: () => void;
    onTreeSelect?: (ids: string[]) => void;
  }

  let {
    onDeleteChip,
    onSortToggle,
    onPageChange,
    onListAction,
    onTreeSelect,
  }: Props = $props();

  let sortDir = $state<"asc" | "desc">("asc");
  let page = $state(0);
  let simpleExpanded = $state<string[]>(["src"]);
  let simpleSelected = $state<string[]>(["index"]);
  let richItems = $state<CoimTreeItemData[]>([
    {
      id: "workspace",
      label: "Workspace",
      children: [
        { id: "readme", label: "README.md", editable: true },
        { id: "locked", label: "Locked", disabled: true },
      ],
    },
  ]);

  const avatars: CoimAvatarItem[] = [
    { id: "1", alt: "Ada Lovelace" },
    { id: "2", alt: "Grace Hopper" },
    { id: "3", alt: "Alan Turing" },
  ];
</script>

<CoimTooltipProvider>
  <div data-testid="data-display-host">
    <CoimAvatarGroup {avatars} max={2} />
    <CoimAvatar initials="CU" alt="Coim User" />

    <CoimBadge badgeContent={15} max={9} color="primary">
      <span>Inbox</span>
    </CoimBadge>

    <CoimChip label="Filter Tag" deletable color="primary" onDelete={onDeleteChip} />

    <CoimTooltip title="Helpful hint" placement="bottom">
      <button type="button">Hover me</button>
    </CoimTooltip>

    <CoimList>
      <CoimListSubheader>Navigation</CoimListSubheader>
      <CoimListItem>
        <CoimListItemText primary="Static row" secondary="Description" />
      </CoimListItem>
      <CoimListItemButton onclick={onListAction}>
        <CoimListItemText primary="Interactive row" />
      </CoimListItemButton>
    </CoimList>

    <CoimTableContainer>
      <CoimTable>
        <CoimTableHead>
          <CoimTableRow>
            <CoimTableCell>
              <CoimTableSortLabel
                active={true}
                direction={sortDir}
                onclick={() => {
                  sortDir = sortDir === "asc" ? "desc" : "asc";
                  onSortToggle?.(sortDir);
                }}
              >
                Revenue
              </CoimTableSortLabel>
            </CoimTableCell>
          </CoimTableRow>
        </CoimTableHead>
        <CoimTableBody>
          <CoimTableRow>
            <CoimTableCell>12500</CoimTableCell>
          </CoimTableRow>
        </CoimTableBody>
      </CoimTable>
      <CoimTablePagination
        count={24}
        bind:page
        rowsPerPage={10}
        onPageChange={(next) => onPageChange?.(next)}
      />
    </CoimTableContainer>

    <CoimTimeline position="alternate">
      <CoimTimelineItem>
        <CoimTimelineOppositeContent>09:30</CoimTimelineOppositeContent>
        <CoimTimelineSeparator>
          <CoimTimelineDot color="primary" />
          <CoimTimelineConnector />
        </CoimTimelineSeparator>
        <CoimTimelineContent>Release started</CoimTimelineContent>
      </CoimTimelineItem>
      <CoimTimelineItem>
        <CoimTimelineSeparator>
          <CoimTimelineDot variant="outlined" color="success" />
        </CoimTimelineSeparator>
        <CoimTimelineContent>Verified</CoimTimelineContent>
      </CoimTimelineItem>
    </CoimTimeline>

    <CoimSimpleTreeView
      bind:expandedItems={simpleExpanded}
      bind:selectedItems={simpleSelected}
      checkboxSelection
      multiSelect
      onSelectedItemsChange={(_e, ids) => onTreeSelect?.(ids)}
    >
      <CoimTreeItem itemId="src" label="src">
        <CoimTreeItem itemId="index" label="index.ts" />
        <CoimTreeItem itemId="utils" label="utils.ts" />
      </CoimTreeItem>
    </CoimSimpleTreeView>

    <CoimRichTreeView
      items={richItems}
      defaultExpandedItems={["workspace"]}
      onItemLabelChange={(id, nextLabel) => {
        richItems = richItems.map((group) => ({
          ...group,
          children: group.children?.map((child) =>
            child.id === id ? { ...child, label: nextLabel } : child,
          ),
        }));
      }}
    />
  </div>
</CoimTooltipProvider>

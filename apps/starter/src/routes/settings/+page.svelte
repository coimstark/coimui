<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimFormControlLabel,
    CoimSelect,
    CoimStack,
    CoimSwitch,
    CoimTab,
    CoimTabPanel,
    CoimTabs,
    CoimTextField,
    CoimTypography,
    Elevation,
    THEME_OPTIONS,
    type ThemeVariant,
    getThemeContext,
    toast,
  } from "@coimui/svelte";
  import { starterI18n } from "#lib/i18n.svelte.ts";

  const theme = getThemeContext();

  const themeChoices = [
    { value: THEME_OPTIONS.PURPLE, label: "Purple" },
    { value: THEME_OPTIONS.BLUE, label: "Blue" },
    { value: THEME_OPTIONS.GREEN, label: "Green" },
    { value: THEME_OPTIONS.ORANGE, label: "Orange" },
  ];

  let activeTab = $state("appearance");
  let emailAlerts = $state(true);
  let releaseAlerts = $state(true);
  let workspaceTitle = $state("CoimUI Production");
</script>

<svelte:head>
  <title>CoimUI Starter — {starterI18n.t("nav-settings")}</title>
</svelte:head>

<CoimStack spacing={6} class="max-w-3xl">
  <div>
    <CoimBreadcrumbs items={[{ label: starterI18n.t("nav-overview"), href: "/" }, { label: starterI18n.t("nav-settings") }]} />
    <CoimTypography variant="h1" class="mt-2">{starterI18n.t("nav-settings")}</CoimTypography>
  </div>

  <CoimTabs bind:value={activeTab} hairline>
    {#snippet tabs()}
      <CoimTab value="appearance" label="Appearance" />
      <CoimTab value="notifications" label="Notifications" />
      <CoimTab value="workspace" label="Workspace" />
    {/snippet}

    <CoimTabPanel value="appearance">
      <CoimCard>
        <CoimCardContent>
          <CoimStack spacing={4}>
            <CoimSelect
              label="Color Palette"
              value={theme.theme}
              onValueChange={(next) => {
                if (typeof next === "string") {
                  theme.setTheme(next as ThemeVariant);
                }
              }}
              options={themeChoices}
              fullWidth
            />
            <CoimFormControlLabel label="Dark Mode">
              <CoimSwitch
                checked={theme.isDarkMode}
                onCheckedChange={(dark) => theme.setMode(dark ? "dark" : "light")}
              />
            </CoimFormControlLabel>
            <CoimFormControlLabel label="Flat Card Elevation">
              <CoimSwitch
                checked={theme.elevation === Elevation.Flat}
                onCheckedChange={(flat) => theme.setElevation(flat ? Elevation.Flat : Elevation.Elevated)}
              />
            </CoimFormControlLabel>
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimTabPanel>

    <CoimTabPanel value="notifications">
      <CoimCard>
        <CoimCardContent>
          <CoimStack spacing={3}>
            <CoimFormControlLabel label="Email activity alerts">
              <CoimSwitch bind:checked={emailAlerts} />
            </CoimFormControlLabel>
            <CoimFormControlLabel label="Release announcement notifications">
              <CoimSwitch bind:checked={releaseAlerts} />
            </CoimFormControlLabel>
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimTabPanel>

    <CoimTabPanel value="workspace">
      <CoimCard>
        <CoimCardContent>
          <CoimStack spacing={4}>
            <CoimTextField label="Workspace Display Name" bind:value={workspaceTitle} fullWidth />
            <div>
              <CoimButton variant="contained" onclick={() => toast.success(`Updated "${workspaceTitle}"`)}>
                Save Workspace Settings
              </CoimButton>
            </div>
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimTabPanel>
  </CoimTabs>
</CoimStack>

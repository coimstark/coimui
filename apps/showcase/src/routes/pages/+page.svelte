<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";

  const sections = [
    { title: "Ecommerce", desc: "Products tables, cards, dense SKUs, filters, product detail, orders & invoices.", href: "/pages/ecommerce" },
    { title: "Support Desk", desc: "Issue metrics overview, ticket queue, issue detail & creation.", href: "/pages/support/overview" },
    { title: "User Profile", desc: "Overview activity, friends, permissions matrix, projects & social stream.", href: "/pages/user/overview" },
    { title: "Miscellaneous", desc: "Knowledge base, articles, email HTML templates, search, empty states, pricing & FAQ.", href: "/pages/miscellaneous" },
    { title: "Authentication Suite", desc: "Sign in, sign up, forgot/reset password, OTP verification, privacy & terms.", href: "/pages/auth/sign-in" },
    { title: "Menu Levels", desc: "Five-level deep nested navigation routes and breadcrumb hierarchy.", href: "/menu-levels" },
    { title: "Account Settings", desc: "Profile identity, department metadata & notification controls.", href: "/settings" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Pages Directory</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pages" }]} />
    <CoimTypography variant="h1" class="mt-2">Application &amp; Template Pages</CoimTypography>
    <p class="text-text-secondary mt-1">
      Complete vertical template suites, user profiles, authentication flows, and operational screens.
    </p>
  </div>

  <CoimGrid container spacing={4}>
    {#each sections as sec (sec.href)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 4 }}>
        <CoimCard class="flex h-full flex-col justify-between">
          <div>
            <CoimCardHeader title={sec.title} />
            <CoimCardContent>
              <p class="text-text-secondary text-sm">{sec.desc}</p>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton href={sec.href} size="small" variant="contained">Open Section</CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</CoimStack>

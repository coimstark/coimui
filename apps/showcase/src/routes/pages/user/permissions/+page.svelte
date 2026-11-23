<script lang="ts">
  import {
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimSwitch,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    toast,
  } from "@coimui/svelte";
  import { userProfileStore } from "#lib/pages/user.svelte.ts";
  import UserProfileShell from "#lib/pages/UserProfileShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — User Permissions</title>
</svelte:head>

<UserProfileShell title="Role Permissions Matrix" subtitle="Configure workspace read, write, and admin grants.">
  <CoimCard>
    <CoimCardHeader title="Capability Access Grants" />
    <CoimCardContent>
      <CoimTableContainer>
        <CoimTable aria-label="User permissions">
          <CoimTableHead>
            <CoimTableRow>
              <CoimTableCell component="th">Capability Scope</CoimTableCell>
              <CoimTableCell component="th">Read</CoimTableCell>
              <CoimTableCell component="th">Write</CoimTableCell>
              <CoimTableCell component="th">Admin</CoimTableCell>
            </CoimTableRow>
          </CoimTableHead>
          <CoimTableBody>
            {#each userProfileStore.permissions as perm (perm.id)}
              <CoimTableRow>
                <CoimTableCell>
                  <p class="font-medium text-sm">{perm.scope}</p>
                  <p class="text-text-secondary text-xs">{perm.description}</p>
                </CoimTableCell>
                <CoimTableCell>
                  <CoimSwitch
                    aria-label={`${perm.scope} Read`}
                    checked={perm.read}
                    onCheckedChange={() => {
                      userProfileStore.togglePermission(perm.id, "read");
                      toast.info(`Updated read scope for ${perm.scope}`);
                    }}
                  />
                </CoimTableCell>
                <CoimTableCell>
                  <CoimSwitch
                    aria-label={`${perm.scope} Write`}
                    checked={perm.write}
                    onCheckedChange={() => {
                      userProfileStore.togglePermission(perm.id, "write");
                      toast.info(`Updated write scope for ${perm.scope}`);
                    }}
                  />
                </CoimTableCell>
                <CoimTableCell>
                  <CoimSwitch
                    aria-label={`${perm.scope} Admin`}
                    checked={perm.admin}
                    onCheckedChange={() => {
                      userProfileStore.togglePermission(perm.id, "admin");
                      toast.info(`Updated admin scope for ${perm.scope}`);
                    }}
                  />
                </CoimTableCell>
              </CoimTableRow>
            {/each}
          </CoimTableBody>
        </CoimTable>
      </CoimTableContainer>
    </CoimCardContent>
  </CoimCard>
</UserProfileShell>

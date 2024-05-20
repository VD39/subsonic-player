<script setup lang="ts">
import SidebarNavigation from '@/components/Sidebar/SidebarNavigation.vue';
import SearchForm from '@/components/Forms/SearchForm.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import DropdownDivider from '@/components/Dropdown/DropdownDivider.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher.vue';
import MusicLogo from '@/components/Logo/MusicLogo.vue';
import MainLoader from '@/components/Loaders/MainLoader.vue';

const user = useUser();
const { logout } = useAuth();
const loading = useLoading();

async function logoutAndRedirect() {
  await logout();
  await navigateTo('/login');
}

async function search(term: string) {
  await navigateTo(`/search/albums/${term}`);
}
</script>

<template>
  <div :class="$style.mainLayout">
    <header :class="$style.header">
      <div :class="$style.innerHeader">
        <MusicLogo :class="$style.logo" />

        <div :class="$style.search">
          <SearchForm @submit="search" />
        </div>

        <div v-if="user" ref="userDetails" :class="$style.secondary">
          <div :class="$style.secondaryItem">
            <ThemeSwitcher />
          </div>

          <div :class="$style.secondaryItem">
            <DropdownMenu
              show-text
              :text="user.username!"
              title="View account details"
            >
              <DropdownItem to="/user-profile">Profile</DropdownItem>
              <DropdownItem is="a" :href="user.server" target="_blank">
                Server
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                is="button"
                ref="logoutButton"
                icon="PhSignOut"
                @click="logoutAndRedirect"
              >
                Log out
              </DropdownItem>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>

    <aside :class="$style.sidebarNavigation">
      <SidebarNavigation />
    </aside>

    <main :class="$style.mainContent">
      <div v-show="loading" ref="mainLoader">
        <MainLoader />
      </div>

      <div v-show="!loading" ref="mainContent" :class="$style.mainContentInner">
        <slot />
      </div>
    </main>
  </div>
</template>

<style module>
.mainLayout {
  display: flex;
}

.header {
  @mixin align-center;

  position: fixed;
  inset: 0 0 auto;
  z-index: 2;
  min-height: var(--header-height);
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--box-shadow-medium);

  @media (--tablet-up) {
    margin-left: var(--sidebar-width);
  }
}

.innerHeader {
  @mixin align-center;
  @mixin inner;

  position: relative;
  gap: var(--space-24);
  justify-content: space-between;
}

.logo {
  @media (--tablet-up) {
    display: none;
  }
}

.search {
  width: 65%;

  @media (--tablet-up) {
    width: 50%;
  }
}

.secondary {
  @mixin align-center;

  gap: var(--space-12);
  margin-right: calc(var(--space-8) * -2);
}

.mainContent {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 100vh;

  @media (--tablet-up) {
    margin-left: var(--sidebar-width);
  }
}

.mainContentInner {
  @mixin inner;

  padding: calc(var(--header-height) + var(--space-32)) 0;

  @media (--tablet-up) {
    padding-bottom: var(--space-32);
  }
}

/* stylelint-disable selector-class-pattern */
:global {
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.35s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(100%);
  }
}
/* stylelint-enable selector-class-pattern */
</style>

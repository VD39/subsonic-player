<script setup lang="ts">
import SidebarNavigation from '@/components/Sidebar/SidebarNavigation.vue';
import SearchForm from '@/components/Forms/SearchForm.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import DropdownDivider from '@/components/Dropdown/DropdownDivider.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher.vue';
import MainLoader from '@/components/Loaders/MainLoader.vue';

const user = useUser();
const { logout } = useAuth();
const { width } = useSidebar();
const loading = useLoading();

function logoutAndRedirect() {
  logout();
  navigateTo('/login');
}
</script>

<template>
  <div :class="$style.mainLayout">
    <header :class="$style.header" :style="{ marginLeft: width }">
      <div :class="$style.innerHeader">
        <div :class="$style.search">
          <SearchForm />
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
                icon="right-from-bracket"
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

    <main :class="$style.mainContent" :style="{ marginLeft: width }">
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
  z-index: 1;
  min-height: var(--header-height);
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--box-shadow-medium);
}

.innerHeader {
  @mixin align-center;
  @mixin inner;

  position: relative;
  justify-content: space-between;
}

.search {
  width: 50%;
}

.secondary {
  @mixin align-center;

  gap: var(--space-12);
}

.mainContent {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 100vh;
}

.mainContentInner {
  @mixin inner;

  padding-top: calc(var(--header-height) + var(--space-32));
  padding-bottom: var(--space-40);
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

<script setup lang="ts">
import SidebarNavigation from '@/components/Sidebar/SidebarNavigation.vue';
import SearchForm from '@/components/Forms/SearchForm.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import DropdownDivider from '@/components/Dropdown/DropdownDivider.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher.vue';
import MusicLogo from '@/components/Logo/MusicLogo.vue';
import MainLoader from '@/components/Loaders/MainLoader.vue';
import MusicPlayer from '@/components/Player/MusicPlayer.vue';

const user = useUser();
const { logout } = useAuth();
const loading = useLoading();
const { showMediaPlayer } = useAudioPlayer();

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
              <DropdownItem is="nuxt-link" to="/user-profile">
                Profile
              </DropdownItem>
              <DropdownItem is="a" :href="user.server" target="_blank">
                Server
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
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

    <aside>
      <SidebarNavigation />
    </aside>

    <main :class="['main', $style.mainContent]">
      <div v-show="loading" ref="mainLoader">
        <MainLoader />
      </div>

      <div v-show="!loading" ref="mainContent" :class="$style.mainContentInner">
        <slot />
      </div>
    </main>

    <footer>
      <transition name="slide-up-down">
        <MusicPlayer v-if="showMediaPlayer" />
      </transition>
    </footer>
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
  --default-padding: calc(var(--sidebar-bottom) + var(--space-40));

  @mixin inner;

  display: flex;
  flex-flow: column nowrap;
  padding: calc(var(--header-height) + var(--space-40)) 0
    calc(var(--header-height) + var(--default-padding));

  @media (--tablet-up) {
    padding-bottom: var(--default-padding);
  }
}
</style>

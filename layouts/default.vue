<script setup lang="ts">
import HotkeyMappings from '@/components/Atoms/HotkeyMappings.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import LayoutButton from '@/components/Molecules/LayoutButton.vue';
import MobileNavigation from '@/components/Molecules/MobileNavigation.vue';
import MusicLogo from '@/components/Molecules/MusicLogo.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import SearchForm from '@/components/Molecules/SearchForm.vue';
import ThemeSwitcher from '@/components/Molecules/ThemeSwitcher.vue';
import MusicPlayerAndQueue from '@/components/Organisms/MusicPlayerAndQueue/MusicPlayerAndQueue.vue';
import SidebarNavigation from '@/components/Organisms/SidebarNavigation/SidebarNavigation.vue';

const route = useRoute();
const user = useUser();
const { logoutAndRedirect } = useAuth();
const { startScan } = useMediaLibrary();
const { HOTKEYS_MAPPINGS, isHotkeyListOpened } = useHotkeyManager();

async function search(term: string) {
  await navigateTo({
    name: ROUTE_NAMES.search,
    params: {
      [ROUTE_PARAM_KEYS.search.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Albums,
      [ROUTE_PARAM_KEYS.search.query]: term,
    },
  });
}

const showPageNavigation = computed(() =>
  PAGE_NAVIGATION_ROUTES.includes(route.name as RouteName),
);
</script>

<template>
  <div :class="$style.mainLayout">
    <header :class="['centerItems', $style.header]">
      <div class="spaceBetween inner centerItems">
        <MusicLogo class="mobileOnly" />

        <div :class="$style.search">
          <SearchForm @submit="search" />
        </div>

        <div
          v-if="user"
          ref="userDetails"
          :class="['centerItems', $style.secondary]"
        >
          <div :class="$style.secondaryItem">
            <LayoutButton />
          </div>

          <div :class="$style.secondaryItem">
            <ThemeSwitcher />
          </div>

          <div :class="$style.secondaryItem">
            <DropdownMenu
              showText
              :text="user.username!"
              title="View account details"
            >
              <DropdownItem
                is="nuxt-link"
                :to="{
                  name: ROUTE_NAMES.userProfile,
                }"
              >
                Profile
              </DropdownItem>
              <DropdownItem
                is="nuxt-link"
                :to="{
                  name: ROUTE_NAMES.files,
                }"
              >
                Files
              </DropdownItem>
              <DropdownItem is="a" :href="user.server" target="_blank">
                Server
              </DropdownItem>
              <DropdownItem ref="scan" @click="startScan">Scan</DropdownItem>
              <DropdownDivider />
              <DropdownItem
                ref="logoutButton"
                :icon="ICONS.signOut"
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
      <SidebarNavigation class="desktopOnly" />

      <MobileNavigation class="mobileOnly" />
    </aside>

    <main :class="['main', $style.mainContent]">
      <div
        :class="[
          'column',
          $style.mainContentInner,
          {
            [$style.noPaddingTop]: showPageNavigation,
          },
        ]"
      >
        <PageNavigation
          v-if="showPageNavigation"
          class="mobileOnly mBL"
          :navigation="MOBILE_PAGE_NAVIGATION"
        />

        <div class="column inner mBAllL">
          <slot />
        </div>
      </div>
    </main>

    <footer>
      <MusicPlayerAndQueue />

      <transition name="slide-up-down">
        <HotkeyMappings
          v-if="isHotkeyListOpened"
          :keyMappings="HOTKEYS_MAPPINGS"
        />
      </transition>
    </footer>
  </div>
</template>

<style module>
.mainLayout {
  display: flex;
}

.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 10;
  min-height: var(--header-height);
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--box-shadow-medium);

  @media (--tablet-up) {
    margin-left: var(--sidebar-width);
  }
}

.search {
  --search-width: 65%;

  width: var(--search-width);

  @media (--tablet-up) {
    --search-width: 50%;
  }
}

.secondary {
  gap: var(--default-space);
  margin-right: calc(var(--default-space) * -2);
}

.mainContent {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 100vh;
  overflow: hidden;

  @media (--tablet-up) {
    margin-left: var(--sidebar-width);
  }
}

.mainContentInner {
  --main-width: 100vw;
  --main-padding-top: calc(var(--header-height) + var(--space-40));
  --main-padding-bottom: calc(
    var(--sidebar-bottom) + var(--space-40) + var(--header-height)
  );

  width: var(--main-width);
  padding: var(--main-padding-top) 0 var(--main-padding-bottom);

  @media (--tablet-up) {
    --main-width: calc(100vw - var(--sidebar-width));
    --main-padding-bottom: calc(var(--sidebar-bottom) + var(--space-40));
  }
}

.noPaddingTop {
  @media (--mobile-only) {
    --main-padding-top: var(--header-height);
  }
}
</style>

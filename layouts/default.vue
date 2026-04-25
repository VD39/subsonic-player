<script setup lang="ts">
import HotkeyMappings from '@/components/Atoms/HotkeyMappings.vue';
import LayoutButton from '@/components/Molecules/LayoutButton.vue';
import MobileNavigation from '@/components/Molecules/MobileNavigation.vue';
import MusicLogo from '@/components/Molecules/MusicLogo.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import SearchForm from '@/components/Molecules/SearchForm.vue';
import ThemeSwitcher from '@/components/Molecules/ThemeSwitcher.vue';
import UserMenu from '@/components/Molecules/UserMenu.vue';
import MusicPlayerAndQueue from '@/components/Organisms/MusicPlayerAndQueue/MusicPlayerAndQueue.vue';
import SidebarNavigation from '@/components/Organisms/SidebarNavigation/SidebarNavigation.vue';

const route = useRoute();

async function onSubmit(term: string) {
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
          <SearchForm @submit="onSubmit" />
        </div>

        <div :class="['centerItems', $style.secondary]">
          <LayoutButton />

          <ThemeSwitcher />

          <UserMenu />
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
      <HotkeyMappings />
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

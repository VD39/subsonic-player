<script setup lang="ts">
import MobileNavigation from '@/components/navigation/MobileNavigation.vue';
import MusicLogo from '@/components/navigation/MusicLogo.vue';
import PageNavigation from '@/components/navigation/PageNavigation.vue';
import SidebarNavigation from '@/components/navigation/SidebarNavigation.vue';
import UserMenu from '@/components/navigation/UserMenu.vue';
import MusicPlayerAndQueue from '@/components/player/MusicPlayerAndQueue.vue';
import SearchForm from '@/components/search/SearchForm.vue';
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts.vue';

const {
  mobileNavigation,
  mobilePageNavigation,
  showPageNavigation,
  sidebarNavigation,
} = useNavigation();
</script>

<template>
  <div :class="$style.mainLayout">
    <header :class="['centerItems', $style.header]">
      <div class="spaceBetween inner centerItems">
        <MusicLogo class="mobileOnly" />

        <div :class="$style.search">
          <SearchForm />
        </div>

        <div :class="['centerItems', $style.secondary]">
          <UserMenu />
        </div>
      </div>
    </header>

    <aside aria-label="Sidebar">
      <SidebarNavigation class="desktopOnly" :navigation="sidebarNavigation" />

      <MobileNavigation class="mobileOnly" :navigation="mobileNavigation" />
    </aside>

    <main :class="['main', $style.mainContent]" tabindex="-1">
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
          :navigation="mobilePageNavigation"
        />

        <div class="column inner mBAllL">
          <slot />
        </div>
      </div>
    </main>

    <div>
      <ClientOnly>
        <MusicPlayerAndQueue />
      </ClientOnly>
      <KeyboardShortcuts />
    </div>
  </div>
</template>

<style module>
.mainLayout {
  display: flex;
}

.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 15;
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
  min-height: 100svh;
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

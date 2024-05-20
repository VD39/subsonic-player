<script setup lang="ts">
import SidebarItems from '@/components/Sidebar/SidebarItems.vue';
import IconButton from '@/components/Buttons/IconButton.vue';
import MusicLogo from '@/components/Logo/MusicLogo.vue';

const { collapsed, toggle } = useSidebar();

const buttonProps = computed<ButtonProps>(() =>
  collapsed.value
    ? {
        icon: 'PhTextIndent',
        text: 'Open Navigation',
      }
    : {
        icon: 'PhTextOutdent',
        text: 'Close Navigation',
      },
);
</script>

<template>
  <div :class="$style.sideBar">
    <div :class="$style.header">
      <MusicLogo :class="$style.logo" />

      <IconButton
        ref="toggleButton"
        :icon="buttonProps.icon"
        :title="buttonProps.text"
        @click="toggle"
      >
        {{ buttonProps.text }}
      </IconButton>
    </div>

    <nav :class="$style.navigationWrapper">
      <ul :class="$style.navigation">
        <SidebarItems
          v-for="(item, index) in SIDEBAR_NAVIGATION"
          :key="`navigation-${index}`"
          :title="item.title"
          :title-icon="item.icon"
          :title-to="item.to"
          :items="item.items"
        />
      </ul>
    </nav>
  </div>
</template>

<style module>
.sideBar {
  @mixin align-center;

  position: fixed;
  inset: auto 0 0;
  z-index: 1;
  width: 100%;
  height: var(--header-height);
  padding-top: 0;
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
  transition: width var(--transition);

  @media (--tablet-up) {
    inset: 0 auto 0 0;
    display: unset;
    width: var(--sidebar-width);
    height: auto;
    min-height: 100vh;
    overflow-x: auto;
    border-top: none;
    border-right: 1px solid var(--border-color);
  }
}

.header {
  display: none;

  @media (--tablet-up) {
    @mixin align-center;

    justify-content: space-between;
    min-height: var(--header-height);
    padding: 0 var(--space-16) 0 var(--space-24);
    margin-bottom: var(--space-16);

    :global(.collapsed) & {
      justify-content: center;
      padding: 0 var(--space-24);
    }
  }
}

.logo {
  :global(.collapsed) & {
    @mixin visually-hidden;
  }
}

.navigationWrapper {
  width: 100%;
}

.navigation {
  @media (--mobile-only) {
    @mixin inner;

    display: flex;
    gap: var(--space-40);
    justify-content: space-between;
    font-size: var(--small-font-size);
  }
}
</style>

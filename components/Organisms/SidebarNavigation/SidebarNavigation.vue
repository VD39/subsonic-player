<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import MusicLogo from '@/components/Molecules/MusicLogo.vue';

import PlaylistNavigation from './PlaylistNavigation.vue';
import PrimaryNavigation from './PrimaryNavigation.vue';

const { collapsed, toggle } = useSidebar();

const buttonProps = computed<ButtonProps>(() => ({
  icon: collapsed.value ? ICONS.sidebarCollapsed : ICONS.sidebarNotCollapsed,
  text: collapsed.value ? 'Open Navigation' : 'Close Navigation',
}));
</script>

<template>
  <div
    :class="[
      'centerItems',
      'column',
      $style.sidebarNavigation,
      {
        [$style.collapsed]: collapsed,
      },
    ]"
  >
    <div :class="['mBM', 'centerAll', 'spaceBetween', $style.header]">
      <MusicLogo :class="$style.musicLogo" />

      <ButtonLink
        ref="toggleButton"
        :icon="buttonProps.icon"
        :title="buttonProps.text"
        @click="toggle"
      >
        {{ buttonProps.text }}
      </ButtonLink>
    </div>

    <nav class="fullWidth">
      <PrimaryNavigation :collapsed="collapsed" />

      <PlaylistNavigation :collapsed="collapsed" />
    </nav>
  </div>
</template>

<style module>
.sidebarNavigation {
  position: fixed;
  inset: 0 auto var(--sidebar-bottom) 0;
  z-index: 9;
  width: var(--sidebar-width);
  padding-top: 0;
  overflow-x: auto;
  background-color: var(--background-color);
  border-right: 1px solid var(--border-color);
  transition: width var(--transition);
}

.header {
  --header-padding: 0 var(--space-16) 0 var(--space-24);

  min-height: var(--header-height);
  padding: var(--header-padding);

  .collapsed & {
    --header-padding: 0 var(--space-24);
  }
}

.musicLogo {
  .collapsed & {
    display: none;
  }
}
</style>

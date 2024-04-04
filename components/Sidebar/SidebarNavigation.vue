<script setup lang="ts">
import SidebarItems from '@/components/Sidebar/SidebarItems.vue';
import IconButton from '@/components/Buttons/IconButton.vue';

const { collapsed, navigation, toggle, width } = useSidebar();

const buttonProps = computed<ButtonProps>(() =>
  collapsed.value
    ? { icon: 'angles-right', text: 'Open Navigation' }
    : { icon: 'angles-left', text: 'Close Navigation' },
);
</script>

<template>
  <div :class="$style.sideBar" :style="{ width: width }">
    <div :class="$style.header">
      <IconButton
        is="nuxt-link"
        icon="wave-square"
        title="Home"
        icon-size="xl"
        :class="$style.logo"
        to="/"
      >
        Home
      </IconButton>

      <IconButton
        ref="toggleButton"
        :icon="buttonProps.icon"
        :title="buttonProps.text"
        @click="toggle"
      >
        {{ buttonProps.text }}
      </IconButton>
    </div>

    <nav>
      <ul :class="$style.navigation">
        <SidebarItems
          v-for="(item, index) in navigation"
          :key="`navigation-${index}`"
          :title="item.title"
          :items="item.items"
        />
      </ul>
    </nav>
  </div>
</template>

<style module>
.sideBar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 2;
  min-height: 100vh;
  padding-top: 0;
  overflow-x: auto;
  background-color: var(--background-color);
  border-right: 1px solid var(--border-color);
  transition: width var(--transition);
}

.header {
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

.logo {
  :global(.collapsed) & {
    @mixin visually-hidden;
  }
}

.navigation {
  display: flex;
  flex-direction: column;
}
</style>

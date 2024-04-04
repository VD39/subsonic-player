<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { collapsed } = useSidebar();

withDefaults(
  defineProps<{
    items?: SidebarItem[];
    title?: string;
  }>(),
  {
    title: undefined,
    items: () => [],
  },
);
</script>

<template>
  <li :class="$style.sidebarItem">
    <h4 v-if="title" ref="title" :class="$style.title">
      {{ title }}
    </h4>

    <ul v-if="items.length" ref="items">
      <li
        v-for="(item, index) in items"
        :key="`item-${index}`"
        data-test-id="item"
      >
        <IconButton
          is="nuxt-link"
          :to="item.to"
          :icon="item.icon"
          :class="$style.link"
          :exact-active-class="$style.current"
          :show-text="!collapsed"
          :title="item.title"
        >
          {{ item.name }}
        </IconButton>
      </li>
    </ul>
  </li>
</template>

<style module>
.sidebarItem {
  margin-bottom: var(--space-16);

  :global(.collapsed) & {
    margin-bottom: auto;
  }
}

.title {
  padding-left: var(--space-24);

  :global(.collapsed) & {
    @mixin visually-hidden;
  }
}

.link {
  @mixin align-center;

  position: relative;
  padding: var(--space-8) var(--space-32);
  white-space: nowrap;

  &:hover {
    background-color: var(--hover-selected-color);
  }

  :global(.collapsed) & {
    justify-content: center;
  }
}

.current {
  font-weight: var(--font-weight-bold);
  background-color: var(--hover-selected-color);

  &::before {
    position: absolute;
    inset: 0 auto 0 0;
    display: inline-block;
    width: 5px;
    content: '';
    background-color: var(--theme-color);
  }
}
</style>

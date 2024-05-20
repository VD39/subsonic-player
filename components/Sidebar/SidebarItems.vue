<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { collapsed } = useSidebar();

withDefaults(
  defineProps<{
    items?: Navigation[];
    title?: string;
    titleIcon?: string;
    titleTo?: string;
  }>(),
  {
    items: () => [],
    title: undefined,
    titleIcon: undefined,
    titleTo: undefined,
  },
);
</script>

<template>
  <li :class="$style.sidebarItem">
    <NuxtLink
      v-if="title"
      ref="rootTitle"
      :to="titleTo"
      :class="$style.titleLink"
      :title="title"
    >
      <component
        :is="titleIcon"
        v-if="titleIcon"
        :class="$style.titleIcon"
        aria-hidden="true"
        weight="duotone"
        :size="32"
      />

      <h4 :class="$style.title">
        {{ title }}
      </h4>
    </NuxtLink>

    <ul v-if="items.length" ref="items" :class="$style.items">
      <li v-for="(item, index) in items" :key="`item-${index}`">
        <IconButton
          is="nuxt-link"
          v-if="!item.component"
          :to="item.to"
          :icon="item.icon"
          :class="$style.link"
          :exact-active-class="$style.current"
          :show-text="!collapsed"
          :title="item.title"
        >
          {{ item.title }}
        </IconButton>

        <component
          :is="item.component"
          v-if="item.component"
          data-test-id="item-component"
        />
      </li>
    </ul>
  </li>
</template>

<style module>
.sidebarItem {
  @media (--tablet-up) {
    margin-bottom: var(--space-16);

    :global(.collapsed) & {
      margin-bottom: 0;
    }
  }
}

.titleLink {
  @mixin align-center;

  flex-direction: column;
  justify-content: center;
  margin-bottom: 0;

  @media (--tablet-up) {
    display: unset;
    pointer-events: none;
  }
}

.titleIcon {
  @media (--tablet-up) {
    display: none;
  }
}

.title {
  @media (--mobile-only) {
    margin-bottom: 0;
    font-size: var(--small-font-size);
  }

  @media (--tablet-up) {
    padding-left: var(--space-24);

    :global(.collapsed) & {
      @mixin visually-hidden;
    }
  }
}

.items {
  display: none;

  @media (--tablet-up) {
    display: block;
  }
}

.link {
  @mixin sidebar-link;
}

.current {
  @mixin sidebar-current-link;
}
</style>

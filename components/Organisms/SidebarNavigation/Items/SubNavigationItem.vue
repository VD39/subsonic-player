<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

defineProps<{
  collapsed: boolean;
  icon: Icon;
  title: string;
  to: string;
}>();
</script>

<template>
  <li>
    <ButtonLink
      is="nuxt-link"
      :to="to"
      :icon="icon"
      class="sidebarLink"
      exact-active-class="sidebarCurrentLink"
      :show-text="!collapsed"
      :title="title"
    >
      {{ title }}
    </ButtonLink>
  </li>
</template>

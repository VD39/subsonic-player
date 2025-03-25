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
      class="sidebarLink"
      exact-active-class="sidebarCurrentLink"
      :icon="icon"
      :show-text="!collapsed"
      :title="title"
      :to="to"
    >
      {{ title }}
    </ButtonLink>
  </li>
</template>

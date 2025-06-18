<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

defineProps<{
  collapsed: boolean;
  icon: Icon;
  title: string;
  to: ToProp;
}>();
</script>

<template>
  <li>
    <ButtonLink
      is="nuxt-link"
      class="sidebarLink"
      exactActiveClass="sidebarCurrentLink"
      :icon
      :showText="!collapsed"
      :title
      :to
    >
      {{ title }}
    </ButtonLink>
  </li>
</template>

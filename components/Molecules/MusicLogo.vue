<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
</script>

<template>
  <ButtonLink
    is="nuxt-link"
    :icon="ICONS.logo"
    icon-size="large"
    title="Home"
    :to="{
      name: ROUTE_NAMES.index,
    }"
  >
    Home
  </ButtonLink>
</template>

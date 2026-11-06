<script setup lang="ts">
import ButtonLink from '@/components/ui/ButtonLink.vue';
</script>

<template>
  <ButtonLink
    is="nuxt-link"
    :icon="ICONS.logo"
    iconSize="large"
    title="Home"
    :to="{
      name: ROUTE_NAMES.index,
    }"
  >
    Home
  </ButtonLink>
</template>

<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
</script>

<template>
  <ButtonLink
    is="nuxt-link"
    :icon="ICONS.logo"
    title="Home"
    icon-size="large"
    to="/"
  >
    Home
  </ButtonLink>
</template>

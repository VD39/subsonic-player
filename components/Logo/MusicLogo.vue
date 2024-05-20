<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';
</script>

<template>
  <IconButton
    is="nuxt-link"
    icon="PhWaveSine"
    title="Home"
    :icon-size="32"
    to="/"
  >
    Home
  </IconButton>
</template>

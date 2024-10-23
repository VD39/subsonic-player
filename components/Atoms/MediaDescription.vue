<script setup lang="ts">
defineProps<{
  description: string;
}>();
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="description" />
</template>

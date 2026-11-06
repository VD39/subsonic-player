<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="text" />
</template>

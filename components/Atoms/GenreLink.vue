<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>

<template>
  <NuxtLink
    :to="`/genre/albums/${encodeURIComponent(name)}`"
    :class="['centerAll', $style.genreLink]"
  >
    {{ name }}
  </NuxtLink>
</template>

<style module>
.genreLink {
  --genre-link-background-color: var(--background-color);

  width: var(--width-height-100);
  min-height: 100px;
  padding: var(--default-space);
  text-align: center;
  background-color: var(--genre-link-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-small);

  &:hover,
  &:focus {
    --genre-link-background-color: var(--hover-selected-color);
  }
}
</style>

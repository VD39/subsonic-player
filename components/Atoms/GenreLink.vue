<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>

<template>
  <NuxtLink
    :aria-label="`View all albums with ${name} genre`"
    :class="['centerAll', $style.genreLink]"
    draggable="false"
    :to="{
      name: ROUTE_NAMES.genre,
      params: {
        [ROUTE_PARAM_KEYS.genre.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Albums,
        [ROUTE_PARAM_KEYS.genre.genre]: encodeURIComponent(name),
      },
    }"
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

  @media (hover: hover) {
    &:hover,
    &:focus {
      --genre-link-background-color: var(--hover-selected-color);
    }
  }
}
</style>

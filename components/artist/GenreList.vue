<script setup lang="ts">
defineProps<{
  genres: Genre[];
}>();
</script>

<template>
  <ul class="commaList">
    <li
      v-for="genre in genres"
      :key="genre.name"
      data-test-id="genre-list-item"
    >
      <NuxtLink
        :aria-label="`View all albums with ${genre.name} genre`"
        class="link"
        draggable="false"
        :to="{
          name: ROUTE_NAMES.genre,
          params: {
            [ROUTE_PARAM_KEYS.genre.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Albums,
            [ROUTE_PARAM_KEYS.genre.genre]: encodeURIComponent(genre.name),
          },
        }"
      >
        {{ genre.name }}
      </NuxtLink>
    </li>
  </ul>
</template>

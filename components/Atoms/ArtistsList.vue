<script setup lang="ts">
defineProps<{
  artists: BaseArtist[];
}>();
</script>

<template>
  <ul class="commaList">
    <li
      v-for="artist in artists"
      :key="artist.id"
      data-test-id="artist-list-item"
    >
      <NuxtLink
        :aria-label="`Go to artist ${artist.name}`"
        class="link"
        draggable="false"
        :to="{
          name: ROUTE_NAMES.artist,
          params: {
            [ROUTE_PARAM_KEYS.artist.id]: artist.id,
          },
        }"
      >
        {{ artist.name }}
      </NuxtLink>
    </li>
  </ul>
</template>

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
        :to="`/artist/${artist.id}`"
        class="link"
        :aria-label="`Go to artist ${artist.name}`"
      >
        {{ artist.name }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['playlist'],
});

const route = useRoute();
const { getImageUrl } = useAPI();
const { playlist, getPlaylistTracksById } = usePlaylist();

getPlaylistTracksById(route.params.id as string);
</script>

<template>
  <h1 v-if="playlist">
    {{ playlist.name }}
  </h1>

  <img :src="getImageUrl(playlist?.images?.[0])" alt="" />

  <pre>{{ playlist }}</pre>
</template>

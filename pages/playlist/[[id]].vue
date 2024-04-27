<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to) {
      if (!to.params.id) {
        return navigateTo('/playlist/random');
      }
    },
  ],
});

const route = useRoute();
const { getImageUrl } = useAPI();
const { playlist, getPlaylistById } = usePlaylist();

getPlaylistById(route.params.id as string);
</script>

<template>
  <h1 v-if="playlist">
    {{ playlist.name }}
  </h1>

  <img :src="getImageUrl(playlist?.images?.[0])" alt="" />

  <pre>{{ playlist }}</pre>
</template>

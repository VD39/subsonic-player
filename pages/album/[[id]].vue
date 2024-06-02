<script setup lang="ts">
definePageMeta({
  middleware: ['album'],
});

const route = useRoute();
const { getImageUrl } = useAPI();
const { album, getAlbum } = useAlbum();

getAlbum(route.params.id as string);
</script>

<template>
  <h1 v-if="album">
    {{ album.name }}
  </h1>

  <img :src="getImageUrl(album?.imageId)" alt="" />

  <pre>{{ album }}</pre>
</template>

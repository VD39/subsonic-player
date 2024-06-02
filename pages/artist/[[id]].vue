<script setup lang="ts">
definePageMeta({
  middleware: ['artist'],
});

const route = useRoute();
const { getImageUrl } = useAPI();
const { artist, getArtist } = useArtist();

getArtist(route.params.id as string);
</script>

<template>
  <div v-if="artist">
    <h1>
      {{ artist.name }}
    </h1>

    <img :src="getImageUrl(artist.imageId)" alt="" />

    <pre>{{ artist }}</pre>
  </div>
</template>

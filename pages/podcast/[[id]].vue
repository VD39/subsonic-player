<script setup lang="ts">
definePageMeta({
  middleware: ['podcast'],
});

const route = useRoute();
const { podcast, getPodcast } = usePodcast();

getPodcast(route.params.id as string);
</script>

<template>
  <h1 v-if="podcast">
    {{ podcast.title }}
  </h1>

  <img :src="podcast?.image" alt="" />

  <pre>{{ podcast }}</pre>
</template>

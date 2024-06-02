<script setup lang="ts">
definePageMeta({
  middleware: ['search'],
});

const route = useRoute();
const { search, searchResults } = useSearch();

const query = replaceCharactersWithSpace(route.params.query as string);

search({
  query,
  offset: 0,
});
</script>

<template>
  <h1>Search results for: {{ query }}</h1>

  <pre>{{ searchResults }}</pre>
</template>

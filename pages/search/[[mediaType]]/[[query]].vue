<script setup lang="ts">
import PageNavigation from '@/components/Navigation/PageNavigation.vue';
import AlbumsList from '@/components/MediaLists/AlbumsList.vue';
import ArtistsList from '@/components/MediaLists/ArtistsList.vue';
import TrackListWithPreview from '@/components/MediaLists/TrackListWithPreview.vue';

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

  <PageNavigation :navigation="SEARCH_NAVIGATION" />

  <AlbumsList
    v-if="route.params.mediaType === 'albums'"
    :albums="searchResults.albums"
  />

  <ArtistsList
    v-if="route.params.mediaType === 'artists'"
    :artists="searchResults.artists"
  />

  <TrackListWithPreview
    v-if="route.params.mediaType === 'tracks'"
    :tracks="searchResults.tracks"
  />
</template>

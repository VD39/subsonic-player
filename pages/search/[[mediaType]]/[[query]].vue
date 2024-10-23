<script setup lang="ts">
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TrackListWithPreview from '@/components/Organisms/TrackListWithPreview.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.search],
});

const route = useRoute();
const { search, searchResults } = useSearch();
const { openTrackInformationModal } = useDescription();
const { addTrackToQueue, playTracks } = useAudioPlayer();

function playTrack(index: number) {
  playTracks([searchResults.value!.tracks[index]], -1);
}

function addToPlaylist() {
  console.log('addToPlaylist');
}

const query = replaceCharactersWithSpace(route.params.query as string);

await search({
  offset: 0,
  query,
});
</script>

<template>
  <h1>Search results for: {{ query }}</h1>

  <PageNavigation :navigation="SEARCH_NAVIGATION" />

  <LoadingData>
    <AlbumsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Albums"
      :albums="searchResults.albums"
    />

    <ArtistsList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Artists"
      :artists="searchResults.artists"
    />

    <TrackListWithPreview
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Tracks"
      :tracks="searchResults.tracks"
      @play-track="playTrack"
      @add-to-queue="addTrackToQueue"
      @add-to-playlist="addToPlaylist"
      @media-information="openTrackInformationModal"
    />
  </LoadingData>
</template>

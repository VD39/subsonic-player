<script setup lang="ts">
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import TrackWithPreviewList from '@/components/Organisms/TrackWithPreviewList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.search],
});

const route = useRoute();
const { addToPlaylistModal } = usePlaylist();
const { search, searchResults } = useSearch();
const { openTrackInformationModal } = useDescription();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { downloadMedia } = useMediaLibrary();

function playTrack(index: number) {
  playTracks([searchResults.value!.tracks[index]], -1);
}

const query = replaceCharactersWithSpace(route.params.query as string);

search({
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

    <TrackWithPreviewList
      v-if="route.params.mediaType === ROUTE_MEDIA_TYPE_PARAMS.Tracks"
      :tracks="searchResults.tracks"
      @play-track="playTrack"
      @add-to-queue="addTrackToQueue"
      @add-to-playlist="addToPlaylistModal"
      @media-information="openTrackInformationModal"
      @download-media="downloadMedia"
    />
  </LoadingData>
</template>

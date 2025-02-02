<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import FilesList from '@/components/Organisms/FilesList.vue';

const route = useRoute();

const { addToPlaylistModal } = usePlaylist();
const { downloadMedia, getFiles } = useMediaLibrary();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();

const {
  data: musicDirectoryData,
  refresh,
  status,
} = useAsyncData(
  route.fullPath,
  async () => {
    const musicDirectory = await getFiles(route.params as FilesParams);

    return {
      musicDirectory,
    };
  },
  {
    default: () => ({
      musicDirectory: DEFAULT_MEDIA_LIBRARY,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function playTrack(index: number) {
  playTracks([musicDirectoryData.value.musicDirectory.tracks[index]], -1);
}

useHead({
  title: 'Files',
});
</script>

<template>
  <HeaderWithAction>
    <h1>Media Library</h1>

    <template #actions>
      <RefreshButton :status="status" @refresh="refresh" />
    </template>
  </HeaderWithAction>

  <LoadingData :status="status">
    <FilesList
      :folders="musicDirectoryData.musicDirectory.folders"
      :tracks="musicDirectoryData.musicDirectory.tracks"
      @play-track="playTrack"
      @add-to-queue="addTrackToQueue"
      @add-to-playlist="addToPlaylistModal"
      @media-information="openTrackInformationModal"
      @download-media="downloadMedia"
    />
  </LoadingData>
</template>

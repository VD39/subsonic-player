<script setup lang="ts">
import FileList from '@/components/file-browser/FileList.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import HeaderWithAction from '@/components/ui/HeaderWithAction.vue';
import RefreshButton from '@/components/ui/RefreshButton.vue';

const route = useRoute();

const { addToPlaylistModal } = usePlaylist();
const { downloadTrack, getMediaLibraryContent } = useMediaLibrary();
const { openTrackDetailsModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();

/* istanbul ignore next -- @preserve */
const {
  data: musicDirectoryData,
  refresh,
  status,
} = useAsyncData(
  route.fullPath,
  async () => {
    const musicDirectory = await getMediaLibraryContent(
      route.params as FilesParams,
    );

    return {
      musicDirectory,
    };
  },
  {
    default: () => ({
      musicDirectory: DEFAULT_MEDIA_LIBRARY,
    }),
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'refresh:manual') {
        return undefined;
      }

      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

function onPlayTrack(index: number) {
  playTracks(musicDirectoryData.value.musicDirectory.tracks, index);
}

useHead({
  title: 'Files',
});
</script>

<template>
  <HeaderWithAction>
    <h1>Media Library</h1>

    <template #actions>
      <RefreshButton :status @refresh="refresh" />
    </template>
  </HeaderWithAction>

  <LoadingData :status>
    <FileList
      :folders="musicDirectoryData.musicDirectory.folders"
      :tracks="musicDirectoryData.musicDirectory.tracks"
      @addToPlaylist="addToPlaylistModal"
      @addToQueue="addTrackToQueue"
      @downloadMedia="downloadTrack"
      @mediaInformation="openTrackDetailsModal"
      @playTrack="onPlayTrack"
    />
  </LoadingData>
</template>

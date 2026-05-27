<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import MixedTracksList from '@/components/Organisms/TrackLists/MixedTracksList.vue';

const { playFromQueue, removeFromQueue, reorderQueueTrack, resetPlayer } =
  useAudioPlayer();
const { loadFromServer, queueList, resetQueue } = useQueue();
const { addToPlaylistModal } = usePlaylist();
const { downloadTrack } = useMediaLibrary();
const { openTrackInformationModal } = useMediaInformation();
const { dragStart } = useDragAndDrop();

/* istanbul ignore next -- @preserve */
useAsyncData(
  ASYNC_DATA_KEYS.queue,
  async () => {
    await loadFromServer();

    return {
      queueList: queueList.value,
    };
  },
  {
    default: () => ({
      queueList: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function clearQueue() {
  resetPlayer();
  resetQueue();
}

useHead({
  title: 'Queue',
});
</script>

<template>
  <HeaderWithAction>
    <h1 ref="title">Queue ({{ queueList.length }})</h1>

    <template #actions>
      <ButtonLink
        ref="clearQueueButton"
        :icon="ICONS.clear"
        title="Clear queue"
        @click="clearQueue"
      >
        Clear queue
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <MixedTracksList
    :tracks="queueList"
    @addToPlaylist="addToPlaylistModal"
    @downloadMedia="downloadTrack"
    @dragStart="dragStart"
    @mediaInformation="openTrackInformationModal"
    @playTrack="playFromQueue"
    @remove="({ id }) => removeFromQueue(id)"
    @sortList="reorderQueueTrack"
  />
</template>

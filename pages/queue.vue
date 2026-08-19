<script setup lang="ts">
import TracklistMixed from '@/components/tracklist/TracklistMixed.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import HeaderWithAction from '@/components/ui/HeaderWithAction.vue';

const config = useRuntimeConfig();
const { ENABLE_QUEUE_SYNC } = config.public;

const {
  playFromQueue,
  removeFromQueue,
  reorderQueueTrack,
  resetPlayerSession,
} = useAudioPlayer();
const { queueList, resetQueue, restoreQueueStateFromServer } = useQueue();
const { addToPlaylistModal } = usePlaylist();
const { downloadTrack } = useMediaLibrary();
const { openTrackDetailsModal } = useMediaInformation();
const { dragStart } = useDragAndDrop();

/* istanbul ignore next -- @preserve */
useAsyncData(
  ASYNC_DATA_KEYS.queue,
  async () => {
    await restoreQueueStateFromServer();

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
    server: ENABLE_QUEUE_SYNC,
  },
);

function clearQueueAndResetPlayer() {
  resetPlayerSession();
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
        @click="clearQueueAndResetPlayer"
      >
        Clear queue
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <TracklistMixed
    :tracks="queueList"
    @addToPlaylist="addToPlaylistModal"
    @downloadMedia="downloadTrack"
    @dragStart="dragStart"
    @mediaInformation="openTrackDetailsModal"
    @playTrack="playFromQueue"
    @remove="({ index }) => removeFromQueue(index)"
    @sortList="reorderQueueTrack"
  />
</template>

<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';
import QueueList from './QueueList.vue';

const {
  clearQueueList,
  currentTrack,
  playCurrentTrack,
  queueList,
  removeTrackFromQueueList,
  trackIsPlaying,
  trackCanPlay,
} = useAudioPlayer();

const emit = defineEmits(['close']);

function clearQueue() {
  emit('close');
  clearQueueList();
}
</script>

<template>
  <div :class="$style.queueList">
    <div :class="$style.header">
      <h4 ref="title">Queue ({{ queueList.length }})</h4>

      <div :class="$style.headerActions">
        <IconButton
          ref="clear"
          icon="PhTrash"
          title="Clear queue"
          @click="clearQueue"
        >
          Clear queue
        </IconButton>

        <IconButton
          ref="close"
          icon="PhX"
          icon-weight="bold"
          title="Close queue list"
          @click="$emit('close')"
        >
          Close queue list
        </IconButton>
      </div>
    </div>

    <QueueList
      :tracks="queueList"
      :current-track-id="currentTrack.id"
      :is-current-track-playing="trackIsPlaying"
      :track-can-play="trackCanPlay"
      @remove-item="removeTrackFromQueueList"
      @play-current-track="playCurrentTrack"
    />
  </div>
</template>

<style module>
.queueList {
  position: fixed;
  right: var(--space-8);
  bottom: calc(var(--media-player-height) + var(--space-8));
  display: flex;
  flex-direction: column;
  width: 480px;
  height: 600px;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-m);
  box-shadow: var(--box-shadow-medium);
}

.header {
  @mixin align-center;

  justify-content: space-between;
  padding: var(--space-12) var(--space-8) var(--space-12) var(--space-12);
  border-bottom: 1px solid var(--border-color);
}

.headerActions {
  @mixin align-center;
}
</style>

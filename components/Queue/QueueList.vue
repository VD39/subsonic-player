<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';
import FavouriteButton from '@/components/Buttons/FavouriteButton.vue';
import TrackDetails from './TrackDetail.vue';

const props = defineProps<{
  currentTrackId: string;
  isCurrentTrackPlaying: boolean;
  trackCanPlay: boolean;
  tracks: QueueTrack[];
}>();

defineEmits(['playCurrentTrack', 'removeItem']);

function isCurrentTrack(id: string) {
  return props.currentTrackId === id;
}
</script>

<template>
  <ul :class="$style.list">
    <li
      v-for="track in tracks"
      :key="track.id"
      :class="[
        $style.listItem,
        {
          [$style.current]: isCurrentTrack(track.id),
        },
      ]"
      data-test-id="track-list-item"
    >
      <TrackDetails
        :track="track"
        :is-current-track="isCurrentTrack(track.id)"
        :is-current-track-playing="isCurrentTrackPlaying"
        :track-can-play="trackCanPlay"
        @play-current-track="$emit('playCurrentTrack', track)"
      />

      <div :class="$style.right">
        <FavouriteButton
          :id="track.id"
          :favourite="track.favourite"
          :type="track.type"
          :icon-size="18"
        />

        <IconButton
          ref="remove"
          icon="PhX"
          title="Remove item from queue"
          icon-weight="bold"
          :icon-size="18"
          @click="$emit('removeItem', track.id)"
        >
          Remove item from queue
        </IconButton>
      </div>
    </li>
  </ul>
</template>

<style module>
.list {
  height: 100%;
  overflow: auto;
}

.listItem {
  @mixin align-center;

  justify-content: space-between;

  &:hover {
    background-color: var(--secondary-background-color);
  }
}

.current {
  background-color: var(--secondary-background-color);
}

.right {
  display: inline-flex;
}
</style>

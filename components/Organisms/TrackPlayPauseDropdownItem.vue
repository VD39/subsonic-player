<script setup lang="ts">
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';

const props = defineProps<{
  trackId: string;
  type: MediaType;
}>();

const emit = defineEmits<{
  playTrack: [];
}>();

const { isCurrentTrack, isPlaying, togglePlay } = useAudioPlayer();

const currentTrackIsPlaying = computed(
  () => isCurrentTrack(props.trackId) && isPlaying.value,
);

const playPauseText = computed(() =>
  currentTrackIsPlaying.value ? 'Pause' : 'Play',
);

const trackType = computed(() => {
  switch (props.type) {
    case MEDIA_TYPE.podcastEpisode:
      return 'Episode';
    case MEDIA_TYPE.radioStation:
      return 'Station';
    default:
      return 'Track';
  }
});

async function onClick() {
  if (currentTrackIsPlaying.value) {
    await togglePlay();
    return;
  }

  emit('playTrack');
}
</script>

<template>
  <DropdownItem @click="onClick">
    {{ playPauseText }} {{ trackType }}
  </DropdownItem>
</template>

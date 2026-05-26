<script setup lang="ts">
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';

const props = defineProps<{
  trackId: string;
  type: MediaType;
}>();

const emit = defineEmits<{
  playTrack: [];
}>();

const { isCurrentTrack } = useQueue();
const { isPlaying, togglePlay } = useAudioPlayer();

const isCurrentAndPlaying = computed(
  () => isCurrentTrack(props.trackId) && isPlaying.value,
);

const playPauseText = computed(() =>
  isCurrentAndPlaying.value ? 'Pause' : 'Play',
);

const trackTypeLabel = computed(() => {
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
  if (isCurrentAndPlaying.value) {
    await togglePlay();
    return;
  }

  emit('playTrack');
}
</script>

<template>
  <DropdownItem @click="onClick">
    {{ playPauseText }} {{ trackTypeLabel }}
  </DropdownItem>
</template>

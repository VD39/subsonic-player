<script setup lang="ts">
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import PodcastEpisodesListItem from '@/components/Organisms/TrackLists/PodcastEpisodesListItem.vue';

defineProps<{
  isRecentList?: boolean;
  podcastEpisodes: PodcastEpisode[];
}>();

defineEmits<{
  addToPlaylist: [episodeId: string];
  addToQueue: [episode: PodcastEpisode];
  deleteEpisode: [episode: PodcastEpisode];
  downloadEpisode: [episode: PodcastEpisode];
  downloadMedia: [episode: PodcastEpisode];
  dragStart: [episode: PodcastEpisode, event: DragEvent];
  episodeInformation: [episode: PodcastEpisode];
  playEpisode: [episode: PodcastEpisode];
}>();

const trackHeaderNames = TRACK_HEADER_NAMES.podcastEpisodes;
</script>

<template>
  <div v-if="podcastEpisodes.length" ref="tracksWrapper" class="trackTable">
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeaderNames[0] }}</div>
      <div class="trackCell trackOptions" />
    </div>

    <PodcastEpisodesListItem
      v-for="(episode, index) in podcastEpisodes"
      :key="episode.id"
      :episode
      :index
      :isRecentList
      @addToPlaylist="$emit('addToPlaylist', episode.id)"
      @addToQueue="$emit('addToQueue', episode)"
      @deleteEpisode="$emit('deleteEpisode', episode)"
      @downloadEpisode="$emit('downloadEpisode', episode)"
      @downloadMedia="$emit('downloadMedia', episode)"
      @dragStart="(event) => $emit('dragStart', episode, event)"
      @episodeInformation="$emit('episodeInformation', episode)"
      @playEpisode="$emit('playEpisode', episode)"
    />
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
    message="No episodes found."
  />
</template>

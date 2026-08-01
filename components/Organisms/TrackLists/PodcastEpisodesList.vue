<script setup lang="ts">
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import PodcastEpisodesListItem from '@/components/Organisms/TrackLists/PodcastEpisodesListItem.vue';

defineProps<{
  isRecentList?: boolean;
  podcastEpisodes: PodcastEpisode[];
}>();

defineEmits<{
  addToPlaylist: [podcastEpisodeId: string];
  addToQueue: [podcastEpisode: PodcastEpisode];
  deletePodcastEpisode: [podcastEpisode: PodcastEpisode];
  downloadMedia: [podcastEpisode: PodcastEpisode];
  downloadPodcastEpisode: [podcastEpisode: PodcastEpisode];
  dragStart: [podcastEpisode: PodcastEpisode, event: DragEvent];
  playPodcastEpisode: [podcastEpisode: PodcastEpisode];
  podcastEpisodeInformation: [podcastEpisode: PodcastEpisode];
}>();

const trackHeaderNames = MEDIA_LIST_COLUMN_HEADERS.podcastEpisodes;
</script>

<template>
  <div v-if="podcastEpisodes.length" ref="tracksWrapper" class="trackTable">
    <div class="trackHeader">
      <div class="trackCell">
        {{ trackHeaderNames[0] }} ({{ podcastEpisodes.length }})
      </div>
      <div class="trackCell trackOptions" />
    </div>

    <PodcastEpisodesListItem
      v-for="(podcastEpisode, index) in podcastEpisodes"
      :key="podcastEpisode.id"
      :index
      :isRecentList
      :podcastEpisode
      @addToPlaylist="$emit('addToPlaylist', podcastEpisode.id)"
      @addToQueue="$emit('addToQueue', podcastEpisode)"
      @deletePodcastEpisode="$emit('deletePodcastEpisode', podcastEpisode)"
      @downloadMedia="$emit('downloadMedia', podcastEpisode)"
      @downloadPodcastEpisode="$emit('downloadPodcastEpisode', podcastEpisode)"
      @dragStart="(event) => $emit('dragStart', podcastEpisode, event)"
      @playPodcastEpisode="$emit('playPodcastEpisode', podcastEpisode)"
      @podcastEpisodeInformation="
        $emit('podcastEpisodeInformation', podcastEpisode)
      "
    />
  </div>

  <NoMediaMessage
    v-else
    :icon="FALLBACK_ICON_BY_TYPE.podcast"
    message="No podcast episodes found."
  />
</template>

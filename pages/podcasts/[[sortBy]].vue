<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import PodcastItem from '@/components/Organisms/PodcastItem.vue';
import PodcastList from '@/components/Organisms/PodcastList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.podcasts],
});

const route = useRoute();
const { openTrackInformationModal } = useDescription();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const {
  addPodcastModal,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getNewestPodcasts,
  getPodcasts,
  latestPodcasts,
  podcasts,
  sortPodcasts,
} = usePodcast();

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

onBeforeMount(async () => {
  if (!podcasts.value.length) {
    await getPodcasts();
    await getNewestPodcasts();
  }

  sortPodcasts(route.params.sortBy as PodcastsSortByParam);
});
</script>

<template>
  <HeaderWithAction>
    <h1>Podcasts</h1>

    <ButtonLink
      :icon-size="35"
      :icon="ICONS.add"
      title="Add podcast"
      @click="addPodcastModal"
    >
      Add podcast
    </ButtonLink>
  </HeaderWithAction>

  <PageNavigation :navigation="PODCASTS_NAVIGATION" />

  <LoadingData>
    <template v-if="podcasts.length">
      <MediaListWrapper>
        <PodcastItem
          v-for="podcast in podcasts"
          :key="podcast.id"
          :podcast="podcast"
        />
      </MediaListWrapper>

      <HeaderWithAction>
        <h3>Latest Podcast Episodes</h3>

        <ButtonLink
          :icon="ICONS.refresh"
          title="Refresh latest podcast episodes"
          @click="getNewestPodcasts"
        >
          Refresh latest podcast episodes
        </ButtonLink>
      </HeaderWithAction>

      <PodcastList
        :podcast-episodes="latestPodcasts"
        @play-episode="playEpisode"
        @add-to-queue="addTrackToQueue"
        @show-episode-description="openTrackInformationModal"
        @delete-episode="deletePodcastEpisode"
        @download-episode="downloadPodcastEpisode"
      />
    </template>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcasts found."
    />
  </LoadingData>
</template>

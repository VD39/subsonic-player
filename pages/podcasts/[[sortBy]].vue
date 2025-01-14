<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import PodcastItem from '@/components/Organisms/PodcastItem.vue';
import PodcastList from '@/components/Organisms/PodcastList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.podcasts],
});

const route = useRoute();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
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

async function getData() {
  getNewestPodcasts();
  await getPodcasts();
  sortPodcasts(route.params.sortBy as PodcastsSortByParam);
}

if (!podcasts.value.length) {
  getData();
} else {
  sortPodcasts(route.params.sortBy as PodcastsSortByParam);
}

useHead({
  title: () =>
    [route.params.sortBy || '', 'Podcasts'].filter(Boolean).join(' - '),
});
</script>

<template>
  <HeaderWithAction>
    <h1>Podcasts</h1>

    <div class="centerItems">
      <RefreshButton @refresh="getData" />

      <ButtonLink
        icon-size="large"
        :icon="ICONS.add"
        title="Add podcast"
        @click="addPodcastModal"
      >
        Add podcast
      </ButtonLink>
    </div>
  </HeaderWithAction>

  <PageNavigation :navigation="PODCASTS_NAVIGATION" />

  <LoadingData>
    <div v-if="podcasts.length">
      <MediaListWrapper>
        <PodcastItem
          v-for="podcast in podcasts"
          :key="podcast.id"
          :podcast="podcast"
        />
      </MediaListWrapper>

      <h3>Latest Podcast Episodes</h3>

      <PodcastList
        :podcast-episodes="latestPodcasts"
        @play-episode="playEpisode"
        @add-to-queue="addTrackToQueue"
        @add-to-playlist="addToPlaylistModal"
        @show-episode-description="openTrackInformationModal"
        @delete-episode="deletePodcastEpisode"
        @download-episode="downloadPodcastEpisode"
        @download-media="downloadMedia"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcasts found."
    />
  </LoadingData>
</template>

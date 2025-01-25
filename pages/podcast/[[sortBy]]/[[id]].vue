<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import TextClamp from '@/components/Atoms/TextClamp.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import InfiniteScroller from '@/components/Molecules/InfiniteScroller.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import PodcastList from '@/components/Organisms/PodcastList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.podcast],
});

const route = useRoute();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useDescription();
const {
  deletePodcast,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getNewestPodcasts,
  getPodcasts,
} = usePodcast();
const {
  fetchMoreData,
  hasMore,
  items: podcastEpisodes,
  LOAD_SIZE,
} = useInfinityLoading<PodcastEpisode>(
  `${route.params.id}-${route.params.sortBy}`,
);
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();

const { data: podcastsData, status } = await useAsyncData(
  ASYNC_DATA_NAMES.podcasts,
  async () => {
    const [latestPodcasts, podcasts] = await Promise.all([
      getNewestPodcasts(),
      getPodcasts(),
    ]);

    return {
      latestPodcasts,
      podcasts,
    };
  },
  {
    default: () => ({
      latestPodcasts: [],
      podcasts: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

const podcastById = computed(() => {
  const podcast = podcastsData.value?.podcasts?.find(
    (podcast) => podcast.id === route.params.id,
  );

  if (!podcast) {
    return null;
  }

  return {
    ...podcast,
    episodes: sortPodcastEpisodes(
      podcast.episodes,
      route.params.sortBy as PodcastSortByParam,
    ),
  };
});

function fetchData() {
  fetchMoreData((offset: number) =>
    sliceArrayBySizeAndOffset(
      podcastById.value?.episodes || [],
      LOAD_SIZE,
      offset,
    ),
  );
}

fetchData();

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

useHead({
  title: () =>
    [podcastById.value?.name || '', route.params.sortBy || '', 'Podcast']
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <LoadingData :status="status">
    <div v-if="podcastById">
      <EntryHeader :images="[podcastById.image]" :title="podcastById.name">
        <ul class="bulletList">
          <li>
            Episodes:
            <span class="strong">{{ podcastById.totalEpisodes }}</span>
          </li>
          <li>
            Last updated:
            <span class="strong">{{ podcastById.lastUpdated }}</span>
          </li>
          <li>
            Downloaded episodes:
            <span class="strong">
              {{ podcastById.totalDownloadedEpisodes }}
            </span>
          </li>
        </ul>

        <TextClamp
          v-if="podcastById.description"
          :max-lines="3"
          :text="podcastById.description"
          @more="openTrackInformationModal(podcastById)"
        />

        <div class="list">
          <ButtonLink
            :icon="ICONS.play"
            title="Play podcast episodes"
            class="largeThemeHoverButton"
            @click="playTracks(podcastById.episodes)"
          >
            Play podcast episodes
          </ButtonLink>

          <DropdownMenu>
            <DropdownItem
              v-if="podcastById.description"
              @click="openTrackInformationModal(podcastById)"
            >
              Podcast description
            </DropdownItem>
            <DropdownItem @click="deletePodcast(podcastById.id)">
              Delete podcast
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem @click="addTracksToQueue(podcastById.episodes)">
              Add episodes to queue
            </DropdownItem>
            <DropdownItem @click="playEpisode(podcastById.episodes[0])">
              Play latests episode
            </DropdownItem>
            <DropdownItem @click="playTracks(podcastById.episodes)">
              Play all episodes
            </DropdownItem>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <PageNavigation :navigation="PODCAST_NAVIGATION" />

      <PodcastList
        :podcast-episodes="podcastEpisodes"
        @play-episode="playEpisode"
        @add-to-queue="addTrackToQueue"
        @add-to-playlist="addToPlaylistModal"
        @show-episode-description="openTrackInformationModal"
        @delete-episode="deletePodcastEpisode"
        @download-episode="downloadPodcastEpisode"
        @download-media="downloadMedia"
      />

      <InfiniteScroller
        :has-more="hasMore"
        :loading="false"
        @load-more="fetchData"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcast found."
    />
  </LoadingData>
</template>

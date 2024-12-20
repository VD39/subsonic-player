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
const { openTrackInformationModal } = useDescription();
const {
  deletePodcast,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getPodcast,
  podcast,
  podcastEpisodes,
} = usePodcast();
const { fetchMoreData, items, LOAD_SIZE } =
  useInfinityLoading<PodcastEpisode>();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();

function fetchData() {
  fetchMoreData((offset: number) =>
    sliceArrayBySizeAndOffset(podcastEpisodes.value, LOAD_SIZE, offset),
  );
}

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

getPodcast(
  route.params.id as string,
  route.params.sortBy as PodcastSortByParam,
);
</script>

<template>
  <LoadingData>
    <div v-if="podcast">
      <EntryHeader :images="[podcast.image]" :title="podcast.name">
        <ul class="bulletList">
          <li>
            Episodes: <span class="strong">{{ podcast.totalEpisodes }}</span>
          </li>
          <li>
            Last updated: <span class="strong">{{ podcast.lastUpdated }}</span>
          </li>
          <li>
            Downloaded episodes:
            <span class="strong">{{ podcast.downloadedEpisodes }}</span>
          </li>
        </ul>

        <TextClamp
          v-if="podcast.description"
          :max-lines="3"
          :text="podcast.description"
          @more="openTrackInformationModal(podcast)"
        />

        <div class="list">
          <ButtonLink
            :icon="ICONS.play"
            title="Play podcast episodes"
            class="largeThemeHoverButton"
            @click="playTracks(podcast.episodes)"
          >
            Play podcast episodes
          </ButtonLink>

          <DropdownMenu>
            <DropdownItem
              v-if="podcast.description"
              @click="openTrackInformationModal(podcast)"
            >
              Podcast description
            </DropdownItem>
            <DropdownItem @click="deletePodcast(podcast.id)">
              Delete podcast
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem @click="addTracksToQueue(podcast.episodes)">
              Add episodes to queue
            </DropdownItem>
            <DropdownItem @click="playEpisode(podcast.episodes[0])">
              Play latests episode
            </DropdownItem>
            <DropdownItem @click="playTracks(podcast.episodes)">
              Play all episodes
            </DropdownItem>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <PageNavigation :navigation="PODCAST_NAVIGATION" />

      <PodcastList
        :podcast-episodes="items"
        @play-episode="playEpisode"
        @add-to-queue="addTrackToQueue"
        @show-episode-description="openTrackInformationModal"
        @delete-episode="deletePodcastEpisode"
        @download-episode="downloadPodcastEpisode"
        @download-media="downloadMedia"
      />

      <InfiniteScroller @load-more="fetchData" />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcast found."
    />
  </LoadingData>
</template>

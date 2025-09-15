<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import TextClamp from '@/components/Atoms/TextClamp.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PageNavigation from '@/components/Molecules/PageNavigation.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import PodcastEpisodesList from '@/components/Organisms/TrackLists/PodcastEpisodesList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.podcast],
});

const route = useRoute();
const { openModal } = useModal();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const { onDragStart } = useDragAndDrop();
const {
  deletePodcast,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getPodcast,
} = usePodcast();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();

const {
  data: podcastData,
  refresh,
  status,
} = await useAsyncData(
  `${ASYNC_DATA_NAMES.podcast}-${route.params[ROUTE_PARAM_KEYS.podcast.id]}`,
  async () => {
    const podcast = await getPodcast(
      route.params[ROUTE_PARAM_KEYS.podcast.id] as string,
    );

    return {
      podcast,
    };
  },
  {
    default: () => ({
      podcast: null,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    lazy: true,
  },
);

const hasDownloadedEpisodes = computed(
  () => podcastData.value.podcast!.totalDownloadedEpisodes > 0,
);

function addDownloadedTracksToQueue() {
  addTracksToQueue(podcastData.value.podcast!.episodes.downloaded);
}

async function deleteSelectedPodcast() {
  await deletePodcast(podcastData.value.podcast!.id);
  await navigateTo({
    name: ROUTE_NAMES.podcasts,
  });
}

function dragItem(event: DragEvent) {
  onDragStart(podcastData.value.podcast!, event);
}

function openPodcastDescriptionModal() {
  openModal(MODAL_TYPE.readMoreModal, {
    text: podcastData.value.podcast!.description,
    title: 'Description',
  });
}

function playAllEpisodes() {
  playTracks(podcastData.value.podcast!.episodes.downloaded, -1);
}

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

function playLatestsEpisodes() {
  playEpisode(podcastData.value.podcast!.episodes.downloaded[0]);
}

async function refreshPodcast() {
  await refresh();
}

const podcastEpisodes = computed(
  () =>
    podcastData.value.podcast?.episodes?.[
      route.params[ROUTE_PARAM_KEYS.podcast.sortBy] as PodcastSortByParam
    ] || [],
);

useHead({
  title: () =>
    [
      podcastData.value.podcast?.name,
      route.params[ROUTE_PARAM_KEYS.podcast.sortBy],
      'Podcast',
    ]
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <LoadingData :status>
    <div v-if="podcastData.podcast">
      <EntryHeader
        :images="[podcastData.podcast.image]"
        :title="podcastData.podcast.name"
        @dragStart="dragItem"
      >
        <template #actions>
          <RefreshButton :status @refresh="refreshPodcast" />
        </template>

        <ul class="bulletList">
          <li>
            Episodes:
            <span class="strong">{{ podcastData.podcast.totalEpisodes }}</span>
          </li>
          <li>
            Last updated:
            <span class="strong">{{ podcastData.podcast.lastUpdated }}</span>
          </li>
          <li>
            Downloaded episodes:
            <span class="strong">
              {{ podcastData.podcast.totalDownloadedEpisodes }}
            </span>
          </li>
        </ul>

        <TextClamp
          v-if="podcastData.podcast.description"
          :maxLines="3"
          :text="podcastData.podcast.description"
          @more="openPodcastDescriptionModal"
        />

        <div class="list">
          <ButtonLink
            :id="HOTKEY_ELEMENT_IDS.playAllButton"
            class="largeThemeHoverButton"
            :disabled="!hasDownloadedEpisodes"
            :icon="ICONS.play"
            title="Play podcast episodes"
            @click="playAllEpisodes"
          >
            Play podcast episodes
          </ButtonLink>

          <DropdownMenu>
            <DropdownItem @click="deleteSelectedPodcast">
              Delete podcast
            </DropdownItem>
            <template v-if="hasDownloadedEpisodes">
              <DropdownDivider />
              <DropdownItem @click="addDownloadedTracksToQueue">
                Add episodes to queue
              </DropdownItem>
              <DropdownItem @click="playLatestsEpisodes">
                Play latests episode
              </DropdownItem>
              <DropdownItem @click="playAllEpisodes">
                Play all episodes
              </DropdownItem>
            </template>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <PageNavigation :navigation="PODCAST_NAVIGATION" />

      <PodcastEpisodesList
        :podcastEpisodes
        @addToPlaylist="addToPlaylistModal"
        @addToQueue="addTrackToQueue"
        @deleteEpisode="deletePodcastEpisode"
        @downloadEpisode="downloadPodcastEpisode"
        @downloadMedia="downloadMedia"
        @dragStart="onDragStart"
        @episodeInformation="openTrackInformationModal"
        @playEpisode="playEpisode"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
      message="No podcast found."
    />
  </LoadingData>
</template>

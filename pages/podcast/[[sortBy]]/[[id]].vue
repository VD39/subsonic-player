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
const { dragStart } = useDragAndDrop();
const {
  deletePodcast,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getPodcast,
  podcast: podcastState,
} = usePodcast();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  `${ASYNC_DATA_NAMES.podcast}-${route.params[ROUTE_PARAM_KEYS.podcast.id]}`,
  async () => {
    const podcastId = route.params[ROUTE_PARAM_KEYS.podcast.id] as string;
    await getPodcast(podcastId);

    return {
      podcast: podcastState.value,
    };
  },
  {
    default: () => ({
      podcast: null,
    }),
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'refresh:manual') {
        return undefined;
      }

      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

const podcast = computed(
  () =>
    podcastState.value?.[route.params[ROUTE_PARAM_KEYS.podcast.id] as string],
);

const hasDownloadedEpisodes = computed(
  () => Number(podcast.value?.totalDownloadedEpisodes) > 0,
);

function addDownloadedTracksToQueue() {
  addTracksToQueue(podcast.value!.episodes.downloaded);
}

async function deleteSelectedPodcast() {
  await deletePodcast(podcast.value!.id);
  await navigateTo({
    name: ROUTE_NAMES.podcasts,
  });
}

function dragItem(event: DragEvent) {
  dragStart(podcast.value!, event);
}

function openPodcastDescriptionModal() {
  openModal(MODAL_TYPE.readMoreModal, {
    text: podcast.value!.description,
    title: 'Description',
  });
}

function playAllEpisodes() {
  playTracks(podcast.value!.episodes.downloaded, -1);
}

function playEpisode(episode: PodcastEpisode) {
  playTracks([episode]);
}

function playLatestsEpisodes() {
  playEpisode(podcast.value!.episodes.downloaded[0]);
}

const podcastEpisodes = computed(
  () =>
    podcast.value?.episodes?.[
      route.params[ROUTE_PARAM_KEYS.podcast.sortBy] as PodcastSortByParam
    ] as PodcastEpisode[],
);

useHead({
  title: () =>
    [
      podcast.value?.name,
      route.params[ROUTE_PARAM_KEYS.podcast.sortBy],
      'Podcast',
    ]
      .filter(Boolean)
      .join(' - '),
});
</script>

<template>
  <LoadingData :status>
    <div v-if="podcast" ref="podcastContent">
      <EntryHeader
        :images="[podcast.image]"
        :title="podcast.name"
        @dragStart="dragItem"
      >
        <template #actions>
          <RefreshButton :status @refresh="refresh" />
        </template>

        <ul class="bulletList">
          <li>
            Episodes:
            <span class="strong">{{ podcast.totalEpisodes }}</span>
          </li>
          <li>
            Last updated:
            <span class="strong">{{ podcast.lastUpdated }}</span>
          </li>
          <li>
            Downloaded episodes:
            <span class="strong">
              {{ podcast.totalDownloadedEpisodes }}
            </span>
          </li>
        </ul>

        <TextClamp
          v-if="podcast.description"
          :maxLines="3"
          :text="podcast.description"
          @more="openPodcastDescriptionModal"
        />

        <div class="list">
          <ButtonLink
            :id="HOTKEY_ELEMENT_IDS.playAllButton"
            ref="playAllEpisodesButton"
            class="largeThemeHoverButton"
            :disabled="!hasDownloadedEpisodes"
            :icon="ICONS.play"
            title="Play podcast episodes"
            @click="playAllEpisodes"
          >
            Play podcast episodes
          </ButtonLink>

          <DropdownMenu>
            <DropdownItem
              ref="deletePodcastDropdownItem"
              @click="deleteSelectedPodcast"
            >
              Delete podcast
            </DropdownItem>

            <template v-if="hasDownloadedEpisodes">
              <DropdownDivider />
              <DropdownItem
                ref="addDownloadedEpisodesToQueueDropdownItem"
                @click="addDownloadedTracksToQueue"
              >
                Add episodes to queue
              </DropdownItem>
              <DropdownItem
                ref="playLatestsEpisodeDropdownItem"
                @click="playLatestsEpisodes"
              >
                Play latests episode
              </DropdownItem>
              <DropdownItem
                ref="playAllEpisodesDropdownItem"
                @click="playAllEpisodes"
              >
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
        @dragStart="dragStart"
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

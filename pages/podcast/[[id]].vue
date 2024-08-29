<script setup lang="ts">
import EntryHeader from '@/components/Header/EntryHeader.vue';
import MediaListWrapper from '@/components/MediaLists/MediaListWrapper.vue';
import TrackImage from '@/components/TrackDetails/TrackImage.vue';
import IconButton from '@/components/Buttons/IconButton.vue';
import TextClamp from '@/components/TextClamp/TextClamp.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import DropdownDivider from '@/components/Dropdown/DropdownDivider.vue';
import InfiniteScroller from '@/components/InfiniteScroller/InfiniteScroller.vue';

definePageMeta({
  middleware: ['podcast'],
});

const route = useRoute();
const { openModal } = useModal();
const {
  deletePodcast,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getPodcast,
  podcast,
} = usePodcast();
const { fetchMoreData, items, LOAD_SIZE } =
  useInfinityLoading<PodcastEpisode>();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();

getPodcast(route.params.id as string);

function fetchData() {
  fetchMoreData((offset: number) =>
    sliceArrayBySizeAndOffset(podcast.value!.episodes, LOAD_SIZE, offset),
  );
}

function openPodcastEpisodeDescriptionModal(description: string) {
  openModal('podcastEpisodeDescriptionModal', {
    description,
  });
}

function openPodcastDescriptionModal(description: string) {
  openModal('podcastDescriptionModal', {
    description,
  });
}
</script>

<template>
  <EntryHeader v-if="podcast" :images="[podcast.image]" :title="podcast.name">
    <ul class="bulletList">
      <li>
        <span class="strong">{{ podcast.episodes.length }}</span> Episodes
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
      :max-lines="4"
      :text="podcast.description"
      @more="openPodcastDescriptionModal(podcast.description)"
    />

    <div class="list">
      <IconButton
        icon="PhPlay"
        title="Play podcast episodes"
        @click="playTracks(podcast.episodes)"
      >
        Play podcast episodes
      </IconButton>

      <DropdownMenu>
        <DropdownItem @click="deletePodcast(podcast.id)">
          Delete podcast
        </DropdownItem>
        <DropdownItem
          v-if="podcast.description"
          @click="openPodcastDescriptionModal(podcast.description)"
        >
          Episode description
        </DropdownItem>
        <DropdownItem @click="addTracksToQueue(podcast.episodes)">
          Add episodes queue
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem @click="playTracks([podcast.episodes[0]])">
          Play latests episode
        </DropdownItem>
        <DropdownItem @click="playTracks(podcast.episodes)">
          Play podcast episodes
        </DropdownItem>
      </DropdownMenu>
    </div>
  </EntryHeader>

  <MediaListWrapper v-if="items" rows="1">
    <h2>Episodes</h2>

    <article
      v-for="episode in items"
      :key="episode.id"
      :class="[
        $style.podcastTrack,
        {
          [$style.downloaded]: episode.downloaded,
        },
      ]"
    >
      <figure>
        <TrackImage
          :track-id="episode.id"
          @play-current-track="playTracks([episode])"
        />
      </figure>

      <div>
        <header>
          <h3>{{ episode.name }}</h3>
        </header>

        <p v-if="episode.description" class="clamp clamp2">
          {{ episode.description }}
        </p>

        <div :class="$style.bottom">
          <ul :class="['list', $style.episodeDetails]">
            <li>
              <span class="visually-hidden">Published: </span>
              {{ episode.publishDate }}
            </li>
            <li>
              <span class="visually-hidden">Duration: </span>
              <time>{{ episode.duration }}</time>
            </li>
          </ul>

          <IconButton
            v-if="episode.description"
            icon="PhInfo"
            title="Episode information"
            @click="openPodcastEpisodeDescriptionModal(episode.description)"
          >
            Episode information
          </IconButton>

          <IconButton
            v-if="!episode.downloaded"
            icon="PhDownload"
            title="Download episode"
            @click="downloadPodcastEpisode(episode.id)"
          >
            Download episode
          </IconButton>

          <IconButton
            is="span"
            v-if="episode.downloaded"
            icon="PhCheckCircle"
            title="Downloaded"
          >
            Downloaded
          </IconButton>

          <div :class="$style.dropdownMenu">
            <DropdownMenu>
              <DropdownItem
                v-if="episode.downloaded"
                @click="deletePodcastEpisode(episode.id)"
              >
                Delete episode
              </DropdownItem>
              <DropdownItem
                v-if="!episode.downloaded"
                @click="downloadPodcastEpisode(episode.id)"
              >
                Download episode
              </DropdownItem>
              <DropdownItem
                v-if="episode.description"
                @click="openPodcastEpisodeDescriptionModal(episode.description)"
              >
                Episode description
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                v-if="episode.downloaded"
                @click="addTrackToQueue(episode)"
              >
                Add to queue
              </DropdownItem>
              <DropdownItem @click="playTracks([episode])"> Play </DropdownItem>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </article>
  </MediaListWrapper>

  <InfiniteScroller @load-more="fetchData" />
</template>

<style module>
.episodeDetails {
  margin: 0 var(--space-8) 0 0;
}

.podcastTrack {
  @mixin align-center;

  position: relative;
  flex-direction: row;
  gap: var(--space-16);
  padding: var(--space-12);
  background-color: var(--track-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);

  &:hover {
    .image1 {
      opacity: 0.7;
    }

    .figureActions {
      pointer-events: initial;
      opacity: 1;
    }
  }

  &.downloaded {
    background-color: var(--track-hover-background-color);
  }
}

.episodes {
  position: relative;
  display: grid;
  gap: var(--space-8);
}

.bottom {
  @mixin align-center;
}
</style>

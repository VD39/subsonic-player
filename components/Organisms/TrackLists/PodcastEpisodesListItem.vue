<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import LazyLoadContent from '@/components/Atoms/LazyLoadContent.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import DownloadPodcastEpisode from '@/components/Organisms/DownloadPodcastEpisode.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import TrackPlayPauseDropdownItem from '@/components/Organisms/TrackPlayPauseDropdownItem.vue';

const props = defineProps<{
  index: number;
  isRecentList?: boolean;
  podcastEpisode: PodcastEpisode;
}>();

const emit = defineEmits<{
  addToPlaylist: [];
  addToQueue: [];
  deletePodcastEpisode: [];
  downloadMedia: [];
  downloadPodcastEpisode: [];
  dragStart: [event: DragEvent];
  playPodcastEpisode: [];
  podcastEpisodeInformation: [];
}>();

const { isCurrentTrack } = useQueue();
const { getBookmarkPosition } = useBookmark();
const { currentTime } = useAudioPlayer();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

const isCurrentPodcastEpisode = computed(() =>
  isCurrentTrack(props.podcastEpisode.id),
);

const bookmarkPosition = computed(() =>
  getBookmarkPosition(props.podcastEpisode.id),
);

const showProgress = computed(
  () => isCurrentPodcastEpisode.value || !!bookmarkPosition.value,
);

const progressPercent = computed(() => {
  const duration = props.podcastEpisode.duration;

  if (isCurrentPodcastEpisode.value) {
    return (currentTime.value / duration) * 100;
  }

  return bookmarkPosition.value ? (bookmarkPosition.value / duration) * 100 : 0;
});

const displayPosition = computed(() => {
  if (isCurrentPodcastEpisode.value) {
    return secondsToHHMMSS(currentTime.value);
  }

  return bookmarkPosition.value ? secondsToHHMMSS(bookmarkPosition.value) : '';
});

function onClick() {
  if (
    isCurrentTrack(props.podcastEpisode.id) ||
    !props.podcastEpisode.downloaded
  ) {
    return;
  }

  emit('playPodcastEpisode');
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
}
</script>

<template>
  <LazyLoadContent
    class="trackRow trackBorder spaceBetween trackPlayPauseHover"
  >
    <InteractionWrapper
      :draggable="podcastEpisode.downloaded"
      @click="onClick"
      @contextMenu="openDropdownMenu"
      @dragStart="$emit('dragStart', $event)"
    >
      <div class="trackCell trackPodcastEpisode column">
        <div>
          <DownloadPodcastEpisode
            v-if="!podcastEpisode.downloaded"
            :image="podcastEpisode.image"
            @downloadPodcastEpisode="$emit('downloadPodcastEpisode')"
          />

          <TrackPlayPause
            v-else
            :image="podcastEpisode.image"
            large
            :trackId="podcastEpisode.id"
            :trackNumber="index + 1"
            @playTrack="$emit('playPodcastEpisode')"
          />

          <div :class="$style.column">
            <MarqueeScroll inert>
              <h4 class="strong mBM">
                {{ podcastEpisode.name }}
              </h4>
            </MarqueeScroll>

            <MarqueeScroll
              v-if="podcastEpisode.author"
              ref="authorMarqueeScroll"
              inert
            >
              <p class="strong mBM">
                {{ podcastEpisode.author }}
              </p>
            </MarqueeScroll>

            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="podcastEpisode.description"
              ref="description"
              class="clamp2"
              v-html="podcastEpisode.description"
            />
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>

        <div :class="['centerItems', $style.podcastOptions]">
          <div class="centerItems">
            <ButtonLink
              v-if="!podcastEpisode.downloaded"
              ref="downloadPodcastEpisodeButton"
              :icon="ICONS.download"
              title="Download podcast episode"
              @click="$emit('downloadPodcastEpisode')"
            >
              Download podcast episode
            </ButtonLink>

            <div
              v-else
              ref="downloaded"
              :class="['centerItems', $style.downloaded]"
              title="Downloaded"
            >
              <component :is="ICONS.downloaded" :size="ICON_SIZE.medium" />
            </div>

            <ButtonLink
              ref="podcastEpisodeInformationButton"
              :icon="ICONS.information"
              title="Podcast episode information"
              @click="$emit('podcastEpisodeInformation')"
            >
              Podcast episode information
            </ButtonLink>

            <ButtonLink
              v-if="podcastEpisode.downloaded"
              ref="addToQueueButton"
              :icon="ICONS.add"
              title="Add to queue"
              @click="$emit('addToQueue')"
            >
              Add to queue
            </ButtonLink>
          </div>

          <MarqueeScroll>
            <ul class="bulletList">
              <li>
                <span class="visually-hidden">Published: </span>
                {{ podcastEpisode.publishDate }}
              </li>
              <li>
                <span class="visually-hidden">Duration: </span>
                <template v-if="showProgress">
                  <time ref="positionTime">{{ displayPosition }}</time>
                  <span>/</span>
                </template>

                <time>{{ podcastEpisode.formattedDuration }}</time>
              </li>
            </ul>
          </MarqueeScroll>
        </div>

        <div v-if="showProgress" ref="progressBar" :class="$style.progressBar">
          <div
            ref="progress"
            :class="$style.progress"
            :style="{
              '--podcast-episodes-progress-width': `${progressPercent}%`,
            }"
          />
        </div>
      </div>

      <div class="trackCell trackOptions trackPodcastEpisode">
        <DropdownMenu ref="dropdownMenuRef">
          <template v-if="podcastEpisode.downloaded">
            <TrackPlayPauseDropdownItem
              :trackId="podcastEpisode.id"
              :type="podcastEpisode.type"
              @playTrack="$emit('playPodcastEpisode')"
            />
            <DropdownItem ref="addToQueue" @click="$emit('addToQueue')">
              Add to queue
            </DropdownItem>
            <DropdownItem ref="addToPlaylist" @click="$emit('addToPlaylist')">
              Add to playlist
            </DropdownItem>
            <DropdownDivider />
            <template v-if="isRecentList">
              <DropdownItem
                is="nuxt-link"
                ref="goToPodcast"
                :to="{
                  name: ROUTE_NAMES.podcast,
                  params: {
                    [ROUTE_PARAM_KEYS.podcast.sortBy]:
                      ROUTE_PODCAST_FILTER_PARAMS.All,
                    [ROUTE_PARAM_KEYS.podcast.id]: podcastEpisode.podcastId,
                  },
                }"
              >
                Go to podcast
              </DropdownItem>
              <DropdownDivider />
            </template>
            <DropdownItem
              ref="podcastEpisodeInformationDropdownItem"
              @click="$emit('podcastEpisodeInformation')"
            >
              Podcast episode information
            </DropdownItem>
            <DropdownItem ref="downloadMedia" @click="$emit('downloadMedia')">
              Download podcast episode
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              ref="deletePodcastEpisode"
              @click="$emit('deletePodcastEpisode')"
            >
              Delete podcast episode
            </DropdownItem>
          </template>
          <template v-else>
            <DropdownItem
              ref="podcastEpisodeInformationDropdownItem"
              @click="$emit('podcastEpisodeInformation')"
            >
              Podcast episode information
            </DropdownItem>
            <DropdownItem
              ref="downloadPodcastEpisodeDropdownItem"
              @click="$emit('downloadPodcastEpisode')"
            >
              Download podcast episode
            </DropdownItem>
          </template>
        </DropdownMenu>
      </div>
    </InteractionWrapper>
  </LazyLoadContent>
</template>

<style module>
.trackPlayPause {
  @media (hover: none) {
    :global(.overlap) {
      --play-pause-opacity: 1;
    }
  }
}

.column {
  display: grid;
  flex: 1;
  align-self: start;
}

.podcastOptions {
  margin-top: var(--default-space);
}

.downloaded {
  flex-shrink: 0;
  padding: var(--default-space);
}

.progressBar {
  position: absolute;
  inset: auto 0 0;
  width: var(--width-height-100);
  height: 4px;
  overflow: hidden;
  background-color: var(--background-color);
}

.progress {
  width: var(--podcast-episodes-progress-width);
  height: var(--width-height-100);
  background-color: var(--theme-color);
  transition: width var(--transition);
}
</style>

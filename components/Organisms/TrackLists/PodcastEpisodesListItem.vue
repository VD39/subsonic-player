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

const props = defineProps<{
  episode: PodcastEpisode;
  index: number;
  isRecentList?: boolean;
}>();

const emit = defineEmits<{
  addToPlaylist: [];
  addToQueue: [];
  deleteEpisode: [];
  downloadEpisode: [];
  downloadMedia: [];
  dragStart: [event: DragEvent];
  episodeInformation: [];
  playEpisode: [];
}>();

const { isCurrentTrack } = useAudioPlayer();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

function onClick() {
  if (isCurrentTrack(props.episode.id) || !props.episode.downloaded) {
    return;
  }

  emit('playEpisode');
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
}
</script>

<template>
  <LazyLoadContent class="trackRow trackBorder spaceBetween">
    <InteractionWrapper
      :draggable="episode.downloaded"
      @click="onClick"
      @contextMenu="openDropdownMenu"
      @dragStart="$emit('dragStart', $event)"
    >
      <div class="trackCell trackPodcastEpisode column">
        <div>
          <DownloadPodcastEpisode
            v-if="!episode.downloaded"
            :image="episode.image"
            @downloadEpisode="$emit('downloadEpisode')"
          />

          <TrackPlayPause
            v-else
            :image="episode.image"
            large
            :trackId="episode.id"
            :trackNumber="index + 1"
            @playTrack="$emit('playEpisode')"
          />

          <div :class="$style.column">
            <MarqueeScroll inert>
              <h4 class="strong mBM">
                {{ episode.name }}
              </h4>
            </MarqueeScroll>

            <MarqueeScroll
              v-if="episode.author"
              ref="authorMarqueeScroll"
              inert
            >
              <p class="strong mBM">
                {{ episode.author }}
              </p>
            </MarqueeScroll>

            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="episode.description"
              ref="description"
              class="clamp2"
              v-html="episode.description"
            />
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>

        <div :class="['centerItems', $style.podcastOptions]">
          <div class="centerItems">
            <ButtonLink
              v-if="!episode.downloaded"
              ref="downloadEpisodeButton"
              :icon="ICONS.download"
              title="Download episode"
              @click="$emit('downloadEpisode')"
            >
              Download episode
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
              ref="episodeInformationButton"
              :icon="ICONS.information"
              title="Episode information"
              @click="$emit('episodeInformation')"
            >
              Episode information
            </ButtonLink>
          </div>

          <MarqueeScroll>
            <ul class="bulletList">
              <li>
                <span class="visually-hidden">Published: </span>
                {{ episode.publishDate }}
              </li>
              <li>
                <span class="visually-hidden">Duration: </span>
                <time>{{ episode.formattedDuration }}</time>
              </li>
            </ul>
          </MarqueeScroll>
        </div>
      </div>

      <div class="trackCell trackOptions trackPodcastEpisode">
        <DropdownMenu ref="dropdownMenuRef">
          <template v-if="episode.downloaded">
            <DropdownItem ref="playEpisode" @click="$emit('playEpisode')">
              Play Episode
            </DropdownItem>
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
                      ROUTE_PODCAST_SORT_BY_PARAMS.All,
                    [ROUTE_PARAM_KEYS.podcast.id]: episode.podcastId,
                  },
                }"
              >
                Go to podcast
              </DropdownItem>
              <DropdownDivider />
            </template>
            <DropdownItem
              ref="episodeInformationDropdownItem"
              @click="$emit('episodeInformation')"
            >
              Episode information
            </DropdownItem>
            <DropdownItem ref="downloadMedia" @click="$emit('downloadMedia')">
              Download episode
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem ref="deleteEpisode" @click="$emit('deleteEpisode')">
              Delete episode
            </DropdownItem>
          </template>
          <template v-else>
            <DropdownItem
              ref="episodeInformationDropdownItem"
              @click="$emit('episodeInformation')"
            >
              Episode information
            </DropdownItem>
            <DropdownItem
              ref="downloadEpisodeDropdownItem"
              @click="$emit('downloadEpisode')"
            >
              Download episode
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
</style>

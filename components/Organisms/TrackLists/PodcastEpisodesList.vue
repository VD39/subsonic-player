<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import LazyLoadContent from '@/components/Atoms/LazyLoadContent.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import DownloadPodcastEpisode from '@/components/Organisms/DownloadPodcastEpisode.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

defineProps<{
  podcastEpisodes: PodcastEpisode[];
}>();

defineEmits<{
  addToPlaylist: [episodeId: string];
  addToQueue: [episode: PodcastEpisode];
  deleteEpisode: [episode: PodcastEpisode];
  downloadEpisode: [episode: PodcastEpisode];
  downloadMedia: [episode: PodcastEpisode];
  dragStart: [episode: PodcastEpisode, event: DragEvent];
  episodeInformation: [episode: PodcastEpisode];
  playEpisode: [episode: PodcastEpisode];
}>();

const trackHeaderNames = TRACK_HEADER_NAMES.podcastEpisodes;
</script>

<template>
  <div v-if="podcastEpisodes.length" ref="tracksWrapper" class="trackTable">
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeaderNames[0] }}</div>
      <div class="trackCell trackOptions" />
    </div>

    <LazyLoadContent
      v-for="(episode, index) in podcastEpisodes"
      :key="episode.id"
      class="trackRow trackBorder spaceBetween"
      data-test-id="track"
      :draggable="episode.downloaded"
      @dragstart="$emit('dragStart', episode, $event)"
    >
      <div class="trackCell trackPodcastEpisode column">
        <div>
          <DownloadPodcastEpisode
            v-if="!episode.downloaded"
            :image="episode.image"
            @downloadEpisode="$emit('downloadEpisode', episode)"
          />

          <TrackPlayPause
            v-else
            :class="$style.trackPlayPause"
            :image="episode.image"
            large
            :trackId="episode.id"
            :trackNumber="index + 1"
            @playTrack="$emit('playEpisode', episode)"
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
              @click="$emit('downloadEpisode', episode)"
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
              @click="$emit('episodeInformation', episode)"
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
        <DropdownMenu>
          <template v-if="episode.downloaded">
            <DropdownItem
              ref="deleteEpisode"
              @click="$emit('deleteEpisode', episode)"
            >
              Delete episode
            </DropdownItem>
            <DropdownItem
              ref="downloadMedia"
              @click="$emit('downloadMedia', episode)"
            >
              Download episode
            </DropdownItem>
          </template>
          <DropdownItem
            v-else
            ref="downloadEpisodeDropdownItem"
            @click="$emit('downloadEpisode', episode)"
          >
            Download episode
          </DropdownItem>
          <DropdownItem
            ref="episodeInformationDropdownItem"
            @click="$emit('episodeInformation', episode)"
          >
            Episode information
          </DropdownItem>
          <template v-if="episode.downloaded">
            <DropdownItem
              ref="addToPlaylist"
              @click="$emit('addToPlaylist', episode.id)"
            >
              Add to playlist
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              ref="addToQueue"
              @click="$emit('addToQueue', episode)"
            >
              Add to queue
            </DropdownItem>
            <DropdownItem
              ref="playEpisode"
              @click="$emit('playEpisode', episode)"
            >
              Play Episode
            </DropdownItem>
          </template>
        </DropdownMenu>
      </div>
    </LazyLoadContent>
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
    message="No episodes found."
  />
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

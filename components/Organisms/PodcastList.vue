<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
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

defineEmits([
  'addToPlaylist',
  'addToQueue',
  'deleteEpisode',
  'downloadEpisode',
  'downloadMedia',
  'playEpisode',
  'episodeInformation',
]);
</script>

<template>
  <div v-if="podcastEpisodes.length" ref="tracksWrapper" class="trackTable">
    <div class="trackHeader">
      <div class="trackCell">Episodes</div>
      <div class="trackCell trackOptions" />
    </div>

    <div
      v-for="(episode, index) in podcastEpisodes"
      :key="episode.id"
      data-test-id="track"
      class="trackRow trackBorder spaceBetween"
    >
      <div class="trackCell trackPodcastEpisode column">
        <div>
          <DownloadPodcastEpisode
            v-if="!episode.downloaded"
            :image="episode.image"
            @download-episode="$emit('downloadEpisode', episode.id)"
          />

          <TrackPlayPause
            v-else
            :track-id="episode.id"
            :image="episode.image"
            :track-number="index + 1"
            large
            @play-track="$emit('playEpisode', episode)"
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

            <p v-if="episode.description" ref="description" class="clamp2">
              {{ episode.description }}
            </p>
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
                <time>{{ episode.duration }}</time>
              </li>
            </ul>
          </MarqueeScroll>
        </div>
      </div>

      <div class="trackCell trackOptions trackPodcastEpisode">
        <DropdownMenu ref="dropdownMenu">
          <template v-if="episode.downloaded">
            <DropdownItem
              ref="deleteEpisode"
              @click="$emit('deleteEpisode', episode.id)"
            >
              Delete episode
            </DropdownItem>
            <DropdownItem
              ref="downloadMedia"
              @click="$emit('downloadMedia', episode.streamUrlId)"
            >
              Download episode
            </DropdownItem>
          </template>
          <DropdownItem
            v-else
            ref="downloadEpisodeDropdownItem"
            @click="$emit('downloadEpisode', episode.id)"
          >
            Download episode
          </DropdownItem>
          <DropdownItem
            ref="episodeInformationDropdownItem"
            @click="$emit('episodeInformation', episode)"
          >
            Episode information
          </DropdownItem>
          <DropdownItem
            ref="addToPlaylist"
            @click="$emit('addToPlaylist', episode.id)"
          >
            Add to playlist
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem ref="addToQueue" @click="$emit('addToQueue', episode)">
            Add to queue
          </DropdownItem>
          <DropdownItem
            ref="playEpisode"
            @click="$emit('playEpisode', episode.id)"
          >
            Play Episode
          </DropdownItem>
        </DropdownMenu>
      </div>
    </div>
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.podcast"
    message="No episodes found."
  />
</template>

<style module>
.column {
  display: grid;
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

<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import LazyLoadContent from '@/components/Atoms/LazyLoadContent.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackMeta from '@/components/Molecules/TrackMeta.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

defineProps<{
  bookmarks: Bookmark[];
}>();

defineEmits<{
  addToPlaylist: [bookmarkId: string];
  downloadMedia: [bookmark: Bookmark];
  mediaInformation: [bookmark: Bookmark];
  playTrack: [index: number];
  remove: [bookmarkId: string];
}>();

const trackHeaderNames = TRACK_HEADER_NAMES.bookmarkTracks;
</script>

<template>
  <div
    v-if="bookmarks.length"
    ref="tracksWrapper"
    class="trackTable withPreview"
  >
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeaderNames[0] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[1] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[2] }}</div>
      <div ref="trackTime" class="trackCell trackTime withPosition">
        {{ trackHeaderNames[3] }}
      </div>
      <div class="trackCell trackOptions" />
      <div class="trackCell trackOptions" />
    </div>

    <LazyLoadContent
      v-for="(bookmark, index) in bookmarks"
      :key="bookmark.id"
      class="trackRow"
      data-test-id="track"
    >
      <div class="trackCell">
        <div>
          <TrackPlayPause
            :image="bookmark.image"
            :trackId="bookmark.id"
            :trackNumber="bookmark.trackNumber"
            @playTrack="$emit('playTrack', index)"
          />

          <TrackMeta class="trackMeta" :track="bookmark" />
        </div>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll
          v-if="bookmark.podcastName"
          ref="podcastNameMarqueeScroll"
        >
          <LinkOrText
            :isLink="!!bookmark.podcastId"
            :text="bookmark.podcastName"
            :to="{
              name: ROUTE_NAMES.podcast,
              params: {
                [ROUTE_PARAM_KEYS.podcast.sortBy]:
                  ROUTE_PODCAST_SORT_BY_PARAMS.All,
                [ROUTE_PARAM_KEYS.podcast.id]: bookmark.podcastId,
              },
            }"
          />
        </MarqueeScroll>

        <p v-else ref="podcastNameElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll v-if="bookmark.author" ref="authorMarqueeScroll">
          <p>{{ bookmark.author }}</p>
        </MarqueeScroll>

        <p v-else ref="authorsElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <div class="trackCell trackTime withPosition">
        <span>
          <time>{{ bookmark.formattedPosition }}</time>
          <span>/</span>
          <time>{{ bookmark.formattedDuration }}</time>
        </span>
      </div>

      <div class="trackCell trackOptions">
        <DropdownMenu>
          <DropdownItem
            ref="dropdownItemRemove"
            @click="$emit('remove', bookmark.id)"
          >
            Remove track
          </DropdownItem>
          <DropdownItem
            ref="addToPlaylist"
            @click="$emit('addToPlaylist', bookmark.id)"
          >
            Add to playlist
          </DropdownItem>
          <DropdownItem
            ref="mediaInformation"
            @click="$emit('mediaInformation', bookmark)"
          >
            Media information
          </DropdownItem>
          <DropdownItem
            ref="downloadMedia"
            @click="$emit('downloadMedia', bookmark)"
          >
            Download track
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem ref="playTrack" @click="$emit('playTrack', index)">
            Play Track
          </DropdownItem>
        </DropdownMenu>
      </div>

      <div class="trackCell trackOptions">
        <ButtonLink
          ref="removeButton"
          icon="PhX"
          iconSize="small"
          iconWeight="bold"
          title="Remove track from bookmarks"
          @click="$emit('remove', bookmark.id)"
        >
          Remove track from bookmarks
        </ButtonLink>
      </div>
    </LazyLoadContent>
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.podcastEpisode"
    message="No bookmarks found."
  />
</template>

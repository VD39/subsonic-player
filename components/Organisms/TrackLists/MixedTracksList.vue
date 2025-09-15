<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import LazyLoadContent from '@/components/Atoms/LazyLoadContent.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import TrackMeta from '@/components/Molecules/TrackMeta.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

defineProps<{
  hideRemoveOption?: boolean;
  tracks: MixedTrack[];
}>();

const emit = defineEmits<{
  addToPlaylist: [trackId: string, index: number];
  addToQueue: [track: MixedTrack];
  downloadMedia: [track: MixedTrack];
  dragStart: [track: MixedTrack, event: DragEvent];
  mediaInformation: [track: MixedTrack];
  playTrack: [index: number];
  remove: [
    removeArgs: {
      id: string;
      index: number;
    },
  ];
}>();

const trackHeaderNames = TRACK_HEADER_NAMES.mix;

const hasAddToQueueEvent = computed(
  () => !!getCurrentInstance()?.vnode.props?.onAddToQueue,
);

const hasDragStartEvent = computed(
  () => !!getCurrentInstance()?.vnode.props?.onDragStart,
);

function onDragStart(track: MixedTrack, event: DragEvent) {
  if (!hasDragStartEvent.value) {
    return;
  }

  emit('dragStart', track, event);
}
</script>

<template>
  <div v-if="tracks.length" ref="tracksWrapper" class="trackTable withPreview">
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeaderNames[0] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[1] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[2] }}</div>
      <div ref="trackTime" class="trackCell trackTime">
        {{ trackHeaderNames[3] }}
      </div>
      <div class="trackCell trackOptions" />
      <div
        v-if="!hideRemoveOption"
        ref="trackRemoveHeader"
        class="trackCell trackOptions"
      />
    </div>

    <LazyLoadContent
      v-for="(track, index) in tracks"
      :key="track.id"
      class="trackRow"
      data-test-id="track"
      :draggable="hasDragStartEvent"
      @dragstart="onDragStart(track, $event)"
    >
      <div class="trackCell">
        <div>
          <TrackPlayPause
            :image="track.image"
            :trackId="track.id"
            :trackNumber="track.trackNumber"
            @playTrack="$emit('playTrack', index)"
          />

          <TrackMeta class="trackMeta" :track />

          <FavouriteButton
            v-if="'favourite' in track"
            :id="track.id"
            :favourite="track.favourite"
            :type="track.type"
          />
        </div>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll
          v-if="'album' in track && track.album"
          ref="albumMarqueeScroll"
        >
          <LinkOrText
            :isLink="!!track.albumId"
            :text="track.album"
            :to="{
              name: ROUTE_NAMES.album,
              params: {
                [ROUTE_PARAM_KEYS.album.id]: track.albumId,
              },
            }"
          />
        </MarqueeScroll>

        <MarqueeScroll
          v-else-if="'podcastName' in track && track.podcastName"
          ref="podcastNameMarqueeScroll"
        >
          <LinkOrText
            :isLink="!!track.podcastId"
            :text="track.podcastName"
            :to="{
              name: ROUTE_NAMES.podcast,
              params: {
                [ROUTE_PARAM_KEYS.podcast.sortBy]:
                  ROUTE_PODCAST_SORT_BY_PARAMS.All,
                [ROUTE_PARAM_KEYS.podcast.id]: track.podcastId,
              },
            }"
          />
        </MarqueeScroll>

        <p v-else ref="albumElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll
          v-if="'artists' in track && track.artists.length"
          ref="artistsMarqueeScroll"
        >
          <ArtistsList :artists="track.artists" />
        </MarqueeScroll>

        <MarqueeScroll
          v-else-if="'author' in track && track.author"
          ref="authorMarqueeScroll"
        >
          <p>{{ track.author }}</p>
        </MarqueeScroll>

        <p v-else ref="artistsElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <time class="trackCell trackTime">
        {{ track.formattedDuration }}
      </time>

      <div class="trackCell trackOptions">
        <DropdownMenu>
          <DropdownItem
            v-if="!hideRemoveOption"
            ref="dropdownItemRemove"
            @click="
              $emit('remove', {
                id: track.id,
                index,
              })
            "
          >
            Remove track
          </DropdownItem>
          <DropdownItem
            ref="addToPlaylist"
            @click="$emit('addToPlaylist', track.id, index)"
          >
            Add to playlist
          </DropdownItem>
          <DropdownItem
            ref="mediaInformation"
            @click="$emit('mediaInformation', track)"
          >
            Media information
          </DropdownItem>
          <DropdownItem
            ref="downloadMedia"
            @click="$emit('downloadMedia', track)"
          >
            Download track
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            v-if="hasAddToQueueEvent"
            ref="addToQueue"
            @click="$emit('addToQueue', track)"
          >
            Add to queue
          </DropdownItem>
          <DropdownItem ref="playTrack" @click="$emit('playTrack', index)">
            Play Track
          </DropdownItem>
        </DropdownMenu>
      </div>

      <div
        v-if="!hideRemoveOption"
        ref="trackRemoveRow"
        class="trackCell trackOptions"
      >
        <ButtonLink
          ref="removeButton"
          icon="PhX"
          iconSize="small"
          iconWeight="bold"
          title="Remove track"
          @click="
            $emit('remove', {
              id: track.id,
              index,
            })
          "
        >
          Remove track
        </ButtonLink>
      </div>
    </LazyLoadContent>
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.track"
    message="No tracks found."
  />
</template>

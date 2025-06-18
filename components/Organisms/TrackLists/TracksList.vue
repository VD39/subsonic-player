<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
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
  tracks: Track[];
}>();

defineEmits<{
  addToPlaylist: [value: string];
  addToQueue: [value: Track];
  downloadMedia: [value: string];
  dragStart: [track: Track, event: DragEvent];
  mediaInformation: [value: Track];
  playTrack: [value: number];
}>();

const trackHeaderNames = TRACK_HEADER_NAMES.tracks;
</script>

<template>
  <div v-if="tracks.length" ref="tracksWrapper" class="trackTable withPreview">
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeaderNames[0] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[1] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[2] }}</div>
      <div class="trackCell trackTime">{{ trackHeaderNames[3] }}</div>
      <div class="trackCell trackOptions" />
    </div>

    <div
      v-for="(track, index) in tracks"
      :key="track.id"
      class="trackRow"
      data-test-id="track"
      draggable="true"
      @dragstart="$emit('dragStart', track, $event)"
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
            :id="track.id"
            :favourite="track.favourite"
            :type="track.type"
          />
        </div>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll v-if="track.album" ref="albumMarqueeScroll">
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

        <p v-else ref="albumElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll v-if="track.artists.length" ref="artistsMarqueeScroll">
          <ArtistsList :artists="track.artists" />
        </MarqueeScroll>

        <p v-else ref="artistsElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <div class="trackCell trackTime">
        <time>{{ track.formattedDuration }}</time>
      </div>

      <div class="trackCell trackOptions">
        <DropdownMenu>
          <DropdownItem
            ref="addToPlaylist"
            @click="$emit('addToPlaylist', track.id)"
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
            @click="$emit('downloadMedia', track.id)"
          >
            Download track
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem ref="addToQueue" @click="$emit('addToQueue', track)">
            Add to queue
          </DropdownItem>
          <DropdownItem ref="playTrack" @click="$emit('playTrack', index)">
            Play Track
          </DropdownItem>
        </DropdownMenu>
      </div>
    </div>
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.track"
    message="No tracks found."
  />
</template>

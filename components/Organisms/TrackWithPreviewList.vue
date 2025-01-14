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
  inPlaylist?: boolean;
  tracks: Track[];
}>();

defineEmits([
  'addToQueue',
  'addToPlaylist',
  'downloadMedia',
  'playTrack',
  'removeFromPlaylist',
  'mediaInformation',
]);
</script>

<template>
  <div v-if="tracks.length" ref="tracksWrapper" class="trackTable">
    <div class="trackHeader">
      <div class="trackCell">Track</div>
      <div class="trackCell trackSecondary">Album</div>
      <div class="trackCell trackSecondary">Artists</div>
      <div class="trackCell trackTime">Time</div>
      <div class="trackCell trackOptions" />
    </div>

    <div
      v-for="(track, index) in tracks"
      :key="track.id"
      class="trackRow"
      data-test-id="track"
    >
      <div class="trackCell">
        <div>
          <TrackPlayPause
            :track-id="track.id"
            :image="track.image"
            :track-number="track.trackNumber"
            @play-track="$emit('playTrack', index)"
          />

          <TrackMeta :track="track" class="trackMeta" />

          <FavouriteButton
            :id="track.id"
            :type="track.type"
            :favourite="track.favourite"
          />
        </div>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll>
          <LinkOrText
            :is-link="!!track.albumId"
            :text="track.album"
            :to="`/album/${track.albumId}`"
          />
        </MarqueeScroll>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll v-if="track.artists.length" ref="artistsMarqueeScroll">
          <ArtistsList :artists="track.artists" />
        </MarqueeScroll>
      </div>

      <time class="trackCell trackTime">
        {{ track.duration }}
      </time>

      <div class="trackCell trackOptions">
        <DropdownMenu ref="dropdownMenu">
          <DropdownItem
            v-if="inPlaylist"
            ref="removeFromPlaylist"
            @click="$emit('removeFromPlaylist', index)"
          >
            Remove from Playlist
          </DropdownItem>
          <DropdownItem
            v-else
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

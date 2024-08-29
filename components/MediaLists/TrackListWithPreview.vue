<script setup lang="ts">
import TrackImage from '@/components/TrackDetails/TrackImage.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import DropdownDivider from '@/components/Dropdown/DropdownDivider.vue';
import FavouriteButton from '@/components/Buttons/FavouriteButton.vue';
import ArtistsList from '@/components/TrackDetails/ArtistsList.vue';
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';

defineProps<{
  tracks: Track[];
}>();

defineEmits(['addToQueue', 'playTrack', 'removeFromPlaylist']);
</script>

<template>
  <div v-if="tracks.length" ref="tracksWrapper">
    <div class="trackHeader">
      <div class="trackPlay">#</div>
      <div class="trackDetails">
        <p>Track</p>
      </div>
      <div class="trackAlbum">
        <p>Album</p>
      </div>
      <div class="trackArtist">
        <p>Artists</p>
      </div>
      <div class="trackTime">
        <p>Time</p>
      </div>
    </div>

    <ol>
      <li
        v-for="(track, index) in tracks"
        :key="track.id"
        class="trackItem"
        data-test-id="track"
      >
        <div class="trackPlay">
          <TrackImage
            :track-id="track.id"
            @play-current-track="$emit('playTrack', track)"
          />
        </div>

        <div class="trackDetails">
          <p :class="['clamp', $style.name]">
            {{ track.trackNumber }}. {{ track.name }}
          </p>

          <FavouriteButton
            :id="track.id"
            type="album"
            :favourite="track.favourite"
          />

          <DropdownMenu data-test-id="dropdown-menu">
            <DropdownItem
              data-test-id="remove-from-playlist"
              @click="$emit('removeFromPlaylist', track)"
            >
              Remove from Playlist
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              data-test-id="add-to-queue"
              @click="$emit('addToQueue', track)"
            >
              Add to queue
            </DropdownItem>
            <DropdownItem
              data-test-id="play-track"
              @click="$emit('playTrack', index)"
            >
              Play Track
            </DropdownItem>
          </DropdownMenu>
        </div>

        <div class="trackAlbum">
          <NuxtLink
            v-if="track.album && track.albumId"
            :to="`/album/${track.albumId}`"
            class="clamp"
          >
            {{ track.album }}
          </NuxtLink>
          <p v-else>{{ track.album }}</p>
        </div>

        <div class="trackArtist">
          <ArtistsList
            v-if="track.artists.length"
            :artists="track.artists"
            class="clamp"
          />
        </div>

        <time class="trackTime">
          {{ track.duration }}
        </time>
      </li>
    </ol>
  </div>
  <NoMediaMessage v-else icon="PhMusicNotes" message="No tracks found." />
</template>

<style module>
.name {
  margin: 0 auto 0 0;
}
</style>

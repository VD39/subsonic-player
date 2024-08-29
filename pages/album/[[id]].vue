<script setup lang="ts">
import EntryHeader from '@/components/Header/EntryHeader.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import FavouriteButton from '@/components/Buttons/FavouriteButton.vue';
import IconButton from '@/components/Buttons/IconButton.vue';
import ArtistsList from '@/components/TrackDetails/ArtistsList.vue';
import GenreList from '@/components/TrackDetails/GenreList.vue';
import TrackList from '@/components/MediaLists/TrackList.vue';

definePageMeta({
  middleware: ['album'],
});

const route = useRoute();
const { album, getAlbum } = useAlbum();
const { addTrackToQueue, addTracksToQueue, playTracks, shuffleTracks } =
  useAudioPlayer();

getAlbum(route.params.id as string);

function playTrack(trackNumber: number) {
  playTracks(album.value!.tracks, trackNumber - 1);
}
</script>

<template>
  <div v-if="album">
    <EntryHeader :images="[album.image]" :title="album.name">
      <ArtistsList v-if="album.artists.length" :artists="album.artists" />

      <GenreList v-if="album.genres.length" :genres="album.genres" />

      <ul class="bulletList">
        <li>
          <span class="visually-hidden">Year: </span>
          {{ album.year }}
        </li>
        <li>
          <span class="strong">{{ album.songCount }}</span>
          {{ album.songCount > 1 ? ' Tracks' : ' Track' }}
        </li>
        <li>
          <span class="visually-hidden">Duration: </span>
          <time>{{ album.duration }}</time>
        </li>
        <li>
          <span class="visually-hidden">Size: </span>
          {{ album.size }}
        </li>
      </ul>

      <div class="list">
        <IconButton
          icon="PhPlay"
          title="Play tracks"
          @click="playTracks(album.tracks)"
        >
          Play tracks
        </IconButton>

        <IconButton
          icon="PhShuffle"
          title="Shuffle tracks"
          @click="shuffleTracks(album.tracks)"
        >
          Shuffle tracks
        </IconButton>

        <FavouriteButton
          :id="album.id"
          type="album"
          :favourite="album.favourite"
        />

        <DropdownMenu>
          <DropdownItem @click="addTracksToQueue(album.tracks)">
            Add to queue
          </DropdownItem>
          <DropdownItem @click="playTracks(album.tracks)">
            Play Tracks
          </DropdownItem>
        </DropdownMenu>
      </div>
    </EntryHeader>

    <TrackList
      :tracks="album.tracks"
      @play-track="playTrack"
      @add-to-queue="addTrackToQueue"
    />
  </div>
</template>

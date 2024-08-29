<script setup lang="ts">
import EntryHeader from '@/components/Header/EntryHeader.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import DropdownDivider from '@/components/Dropdown/DropdownDivider.vue';
import IconButton from '@/components/Buttons/IconButton.vue';
import TrackListWithPreview from '@/components/MediaLists/TrackListWithPreview.vue';

definePageMeta({
  middleware: ['playlist'],
});

const route = useRoute();
const { deletePlaylist, playlist, getPlaylistTracksById } = usePlaylist();
const { addTrackToQueue, addTracksToQueue, playTracks, shuffleTracks } =
  useAudioPlayer();

getPlaylistTracksById(route.params.id as string);

function playTrack(trackNumber: number) {
  playTracks(playlist.value!.tracks, trackNumber - 1);
}

const hasTracks = computed(() => playlist.value?.tracks.length);
</script>

<template>
  <div v-if="playlist">
    <EntryHeader :images="playlist.images" :title="playlist.name">
      <ul class="bulletList">
        <li>Playlist</li>
        <li v-if="hasTracks">
          <span class="strong">{{ playlist.songCount }}</span>
          {{ playlist.songCount > 1 ? 'Tracks' : 'Track' }}
        </li>
        <li v-if="hasTracks">
          <span class="visually-hidden">Duration: </span>
          <time>{{ playlist.duration }}</time>
        </li>
      </ul>

      <div class="list">
        <IconButton
          v-if="hasTracks"
          icon="PhPlay"
          title="Play tracks"
          @click="playTracks(playlist.tracks)"
        >
          Play tracks
        </IconButton>

        <IconButton
          v-if="hasTracks"
          icon="PhShuffle"
          title="Shuffle tracks"
          @click="shuffleTracks(playlist.tracks)"
        >
          Shuffle tracks
        </IconButton>

        <DropdownMenu>
          <DropdownItem @click="deletePlaylist(playlist.id)">
            Delete Playlist
          </DropdownItem>
          <DropdownDivider v-if="hasTracks" />
          <DropdownItem
            v-if="hasTracks"
            @click="addTracksToQueue(playlist.tracks)"
          >
            Add to queue
          </DropdownItem>
          <DropdownItem v-if="hasTracks" @click="playTracks(playlist.tracks)">
            Play Tracks
          </DropdownItem>
        </DropdownMenu>
      </div>
    </EntryHeader>

    <TrackListWithPreview
      :tracks="playlist.tracks"
      @play-track="playTrack"
      @add-to-queue="addTrackToQueue"
    />
  </div>
</template>

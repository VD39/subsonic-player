<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import TrackWithPreviewList from '@/components/Organisms/TrackWithPreviewList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.playlist],
});

const route = useRoute();
const { downloadMedia } = useMediaLibrary();
const { openTrackInformationModal } = useDescription();
const {
  deletePlaylist,
  getPlaylistTracksById,
  playlist,
  removeFromPlaylist,
  updatePlaylistModal,
} = usePlaylist();
const { addTracksToQueue, addTrackToQueue, playTracks, shuffleTracks } =
  useAudioPlayer();

function playTrack(index: number) {
  playTracks(playlist.value!.tracks, index - 1);
}

function removeTrackFromPlaylist(songIndexToRemove: string) {
  removeFromPlaylist({
    playlistId: route.params.id as string,
    songIndexToRemove,
  });
}

const hasTracks = computed(() => !playlist.value?.tracks.length);

getPlaylistTracksById(route.params.id as string);
</script>

<template>
  <LoadingData>
    <div v-if="playlist">
      <EntryHeader :images="playlist.images" :title="playlist.name">
        <ul class="bulletList">
          <li>Playlist</li>
          <li>
            <span class="strong">{{ playlist.trackCount }}</span>
            {{ playlist.trackCount > 1 ? 'Tracks' : 'Track' }}
          </li>
          <li>
            <span class="visuallyHidden">Duration: </span>
            <time>{{ playlist.duration }}</time>
          </li>
        </ul>

        <div class="list">
          <ButtonLink
            :disabled="hasTracks"
            :icon="ICONS.play"
            title="Play tracks"
            class="largeThemeHoverButton"
            @click="playTracks(playlist.tracks)"
          >
            Play tracks
          </ButtonLink>

          <ButtonLink
            :disabled="hasTracks"
            :icon="ICONS.shuffle"
            title="Shuffle tracks"
            @click="shuffleTracks(playlist.tracks)"
          >
            Shuffle tracks
          </ButtonLink>

          <DropdownMenu>
            <DropdownItem @click="updatePlaylistModal(playlist)">
              Edit Playlist
            </DropdownItem>
            <DropdownItem @click="deletePlaylist(playlist.id)">
              Delete Playlist
            </DropdownItem>

            <template v-if="hasTracks">
              <DropdownDivider />
              <DropdownItem @click="addTracksToQueue(playlist.tracks)">
                Add to queue
              </DropdownItem>
              <DropdownItem @click="playTracks(playlist.tracks)">
                Play Tracks
              </DropdownItem>
            </template>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <TrackWithPreviewList
        :tracks="playlist.tracks"
        in-playlist
        @play-track="playTrack"
        @add-to-queue="addTrackToQueue"
        @remove-from-playlist="removeTrackFromPlaylist"
        @media-information="openTrackInformationModal"
        @download-media="downloadMedia"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.playlist"
      message="No playlist found."
    />
  </LoadingData>
</template>

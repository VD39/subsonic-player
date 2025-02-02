<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import TrackWithPreviewList from '@/components/Organisms/TrackWithPreviewList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.playlist],
});

const route = useRoute();
const { downloadMedia } = useMediaLibrary();
const { openTrackInformationModal } = useMediaInformation();
const {
  deletePlaylist,
  getPlaylistTracksById,
  removeFromPlaylist,
  updatePlaylistModal,
} = usePlaylist();
const { addTracksToQueue, addTrackToQueue, playTracks, shuffleTracks } =
  useAudioPlayer();

const {
  data: playlistData,
  refresh,
  status,
} = useAsyncData(
  route.fullPath,
  async () => {
    const playlist = await getPlaylistTracksById(route.params.id as string);

    return {
      playlist,
    };
  },
  {
    default: () => ({
      playlist: null,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

const hasTracks = computed(() => !playlistData.value.playlist?.tracks.length);

function playTrack(index: number) {
  playTracks(playlistData.value.playlist!.tracks, index - 1);
}

function removeTrackFromPlaylist(songIndexToRemove: string) {
  removeFromPlaylist({
    playlistId: route.params.id as string,
    songIndexToRemove,
  });
}

async function deleteSelectedPlaylist() {
  await deletePlaylist(playlistData.value.playlist!.id);
  await navigateTo('/playlists');
}

useHead({
  title: () =>
    [playlistData.value.playlist?.name, 'Playlist'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData :status="status">
    <div v-if="playlistData.playlist">
      <EntryHeader
        :images="playlistData.playlist.images"
        :title="playlistData.playlist.name"
      >
        <template #actions>
          <RefreshButton :status="status" @refresh="refresh" />
        </template>

        <ul class="bulletList">
          <li>Playlist</li>
          <li>
            <span class="strong">{{ playlistData.playlist.trackCount }}</span>
            {{ playlistData.playlist.trackCount > 1 ? 'Tracks' : 'Track' }}
          </li>
          <li>
            <span class="visuallyHidden">Duration: </span>
            <time>{{ playlistData.playlist.duration }}</time>
          </li>
        </ul>

        <div class="list">
          <ButtonLink
            :disabled="hasTracks"
            :icon="ICONS.play"
            title="Play tracks"
            class="largeThemeHoverButton"
            @click="playTracks(playlistData.playlist.tracks)"
          >
            Play tracks
          </ButtonLink>

          <ButtonLink
            :disabled="hasTracks"
            :icon="ICONS.shuffle"
            title="Shuffle tracks"
            @click="shuffleTracks(playlistData.playlist.tracks)"
          >
            Shuffle tracks
          </ButtonLink>

          <DropdownMenu>
            <DropdownItem @click="updatePlaylistModal(playlistData.playlist)">
              Edit Playlist
            </DropdownItem>
            <DropdownItem @click="deleteSelectedPlaylist">
              Delete Playlist
            </DropdownItem>

            <template v-if="hasTracks">
              <DropdownDivider />
              <DropdownItem
                @click="addTracksToQueue(playlistData.playlist.tracks)"
              >
                Add to queue
              </DropdownItem>
              <DropdownItem @click="playTracks(playlistData.playlist.tracks)">
                Play Tracks
              </DropdownItem>
            </template>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <TrackWithPreviewList
        :tracks="playlistData.playlist.tracks"
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

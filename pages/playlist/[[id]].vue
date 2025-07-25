<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import MixedTracksList from '@/components/Organisms/TrackLists/MixedTracksList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.playlist],
});

const route = useRoute();
const { downloadMedia } = useMediaLibrary();
const { openTrackInformationModal } = useMediaInformation();
const {
  addToPlaylistModal,
  deletePlaylist,
  getPlaylistTracksById,
  playlist,
  removeFromPlaylist,
  updatePlaylistModal,
} = usePlaylist();
const { onDragStart } = useDragAndDrop();
const { addTracksToQueue, addTrackToQueue, playTracks, shuffleTracks } =
  useAudioPlayer();

const { refresh, status } = useAsyncData(
  route.fullPath,
  async () => {
    await getPlaylistTracksById(
      route.params[ROUTE_PARAM_KEYS.playlist.id] as string,
    );

    return {
      playlist: playlist.value,
    };
  },
  {
    default: () => ({
      playlist: null,
    }),
    getCachedData: undefined,
  },
);

const hasTracks = computed(() => !!playlist.value?.tracks.length);

async function deleteSelectedPlaylist() {
  await deletePlaylist(route.params[ROUTE_PARAM_KEYS.playlist.id] as string);
  await navigateTo({
    name: ROUTE_NAMES.playlists,
  });
}

function dragItem(event: DragEvent) {
  onDragStart(playlist.value!, event);
}

function playTrack(index: number) {
  playTracks(playlist.value!.tracks, index - 1);
}

async function removeTrackFromPlaylist(songIndexToRemove: number) {
  await removeFromPlaylist({
    playlistId: route.params[ROUTE_PARAM_KEYS.playlist.id] as string,
    songIndexToRemove,
  });
}

useHead({
  title: () => [playlist.value?.name, 'Playlist'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData :status>
    <div v-if="playlist">
      <EntryHeader
        :images="playlist.images"
        :title="playlist.name"
        @dragStart="dragItem"
      >
        <template #actions>
          <RefreshButton :status @refresh="refresh" />
        </template>

        <ul class="bulletList">
          <li>Playlist</li>
          <li>
            <span class="strong">{{ playlist.trackCount }}</span>
            {{ playlist.trackCount > 1 ? 'Tracks' : 'Track' }}
          </li>
          <li>
            <span class="visuallyHidden">Duration: </span>
            <time>{{ playlist.formattedDuration }}</time>
          </li>
        </ul>

        <div class="list">
          <ButtonLink
            :id="HOTKEY_ELEMENT_IDS.playAllButton"
            class="largeThemeHoverButton"
            :disabled="!hasTracks"
            :icon="ICONS.play"
            title="Play tracks"
            @click="playTracks(playlist.tracks)"
          >
            Play tracks
          </ButtonLink>

          <ButtonLink
            :id="HOTKEY_ELEMENT_IDS.shuffleAllButton"
            :disabled="!hasTracks"
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
            <DropdownItem @click="deleteSelectedPlaylist">
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

      <MixedTracksList
        :hideRemoveOption="playlist.id === RANDOM_PLAYLIST.id"
        :tracks="playlist.tracks"
        @addToPlaylist="addToPlaylistModal"
        @addToQueue="addTrackToQueue"
        @downloadMedia="downloadMedia"
        @dragStart="onDragStart"
        @mediaInformation="openTrackInformationModal"
        @playTrack="playTrack"
        @remove="({ index }) => removeTrackFromPlaylist(index)"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.playlist"
      message="No playlist found."
    />
  </LoadingData>
</template>

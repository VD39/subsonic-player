<script setup lang="ts">
import DropdownDivider from '@/components/dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistMixed from '@/components/tracklist/TracklistMixed.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import EntryHeader from '@/components/ui/EntryHeader.vue';
import RefreshButton from '@/components/ui/RefreshButton.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.playlist],
});

const route = useRoute();
const { downloadTrack } = useMediaLibrary();
const { openTrackDetailsModal } = useMediaInformation();
const {
  addToPlaylistModal,
  deletePlaylist,
  loadPlaylistTracksById,
  playlist,
  removeFromPlaylist,
  reorderPlaylistTracks,
  updatePlaylistModal,
} = usePlaylist();
const { dragStart } = useDragAndDrop();
const { addTracksToQueue, addTrackToQueue, playTracks, playTracksShuffled } =
  useAudioPlayer();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  route.fullPath,
  async () => {
    await loadPlaylistTracksById(
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

function onDragStart(event: DragEvent) {
  dragStart(playlist.value!, event);
}

function onPlayTrack(index: number) {
  playTracks(playlist.value!.tracks, index);
}

function onSortList(fromIndex: number, toIndex: number) {
  reorderPlaylistTracks(
    route.params[ROUTE_PARAM_KEYS.playlist.id] as string,
    fromIndex,
    toIndex,
  );
}

function removeTrackFromPlaylist(songIndexToRemove: number) {
  removeFromPlaylist({
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
    <div v-if="playlist" ref="playlistContent">
      <EntryHeader
        :images="playlist.images"
        :title="playlist.name"
        @dragStart="onDragStart"
      >
        <template #actions>
          <RefreshButton :status @refresh="refresh" />
        </template>

        <ul class="bulletList">
          <li>Playlist</li>
          <li ref="trackCount">
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
            :id="KEYBOARD_SHORTCUT_ELEMENT_IDS.playAllButton"
            ref="playTracksButton"
            class="largeThemeHoverButton"
            :disabled="!hasTracks"
            :icon="ICONS.play"
            title="Play tracks"
            @click="playTracks(playlist.tracks)"
          >
            Play tracks
          </ButtonLink>

          <ButtonLink
            :id="KEYBOARD_SHORTCUT_ELEMENT_IDS.shuffleAllButton"
            ref="shuffleTracksButton"
            :disabled="!hasTracks"
            :icon="ICONS.shuffle"
            title="Shuffle tracks"
            @click="playTracksShuffled(playlist.tracks)"
          >
            Shuffle tracks
          </ButtonLink>

          <DropdownMenu>
            <DropdownItem
              ref="updatePlaylistDropdownItem"
              @click="updatePlaylistModal(playlist)"
            >
              Edit Playlist
            </DropdownItem>
            <DropdownItem
              ref="deletePlaylistDropdownItem"
              @click="deleteSelectedPlaylist"
            >
              Delete Playlist
            </DropdownItem>

            <template v-if="hasTracks">
              <DropdownDivider />
              <DropdownItem
                ref="addToQueueDropdownItem"
                @click="addTracksToQueue(playlist.tracks)"
              >
                Add to queue
              </DropdownItem>
              <DropdownItem
                ref="playTracksDropdownItem"
                @click="playTracks(playlist.tracks)"
              >
                Play Tracks
              </DropdownItem>
            </template>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <template v-if="playlist.id === RANDOM_PLAYLIST.id">
        <TracklistMixed
          ref="mixedTracklistGenericRandomPlaylist"
          :tracks="playlist.tracks"
          @addToPlaylist="addToPlaylistModal"
          @addToQueue="addTrackToQueue"
          @downloadMedia="downloadTrack"
          @dragStart="dragStart"
          @mediaInformation="openTrackDetailsModal"
          @playTrack="onPlayTrack"
        />
      </template>
      <template v-else>
        <TracklistMixed
          ref="mixedTracklistGeneric"
          :tracks="playlist.tracks"
          @addToPlaylist="addToPlaylistModal"
          @addToQueue="addTrackToQueue"
          @downloadMedia="downloadTrack"
          @dragStart="dragStart"
          @mediaInformation="openTrackDetailsModal"
          @playTrack="onPlayTrack"
          @remove="({ index }) => removeTrackFromPlaylist(index)"
          @sortList="onSortList"
        />
      </template>
    </div>

    <NoMediaMessage
      v-else
      :icon="FALLBACK_ICON_BY_TYPE.playlist"
      message="No playlist found."
    />
  </LoadingData>
</template>

<script setup lang="ts">
import ArtistLinkList from '@/components/artist/ArtistLinkList.vue';
import GenreList from '@/components/artist/GenreList.vue';
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import FavouriteButton from '@/components/favourite/FavouriteButton.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistAlbum from '@/components/tracklist/TracklistAlbum.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import EntryHeader from '@/components/ui/EntryHeader.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.album],
});

const route = useRoute();
const { getAlbum } = useAlbum();
const { downloadTrack } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackDetailsModal } = useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks, playTracksShuffled } =
  useAudioPlayer();
const { dragStart } = useDragAndDrop();

/* istanbul ignore next -- @preserve */
const { data: albumData, status } = useAsyncData(
  route.fullPath,
  async () => {
    const album = await getAlbum(
      route.params[ROUTE_PARAM_KEYS.album.id] as string,
    );

    return {
      album,
    };
  },
  {
    default: () => ({
      album: null,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function onDragStart(event: DragEvent) {
  dragStart(albumData.value.album!, event);
}

function onPlayTrack(index: number) {
  playTracks(albumData.value.album!.tracks, index);
}

useHead({
  title: () =>
    [albumData.value.album?.name, 'Album'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData :status>
    <div v-if="albumData.album" ref="albumContent">
      <EntryHeader
        :images="[albumData.album.image]"
        :title="albumData.album.name"
        @dragStart="onDragStart"
      >
        <ArtistLinkList
          v-if="albumData.album.artists.length"
          :artists="albumData.album.artists"
        />

        <GenreList
          v-if="albumData.album.genres.length"
          :genres="albumData.album.genres"
        />

        <ul class="bulletList">
          <li>
            <span class="visuallyHidden">Year: </span>
            {{ albumData.album.year }}
          </li>
          <li ref="trackCount">
            <span class="strong">{{ albumData.album.trackCount }}</span>
            {{ albumData.album.trackCount > 1 ? ' Tracks' : ' Track' }}
          </li>
          <li ref="discCount">
            <span class="strong">{{ albumData.album.totalDiscNumber }}</span>
            {{ albumData.album.totalDiscNumber > 1 ? ' Discs' : ' Disc' }}
          </li>
          <li>
            <span class="visuallyHidden">Duration: </span>
            <time>{{ albumData.album.formattedDuration }}</time>
          </li>
          <li>
            <span class="visuallyHidden">Size: </span>
            {{ albumData.album.size }}
          </li>
        </ul>

        <div class="list">
          <ButtonLink
            :id="KEYBOARD_SHORTCUT_ELEMENT_IDS.playAllButton"
            ref="playTracksButton"
            class="largeThemeHoverButton"
            :icon="ICONS.play"
            title="Play tracks"
            @click="playTracks(albumData.album.tracks)"
          >
            Play tracks
          </ButtonLink>

          <ButtonLink
            :id="KEYBOARD_SHORTCUT_ELEMENT_IDS.shuffleAllButton"
            ref="shuffleTracksButton"
            :icon="ICONS.shuffle"
            title="Shuffle tracks"
            @click="playTracksShuffled(albumData.album.tracks)"
          >
            Shuffle tracks
          </ButtonLink>

          <FavouriteButton
            :id="albumData.album.id"
            :favourite="albumData.album.favourite"
            type="album"
          />

          <DropdownMenu>
            <DropdownItem
              ref="addToQueueDropdownItem"
              @click="addTracksToQueue(albumData.album.tracks)"
            >
              Add to queue
            </DropdownItem>
            <DropdownItem
              ref="playTracksDropdownItem"
              @click="playTracks(albumData.album.tracks)"
            >
              Play Tracks
            </DropdownItem>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <template
        v-for="(tracks, disc) in albumData.album.tracksByDiscNumber"
        :key="disc"
      >
        <h3
          v-if="albumData.album.totalDiscNumber > 1"
          data-test-id="disc-number-title"
        >
          {{ disc }}
        </h3>

        <TracklistAlbum
          :tracks
          @addToPlaylist="addToPlaylistModal"
          @addToQueue="addTrackToQueue"
          @downloadMedia="downloadTrack"
          @dragStart="dragStart"
          @mediaInformation="openTrackDetailsModal"
          @playTrack="onPlayTrack"
        />
      </template>
    </div>

    <NoMediaMessage
      v-else
      :icon="FALLBACK_ICON_BY_TYPE.album"
      message="No album found."
    />
  </LoadingData>
</template>

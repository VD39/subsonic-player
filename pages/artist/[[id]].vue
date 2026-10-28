<script setup lang="ts">
import AlbumList from '@/components/album/AlbumList.vue';
import ArtistList from '@/components/artist/ArtistList.vue';
import GenreList from '@/components/artist/GenreList.vue';
import FavouriteButton from '@/components/favourite/FavouriteButton.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistGeneric from '@/components/tracklist/TracklistGeneric.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import EntryHeader from '@/components/ui/EntryHeader.vue';
import SortControls from '@/components/ui/SortControls.vue';
import TextClamp from '@/components/ui/TextClamp.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.artist],
});

const route = useRoute();
const { viewLayout } = useSettings();
const { getMediaTracks } = useMediaTracks();
const { getArtist, getTopSongs } = useArtist();
const { openModal } = useModal();
const { downloadTrack } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openAlbumDetailsModal, openTrackDetailsModal } = useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { dragStart } = useDragAndDrop();

const { data: artistData, status } = useAsyncData(
  route.fullPath,
  async () => {
    const artist = await getArtist(
      route.params[ROUTE_PARAM_KEYS.artist.id] as string,
    );

    return {
      artist,
    };
  },
  {
    default: () => ({
      artist: null,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

const artistName = computed(() => artistData.value.artist?.name || '');

const { data: topSongsData } = useAsyncData(
  () => `${route.fullPath}-${ASYNC_DATA_KEYS.topTracks}`,
  async () => {
    const tracks = await getTopSongs(artistName.value);

    return {
      tracks,
    };
  },
  {
    default: () => ({
      tracks: [],
    }),
    enabled: () => !!artistName.value,
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    lazy: true,
    server: false,
    watch: [artistName],
  },
);

const { sortedItems: sortedAlbums, sortProps } = useLocalSort<Album>({
  items: computed(() => artistData.value.artist?.albums || []),
  options: [
    {
      defaultDirection: 'desc',
      key: 'year',
      label: 'Year',
    },
  ],
});

async function addAlbumToQueue(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    addTracksToQueue(tracks);
  }
}

async function onPlayAlbum(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    playTracks(tracks);
  }
}

function openArtistBiographyModal() {
  openModal(MODAL_TYPE.readMoreModal, {
    text: artistData.value.artist!.biography,
    title: 'Artist biography',
  });
}

function playFromSimilarTracks(index: number) {
  playTracks(artistData.value.artist!.similarTracks, index);
}

function playTopTracks(index: number) {
  playTracks(topSongsData.value.tracks, index);
}

useHead({
  title: () =>
    [artistData.value.artist?.name, 'Artist'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData :class="viewLayout" :status>
    <div v-if="artistData.artist" ref="artistContent">
      <EntryHeader
        :images="[artistData.artist.image]"
        :title="artistData.artist.name"
      >
        <TextClamp
          v-if="artistData.artist.biography"
          :maxLines="2"
          :text="artistData.artist.biography"
          @expand="openArtistBiographyModal"
        />

        <GenreList
          v-if="artistData.artist.genres.length"
          :genres="artistData.artist.genres"
        />

        <ul class="bulletList">
          <li ref="albumCount">
            <span class="strong">{{ artistData.artist.totalAlbums }}</span>
            {{ artistData.artist.totalAlbums > 1 ? 'Albums' : 'Album' }}
          </li>
          <li ref="trackCount">
            <span class="strong">{{ artistData.artist.totalTracks }}</span>
            {{ artistData.artist.totalTracks > 1 ? 'Tracks' : 'Track' }}
          </li>
        </ul>

        <div class="list">
          <FavouriteButton
            :id="artistData.artist.id"
            :favourite="artistData.artist.favourite"
            type="artist"
          />

          <ButtonLink
            is="a"
            v-if="artistData.artist.lastFmUrl"
            ref="lastFmButton"
            :href="artistData.artist.lastFmUrl"
            :icon="ICONS.lastFm"
            target="_blank"
            title="LastFm"
          />

          <ButtonLink
            is="a"
            v-if="artistData.artist.musicBrainzUrl"
            ref="musicBrainzButton"
            :href="artistData.artist.musicBrainzUrl"
            :icon="ICONS.musicBrainz"
            target="_blank"
            title="MusicBrainz"
          />
        </div>
      </EntryHeader>

      <h2>Albums</h2>

      <SortControls v-bind="sortProps" />

      <AlbumList
        :albums="sortedAlbums"
        hideArtist
        @addToQueue="addAlbumToQueue"
        @dragStart="dragStart"
        @mediaInformation="openAlbumDetailsModal"
        @playAlbum="onPlayAlbum"
      />

      <template v-if="topSongsData.tracks.length">
        <h2>Top Tracks</h2>

        <TracklistGeneric
          ref="topTracksTracklistGeneric"
          :tracks="topSongsData.tracks"
          @addToPlaylist="addToPlaylistModal"
          @addToQueue="addTrackToQueue"
          @downloadMedia="downloadTrack"
          @dragStart="dragStart"
          @mediaInformation="openTrackDetailsModal"
          @playTrack="playTopTracks"
        />
      </template>

      <template v-if="artistData.artist.similarTracks.length">
        <h2>Similar Tracks</h2>

        <TracklistGeneric
          ref="similarTracksTracklistGeneric"
          :tracks="artistData.artist.similarTracks"
          @addToPlaylist="addToPlaylistModal"
          @addToQueue="addTrackToQueue"
          @downloadMedia="downloadTrack"
          @dragStart="dragStart"
          @mediaInformation="openTrackDetailsModal"
          @playTrack="playFromSimilarTracks"
        />
      </template>

      <template v-if="artistData.artist.similarArtists.length">
        <h2>Similar Artists</h2>

        <ArtistList :artists="artistData.artist.similarArtists" />
      </template>
    </div>

    <NoMediaMessage
      v-else
      :icon="FALLBACK_ICON_BY_TYPE.artist"
      message="No artist found."
    />
  </LoadingData>
</template>

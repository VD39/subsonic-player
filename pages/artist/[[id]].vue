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
const { getArtist } = useArtist();
const { openModal } = useModal();
const { downloadTrack } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openAlbumDetailsModal, openTrackDetailsModal } = useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { dragStart } = useDragAndDrop();

const { data: artistData, status } = getArtist(
  route.params[ROUTE_PARAM_KEYS.artist.id] as string,
);

const { sortedItems: sortedAlbums, sortProps } = useLocalSort<Album>({
  items: computed(() => artistData.value?.albums || []),
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
    text: artistData.value!.biography,
    title: 'Artist biography',
  });
}

function playFromSimilarTracks(index: number) {
  playTracks(artistData.value!.similarTracks, index);
}

function playTopTracks(index: number) {
  playTracks(artistData.value!.topTracks, index);
}

useHead({
  title: () => [artistData.value?.name, 'Artist'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData :class="viewLayout" :status>
    <div v-if="artistData" ref="artistContent">
      <EntryHeader :images="[artistData.image]" :title="artistData.name">
        <TextClamp
          v-if="artistData.biography"
          :maxLines="2"
          :text="artistData.biography"
          @expand="openArtistBiographyModal"
        />

        <GenreList
          v-if="artistData.genres.length"
          :genres="artistData.genres"
        />

        <ul class="bulletList">
          <li ref="albumCount">
            <span class="strong">{{ artistData.totalAlbums }}</span>
            {{ artistData.totalAlbums > 1 ? 'Albums' : 'Album' }}
          </li>
          <li ref="trackCount">
            <span class="strong">{{ artistData.totalTracks }}</span>
            {{ artistData.totalTracks > 1 ? 'Tracks' : 'Track' }}
          </li>
        </ul>

        <div class="list">
          <FavouriteButton
            :id="artistData.id"
            :favourite="artistData.favourite"
            type="artist"
          />

          <ButtonLink
            is="a"
            v-if="artistData.lastFmUrl"
            ref="lastFmButton"
            :href="artistData.lastFmUrl"
            :icon="ICONS.lastFm"
            target="_blank"
            title="LastFm"
          />

          <ButtonLink
            is="a"
            v-if="artistData.musicBrainzUrl"
            ref="musicBrainzButton"
            :href="artistData.musicBrainzUrl"
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

      <template v-if="artistData.topTracks.length">
        <h2>Top Tracks</h2>

        <TracklistGeneric
          ref="topTracksTracklistGeneric"
          :tracks="artistData.topTracks"
          @addToPlaylist="addToPlaylistModal"
          @addToQueue="addTrackToQueue"
          @downloadMedia="downloadTrack"
          @dragStart="dragStart"
          @mediaInformation="openTrackDetailsModal"
          @playTrack="playTopTracks"
        />
      </template>

      <template v-if="artistData.similarTracks.length">
        <h2>Similar Tracks</h2>

        <TracklistGeneric
          ref="similarTracksTracklistGeneric"
          :tracks="artistData.similarTracks"
          @addToPlaylist="addToPlaylistModal"
          @addToQueue="addTrackToQueue"
          @downloadMedia="downloadTrack"
          @dragStart="dragStart"
          @mediaInformation="openTrackDetailsModal"
          @playTrack="playFromSimilarTracks"
        />
      </template>

      <template v-if="artistData.similarArtists.length">
        <h2>Similar Artists</h2>

        <ArtistList :artists="artistData.similarArtists" />
      </template>
    </div>

    <NoMediaMessage
      v-else
      :icon="FALLBACK_ICON_BY_TYPE.artist"
      message="No artist found."
    />
  </LoadingData>
</template>

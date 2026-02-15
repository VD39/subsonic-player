<script setup lang="ts">
import GenreLink from '@/components/Atoms/GenreLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import CarouselSwiper from '@/components/Molecules/CarouselSwiper.vue';
import HeaderSeeAllLink from '@/components/Molecules/HeaderSeeAllLink.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';
import ArtistItem from '@/components/Organisms/ArtistItem.vue';
import PlaylistsList from '@/components/Organisms/PlaylistsList.vue';

const { getRandomAlbums } = useAlbum();
const { getArtists } = useArtist();
const { getGenres } = useGenre();
const { dragStart } = useDragAndDrop();
const { getPlaylists, playlists } = usePlaylist();
const { addTracksToQueue, playTracks } = useAudioPlayer();
const { openAlbumInformationModal } = useMediaInformation();
const { getMediaTracks } = useMediaTracks();

/* istanbul ignore next -- @preserve */
const { data: libraryData, status } = useAsyncData(
  ASYNC_DATA_NAMES.library,
  async () => {
    const [randomAlbums, artists, genres] = await Promise.all([
      getRandomAlbums(),
      getArtists(),
      getGenres(),
      getPlaylists(),
    ]);

    return {
      artists,
      genres,
      randomAlbums,
    };
  },
  {
    default: () => ({
      artists: [],
      genres: [],
      randomAlbums: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

const hasData = computed(
  () =>
    libraryData.value.artists.length ||
    libraryData.value.genres.length ||
    libraryData.value.randomAlbums.length ||
    playlists.value.length,
);

async function addAlbumToQueue(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    await addTracksToQueue(tracks);
  }
}

async function onPlayAlbum(album: Album) {
  const tracks = await getMediaTracks(album);

  if (tracks) {
    await playTracks(tracks);
  }
}

useHead({
  title: 'Library',
});
</script>

<template>
  <LoadingData :status>
    <template v-if="hasData">
      <template v-if="libraryData.randomAlbums.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.albums,
          }"
        >
          Albums
        </HeaderSeeAllLink>

        <CarouselSwiper ref="randomAlbumCarouselSwiper">
          <swiper-slide
            v-for="album in libraryData.randomAlbums"
            :key="album.name"
            data-test-id="random-album-item"
          >
            <AlbumItem
              :album
              @addToQueue="addAlbumToQueue"
              @dragStart="dragStart"
              @mediaInformation="openAlbumInformationModal"
              @playAlbum="onPlayAlbum"
            />
          </swiper-slide>
        </CarouselSwiper>
      </template>

      <template v-if="libraryData.artists.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.artists,
          }"
        >
          Artists
        </HeaderSeeAllLink>

        <CarouselSwiper ref="artistCarouselSwiper">
          <swiper-slide
            v-for="artist in libraryData.artists.slice(0, PREVIEW_ARTIST_COUNT)"
            :key="artist.name"
            data-test-id="random-artist-item"
          >
            <ArtistItem :artist />
          </swiper-slide>
        </CarouselSwiper>
      </template>

      <template v-if="libraryData.genres.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.genres,
          }"
        >
          Genres
        </HeaderSeeAllLink>

        <CarouselSwiper
          v-if="libraryData.genres.length"
          ref="genreCarouselSwiper"
          :gridRows="2"
        >
          <swiper-slide
            v-for="genre in libraryData.genres.slice(0, PREVIEW_GENRES_COUNT)"
            :key="genre.name"
            data-test-id="random-genre-item"
          >
            <GenreLink :name="genre.name" />
          </swiper-slide>
        </CarouselSwiper>
      </template>

      <template v-if="playlists.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.playlists,
          }"
        >
          Playlist
        </HeaderSeeAllLink>

        <PlaylistsList
          :playlists="playlists.slice(0, PREVIEW_PLAYLIST_COUNT)"
        />
      </template>
    </template>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.noMedia"
      message="No media found."
    />
  </LoadingData>
</template>

<script setup lang="ts">
import GenreLink from '@/components/Atoms/GenreLink.vue';
import CarouselSwiper from '@/components/Molecules/CarouselSwiper.vue';
import HeaderSeeAllLink from '@/components/Molecules/HeaderSeeAllLink.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';
import ArtistItem from '@/components/Organisms/ArtistItem.vue';
import PlaylistsList from '@/components/Organisms/PlaylistsList.vue';

const { getRandomAlbums } = useAlbum();
const { getArtists } = useArtist();
const { getGenres } = useGenre();
const { getPlaylists, playlists } = usePlaylist();

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
      playlists,
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

useHead({
  title: 'Library',
});
</script>

<template>
  <LoadingData :status="status">
    <HeaderSeeAllLink to="/albums">Albums</HeaderSeeAllLink>

    <CarouselSwiper v-if="libraryData.randomAlbums.length">
      <swiper-slide v-for="album in libraryData.randomAlbums" :key="album.name">
        <AlbumItem :album="album" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/artists">Artists</HeaderSeeAllLink>

    <CarouselSwiper v-if="libraryData.artists.length">
      <swiper-slide
        v-for="artist in libraryData.artists.slice(0, 15)"
        :key="artist.name"
      >
        <ArtistItem :artist="artist" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/genres">Genres</HeaderSeeAllLink>

    <CarouselSwiper v-if="libraryData.genres.length" :grid-rows="2">
      <swiper-slide
        v-for="genre in libraryData.genres.slice(0, 15)"
        :key="genre.name"
      >
        <GenreLink :name="genre.name" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/playlists">Playlist</HeaderSeeAllLink>

    <PlaylistsList :playlists="playlists.slice(0, 8)" />
  </LoadingData>
</template>

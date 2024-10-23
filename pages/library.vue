<script setup lang="ts">
import GenreLink from '@/components/Atoms/GenreLink.vue';
import CarouselSwiper from '@/components/Molecules/CarouselSwiper.vue';
import HeaderSeeAllLink from '@/components/Molecules/HeaderSeeAllLink.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';
import ArtistItem from '@/components/Organisms/ArtistItem.vue';
import PlaylistsList from '@/components/Organisms/PlaylistsList.vue';

const { getRandomAlbums, randomAlbums } = useAlbum();
const { artists, getArtists } = useArtist();
const { genres, getGenres } = useGenre();
const { getPlaylists, playlists } = usePlaylist();

onBeforeMount(async () => {
  await getRandomAlbums();
  await getArtists();
  await getGenres();
  await getPlaylists();
});
</script>

<template>
  <LoadingData>
    <HeaderSeeAllLink to="/albums">Albums</HeaderSeeAllLink>

    <CarouselSwiper v-if="randomAlbums.length">
      <swiper-slide v-for="album in randomAlbums" :key="album.name">
        <AlbumItem :album="album" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/artists">Artists</HeaderSeeAllLink>

    <CarouselSwiper v-if="artists.length">
      <swiper-slide v-for="artist in artists.slice(0, 15)" :key="artist.name">
        <ArtistItem :artist="artist" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/genres">Genres</HeaderSeeAllLink>

    <CarouselSwiper v-if="genres.length" :grid-rows="2">
      <swiper-slide v-for="genre in genres.slice(0, 15)" :key="genre.name">
        <GenreLink :name="genre.name" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/playlists">Playlist</HeaderSeeAllLink>

    <PlaylistsList :playlists="playlists.slice(0, 8)" />
  </LoadingData>
</template>

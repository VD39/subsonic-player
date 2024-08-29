<script setup lang="ts">
import HeaderSeeAllLink from '@/components/Header/HeaderSeeAllLink.vue';
import AlbumItem from '@/components/MediaLists/AlbumItem.vue';
import ArtistItem from '@/components/MediaLists/ArtistItem.vue';
import CarouselSwiper from '@/components/Carousel/CarouselSwiper.vue';
import PlaylistsList from '@/components/MediaLists/PlaylistsList.vue';

const { getAlbums } = useAlbum();
const { artists, getArtists } = useArtist();
const { genres, getGenres } = useGenre();
const { playlists, getPlaylists } = usePlaylist();

const [randomAlbums] = await Promise.all([
  getAlbums({
    type: 'random',
    size: 15,
  }),
]);

getArtists();
getGenres();
getPlaylists();
</script>

<template>
  <HeaderSeeAllLink to="/albums">Albums</HeaderSeeAllLink>

  <CarouselSwiper v-if="randomAlbums?.length">
    <swiper-slide v-for="album in randomAlbums" :key="album.name">
      <AlbumItem :album="album" />
    </swiper-slide>
  </CarouselSwiper>

  <HeaderSeeAllLink to="/artists">Artists</HeaderSeeAllLink>

  <CarouselSwiper v-if="artists.length">
    <swiper-slide v-for="artist in artists.splice(0, 15)" :key="artist.name">
      <ArtistItem :artist="artist" />
    </swiper-slide>
  </CarouselSwiper>

  <HeaderSeeAllLink to="/genres">Genres</HeaderSeeAllLink>

  <CarouselSwiper v-if="genres.length" :gridRows="2">
    <swiper-slide v-for="genre in genres.splice(0, 15)" :key="genre.name">
      <NuxtLink :to="`/genre/albums/${genre.name}`" class="tileLink">
        {{ genre.name }}
      </NuxtLink>
    </swiper-slide>
  </CarouselSwiper>

  <HeaderSeeAllLink to="/playlists">Playlist</HeaderSeeAllLink>

  <PlaylistsList :playlists="playlists" rows="2" />
</template>

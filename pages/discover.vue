<script setup lang="ts">
import HeaderSeeAllLink from '@/components/Header/HeaderSeeAllLink.vue';
import AlbumItem from '@/components/MediaLists/AlbumItem.vue';
import CarouselSwiper from '@/components/Carousel/CarouselSwiper.vue';

const { getAlbums } = useAlbum();

const [newestAlbums, frequentAlbums, recentAlbums] = await Promise.all([
  getAlbums({
    type: 'newest',
    size: 12,
  }),
  getAlbums({
    type: 'frequent',
    size: 12,
  }),
  getAlbums({
    type: 'recent',
    size: 12,
  }),
]);
</script>

<template>
  <HeaderSeeAllLink to="/albums/recently-added">Newest albums</HeaderSeeAllLink>

  <CarouselSwiper v-if="newestAlbums?.length">
    <swiper-slide v-for="album in newestAlbums" :key="album.name">
      <AlbumItem :album="album" />
    </swiper-slide>
  </CarouselSwiper>

  <HeaderSeeAllLink to="/albums/recently-played">
    Recently Played albums
  </HeaderSeeAllLink>

  <CarouselSwiper v-if="recentAlbums?.length">
    <swiper-slide v-for="album in recentAlbums" :key="album.name">
      <AlbumItem :album="album" />
    </swiper-slide>
  </CarouselSwiper>

  <HeaderSeeAllLink to="/albums/most-played"
    >Most played albums</HeaderSeeAllLink
  >

  <CarouselSwiper v-if="frequentAlbums?.length">
    <swiper-slide v-for="album in frequentAlbums" :key="album.name">
      <AlbumItem :album="album" />
    </swiper-slide>
  </CarouselSwiper>
</template>

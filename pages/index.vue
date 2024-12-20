<script setup lang="ts">
import CarouselSwiper from '@/components/Molecules/CarouselSwiper.vue';
import HeaderSeeAllLink from '@/components/Molecules/HeaderSeeAllLink.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';

const {
  frequentAlbums,
  getFrequentAlbums,
  getNewestAlbums,
  getRecentAlbums,
  newestAlbums,
  recentAlbums,
} = useAlbum();

getFrequentAlbums();
getNewestAlbums();
getRecentAlbums();
</script>

<template>
  <LoadingData>
    <h1>Discover</h1>

    <HeaderSeeAllLink to="/albums/recently-added">
      Newest albums
    </HeaderSeeAllLink>

    <CarouselSwiper v-if="newestAlbums.length">
      <swiper-slide v-for="album in newestAlbums" :key="album.name">
        <AlbumItem :album="album" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/albums/recently-played">
      Recently Played albums
    </HeaderSeeAllLink>

    <CarouselSwiper v-if="recentAlbums.length">
      <swiper-slide v-for="album in recentAlbums" :key="album.name">
        <AlbumItem :album="album" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/albums/most-played">
      Most played albums
    </HeaderSeeAllLink>

    <CarouselSwiper v-if="frequentAlbums.length">
      <swiper-slide v-for="album in frequentAlbums" :key="album.name">
        <AlbumItem :album="album" />
      </swiper-slide>
    </CarouselSwiper>
  </LoadingData>
</template>

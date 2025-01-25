<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import CarouselSwiper from '@/components/Molecules/CarouselSwiper.vue';
import HeaderSeeAllLink from '@/components/Molecules/HeaderSeeAllLink.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';

const { getFrequentAlbums, getNewestAlbums, getRecentAlbums } = useAlbum();

const {
  data: discoverData,
  refresh,
  status,
} = useAsyncData(
  ASYNC_DATA_NAMES.index,
  async () => {
    const [frequentAlbums, newestAlbums, recentAlbums] = await Promise.all([
      getFrequentAlbums(),
      getNewestAlbums(),
      getRecentAlbums(),
    ]);

    return {
      frequentAlbums,
      newestAlbums,
      recentAlbums,
    };
  },
  {
    default: () => ({
      frequentAlbums: [],
      newestAlbums: [],
      recentAlbums: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

useHead({
  title: 'Discover',
});
</script>

<template>
  <HeaderWithAction>
    <h1>Discover</h1>

    <template #actions>
      <RefreshButton :status="status" @refresh="refresh" />
    </template>
  </HeaderWithAction>

  <LoadingData :status="status">
    <HeaderSeeAllLink to="/albums/recently-added">
      Newest albums
    </HeaderSeeAllLink>

    <CarouselSwiper v-if="discoverData.newestAlbums.length">
      <swiper-slide
        v-for="album in discoverData.newestAlbums"
        :key="album.name"
      >
        <AlbumItem :album="album" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/albums/recently-played">
      Recently Played albums
    </HeaderSeeAllLink>

    <CarouselSwiper v-if="discoverData.recentAlbums.length">
      <swiper-slide
        v-for="album in discoverData.recentAlbums"
        :key="album.name"
      >
        <AlbumItem :album="album" />
      </swiper-slide>
    </CarouselSwiper>

    <HeaderSeeAllLink to="/albums/most-played">
      Most played albums
    </HeaderSeeAllLink>

    <CarouselSwiper v-if="discoverData.frequentAlbums.length">
      <swiper-slide
        v-for="album in discoverData.frequentAlbums"
        :key="album.name"
      >
        <AlbumItem :album="album" />
      </swiper-slide>
    </CarouselSwiper>
  </LoadingData>
</template>

<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import CarouselSwiper from '@/components/Molecules/CarouselSwiper.vue';
import HeaderSeeAllLink from '@/components/Molecules/HeaderSeeAllLink.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';
import ArtistItem from '@/components/Organisms/ArtistItem.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';

const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { favourites, getFavourites } = useFavourite();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();
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
      getFavourites(),
    ]);

    return {
      favourites: favourites.value,
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

function playTrack(index: number) {
  playTracks([favourites.value!.tracks[index]], -1);
}

const hasData = computed(
  () =>
    discoverData.value.frequentAlbums.length ||
    discoverData.value.newestAlbums.length ||
    discoverData.value.recentAlbums.length ||
    favourites.value.tracks.length ||
    favourites.value.albums.length ||
    favourites.value.artists.length,
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
    <template v-if="hasData">
      <template v-if="discoverData.newestAlbums.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.albums,
            params: {
              [ROUTE_PARAM_KEYS.albums.sortBy]:
                ROUTE_ALBUMS_SORT_BY_PARAMS['Recently added'],
            },
          }"
        >
          Newest albums
        </HeaderSeeAllLink>

        <CarouselSwiper>
          <swiper-slide
            v-for="album in discoverData.newestAlbums"
            :key="album.name"
          >
            <AlbumItem :album="album" />
          </swiper-slide>
        </CarouselSwiper>
      </template>

      <template v-if="discoverData.recentAlbums.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.albums,
            params: {
              [ROUTE_PARAM_KEYS.albums.sortBy]:
                ROUTE_ALBUMS_SORT_BY_PARAMS['Recently played'],
            },
          }"
        >
          Recently Played albums
        </HeaderSeeAllLink>

        <CarouselSwiper>
          <swiper-slide
            v-for="album in discoverData.recentAlbums"
            :key="album.name"
          >
            <AlbumItem :album="album" />
          </swiper-slide>
        </CarouselSwiper>
      </template>

      <template v-if="discoverData.frequentAlbums.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.albums,
            params: {
              [ROUTE_PARAM_KEYS.albums.sortBy]:
                ROUTE_ALBUMS_SORT_BY_PARAMS['Most played'],
            },
          }"
        >
          Most played albums
        </HeaderSeeAllLink>

        <CarouselSwiper>
          <swiper-slide
            v-for="album in discoverData.frequentAlbums"
            :key="album.name"
          >
            <AlbumItem :album="album" />
          </swiper-slide>
        </CarouselSwiper>
      </template>

      <template v-if="favourites.tracks.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.favourites,
            params: {
              [ROUTE_PARAM_KEYS.favourites.mediaType]:
                ROUTE_MEDIA_TYPE_PARAMS.Tracks,
            },
          }"
        >
          Favourite Tracks
        </HeaderSeeAllLink>

        <TracksList
          :tracks="favourites.tracks.slice(0, 5)"
          @add-to-playlist="addToPlaylistModal"
          @add-to-queue="addTrackToQueue"
          @download-media="downloadMedia"
          @media-information="openTrackInformationModal"
          @play-track="playTrack"
        />
      </template>

      <template v-if="favourites.albums.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.favourites,
            params: {
              [ROUTE_PARAM_KEYS.favourites.mediaType]:
                ROUTE_MEDIA_TYPE_PARAMS.Albums,
            },
          }"
        >
          Favourite Albums
        </HeaderSeeAllLink>

        <CarouselSwiper>
          <swiper-slide
            v-for="album in favourites.albums.slice(0, 15)"
            :key="album.name"
          >
            <AlbumItem :album="album" />
          </swiper-slide>
        </CarouselSwiper>
      </template>

      <template v-if="favourites.artists.length">
        <HeaderSeeAllLink
          :to="{
            name: ROUTE_NAMES.favourites,
            params: {
              [ROUTE_PARAM_KEYS.favourites.mediaType]:
                ROUTE_MEDIA_TYPE_PARAMS.Artists,
            },
          }"
        >
          Favourite Artists
        </HeaderSeeAllLink>

        <CarouselSwiper>
          <swiper-slide
            v-for="artist in favourites.artists.slice(0, 15)"
            :key="artist.name"
          >
            <ArtistItem :artist="artist" />
          </swiper-slide>
        </CarouselSwiper>
      </template>
    </template>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.noMedia"
      message="No media found."
    />
  </LoadingData>
</template>

<script setup lang="ts">
import AlbumItem from '@/components/album/AlbumItem.vue';
import ArtistItem from '@/components/artist/ArtistItem.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistGeneric from '@/components/tracklist/TracklistGeneric.vue';
import CarouselSwiper from '@/components/ui/CarouselSwiper.vue';
import HeaderSeeAllLink from '@/components/ui/HeaderSeeAllLink.vue';
import HeaderWithAction from '@/components/ui/HeaderWithAction.vue';
import RefreshButton from '@/components/ui/RefreshButton.vue';

const { downloadTrack } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { favourites, getFavourites } = useFavourite();
const { openAlbumDetailsModal, openTrackDetailsModal } = useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks } = useAudioPlayer();
const { dragStart } = useDragAndDrop();
const { frequentAlbums, loadDashboardAlbums, newestAlbums, recentAlbums } =
  useAlbum();
const { getMediaTracks } = useMediaTracks();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  ASYNC_DATA_KEYS.index,
  async () => {
    const [, favourites] = await Promise.all([
      loadDashboardAlbums(),
      getFavourites(),
    ]);

    return {
      favourites: favourites.value,
      frequentAlbums: frequentAlbums.value,
      newestAlbums: newestAlbums.value,
      recentAlbums: recentAlbums.value,
    };
  },
  {
    default: () => ({
      favourites: [],
      frequentAlbums: [],
      newestAlbums: [],
      recentAlbums: [],
    }),
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'refresh:manual') {
        return undefined;
      }

      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

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

function onPlayTrack(index: number) {
  playTracks(favourites.value!.tracks, index);
}

const hasData = computed(
  () =>
    frequentAlbums.value.length ||
    newestAlbums.value.length ||
    recentAlbums.value.length ||
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
      <RefreshButton :status @refresh="refresh" />
    </template>
  </HeaderWithAction>

  <LoadingData :status>
    <template v-if="hasData">
      <template v-if="newestAlbums.length">
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

        <CarouselSwiper ref="newestAlbumsCarouselSwiper">
          <swiper-slide
            v-for="album in newestAlbums"
            :key="album.name"
            data-test-id="newest-album-item"
          >
            <AlbumItem
              :album
              @addToQueue="addAlbumToQueue"
              @dragStart="dragStart"
              @mediaInformation="openAlbumDetailsModal"
              @playAlbum="onPlayAlbum"
            />
          </swiper-slide>
        </CarouselSwiper>
      </template>

      <template v-if="recentAlbums.length">
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

        <CarouselSwiper ref="recentAlbumsCarouselSwiper">
          <swiper-slide
            v-for="album in recentAlbums"
            :key="album.name"
            data-test-id="recent-album-item"
          >
            <AlbumItem
              :album
              @addToQueue="addAlbumToQueue"
              @dragStart="dragStart"
              @mediaInformation="openAlbumDetailsModal"
              @playAlbum="onPlayAlbum"
            />
          </swiper-slide>
        </CarouselSwiper>
      </template>

      <template v-if="frequentAlbums.length">
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

        <CarouselSwiper ref="frequentAlbumsCarouselSwiper">
          <swiper-slide
            v-for="album in frequentAlbums"
            :key="album.name"
            data-test-id="frequent-album-item"
          >
            <AlbumItem
              :album
              @addToQueue="addAlbumToQueue"
              @dragStart="dragStart"
              @mediaInformation="openAlbumDetailsModal"
              @playAlbum="onPlayAlbum"
            />
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

        <TracklistGeneric
          :tracks="favourites.tracks.slice(0, PREVIEW_TRACK_COUNT)"
          @addToPlaylist="addToPlaylistModal"
          @addToQueue="addTrackToQueue"
          @downloadMedia="downloadTrack"
          @dragStart="dragStart"
          @mediaInformation="openTrackDetailsModal"
          @playTrack="onPlayTrack"
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

        <CarouselSwiper ref="favouriteAlbumsCarouselSwiper">
          <swiper-slide
            v-for="album in favourites.albums.slice(0, PREVIEW_ALBUM_COUNT)"
            :key="album.name"
            data-test-id="favourite-album-item"
          >
            <AlbumItem
              :album
              @addToQueue="addAlbumToQueue"
              @dragStart="dragStart"
              @mediaInformation="openAlbumDetailsModal"
              @playAlbum="onPlayAlbum"
            />
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

        <CarouselSwiper ref="favouriteArtistsCarouselSwiper">
          <swiper-slide
            v-for="artist in favourites.artists.slice(0, PREVIEW_ARTIST_COUNT)"
            :key="artist.name"
            data-test-id="favourite-artist-item"
          >
            <ArtistItem :artist />
          </swiper-slide>
        </CarouselSwiper>
      </template>
    </template>

    <NoMediaMessage
      v-else
      :icon="FALLBACK_ICON_BY_TYPE.noMedia"
      message="No media found."
    />
  </LoadingData>
</template>

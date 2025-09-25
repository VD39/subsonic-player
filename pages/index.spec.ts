import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import HeaderSeeAllLink from '@/components/Molecules/HeaderSeeAllLink.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';
import {
  getFormattedAlbumsMock,
  getFormattedArtistsMock,
  getFormattedTracksMock,
} from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import IndexPage from './index.vue';

const addToPlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addToPlaylistModal: addToPlaylistModalMock,
}));

const downloadMediaMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  downloadMedia: downloadMediaMock,
}));

const openTrackInformationModalMock = vi.fn();

mockNuxtImport('useMediaInformation', () => () => ({
  openTrackInformationModal: openTrackInformationModalMock,
}));

const dragStartMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  dragStart: dragStartMock,
}));

const favouritesMock = ref<AllMedia>({
  albums: [],
  artists: [],
  tracks: [],
});
const getFavouritesMock = vi.fn();
const addToFavouriteIdsMock = vi.fn();
const toggleFavouriteMock = vi.fn();
const favouriteIdsMock = ref<Record<string, boolean>>({});

mockNuxtImport('useFavourite', () => () => ({
  addToFavouriteIds: addToFavouriteIdsMock,
  favouriteIds: favouriteIdsMock,
  favourites: favouritesMock,
  getFavourites: getFavouritesMock,
  toggleFavourite: toggleFavouriteMock,
}));

const getDiscoverAlbumsMock = vi.fn();
const frequentAlbumsMock = ref<Album[]>([]);
const newestAlbumsMock = ref<Album[]>([]);
const recentAlbumsMock = ref<Album[]>([]);

mockNuxtImport('useAlbum', () => () => ({
  frequentAlbums: frequentAlbumsMock,
  getDiscoverAlbums: getDiscoverAlbumsMock,
  newestAlbums: newestAlbumsMock,
  recentAlbums: recentAlbumsMock,
}));

const refreshMock = vi.fn();

mockNuxtImport('useLazyAsyncData', () => () => ({
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();

const track = getFormattedTracksMock()[0];
const album = getFormattedAlbumsMock()[0];

function factory(props = {}) {
  return mount(IndexPage, {
    global: {
      stubs: {
        AlbumItem: true,
        ArtistItem: true,
        TracksList: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('index', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the useHead function with correct title', () => {
    expect(useHeadTitleMock.value).toBe('Discover');
  });

  describe('when all data is empty', () => {
    it('does not show the HeaderSeeAllLink component', () => {
      expect(wrapper.findComponent(HeaderSeeAllLink).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when data returns a value', () => {
    beforeEach(() => {
      newestAlbumsMock.value = getFormattedAlbumsMock(2);
      recentAlbumsMock.value = getFormattedAlbumsMock(3);
      frequentAlbumsMock.value = getFormattedAlbumsMock();
      favouritesMock.value = {
        albums: getFormattedAlbumsMock(2),
        artists: getFormattedArtistsMock(3),
        tracks: getFormattedTracksMock(4),
      };

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when newestAlbums is not an empty array', () => {
      it('shows the newest albums CarouselSwiper component', () => {
        expect(
          wrapper.findComponent({ ref: 'newestAlbumsCarouselSwiper' }).exists(),
        ).toBe(true);
      });

      it('shows the correct number of newest album item', () => {
        expect(
          wrapper
            .findComponent({ ref: 'newestAlbumsCarouselSwiper' })
            .findAll('[data-test-id="newest-album-item"]').length,
        ).toBe(2);
      });

      describe('when the AlbumItem component triggers the dragstart event', () => {
        beforeEach(async () => {
          await wrapper
            .findComponent({ ref: 'newestAlbumsCarouselSwiper' })
            .findComponent(AlbumItem)
            .trigger('dragstart');
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(
            album,
            expect.any(DragEvent),
          );
        });
      });
    });

    describe('when newestAlbums is an empty array', () => {
      beforeEach(() => {
        newestAlbumsMock.value = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the newest albums CarouselSwiper component', () => {
        expect(
          wrapper.findComponent({ ref: 'newestAlbumsCarouselSwiper' }).exists(),
        ).toBe(false);
      });
    });

    describe('when recentAlbums is not an empty array', () => {
      it('shows the recent albums CarouselSwiper component', () => {
        expect(
          wrapper.findComponent({ ref: 'recentAlbumsCarouselSwiper' }).exists(),
        ).toBe(true);
      });

      it('shows the correct number of recent album item', () => {
        expect(
          wrapper
            .findComponent({ ref: 'recentAlbumsCarouselSwiper' })
            .findAll('[data-test-id="recent-album-item"]').length,
        ).toBe(3);
      });

      describe('when the AlbumItem component triggers the dragstart event', () => {
        beforeEach(async () => {
          await wrapper
            .findComponent({ ref: 'recentAlbumsCarouselSwiper' })
            .findComponent(AlbumItem)
            .trigger('dragstart');
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(
            album,
            expect.any(DragEvent),
          );
        });
      });
    });

    describe('when recentAlbums is an empty array', () => {
      beforeEach(() => {
        recentAlbumsMock.value = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the recent albums CarouselSwiper component', () => {
        expect(
          wrapper.findComponent({ ref: 'recentAlbumsCarouselSwiper' }).exists(),
        ).toBe(false);
      });
    });

    describe('when frequentAlbums is not an empty array', () => {
      it('shows the frequent albums CarouselSwiper component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'frequentAlbumsCarouselSwiper' })
            .exists(),
        ).toBe(true);
      });

      it('shows the correct number of frequent album item', () => {
        expect(
          wrapper
            .findComponent({ ref: 'frequentAlbumsCarouselSwiper' })
            .findAll('[data-test-id="frequent-album-item"]').length,
        ).toBe(1);
      });

      describe('when the AlbumItem component triggers the dragstart event', () => {
        beforeEach(async () => {
          await wrapper
            .findComponent({ ref: 'frequentAlbumsCarouselSwiper' })
            .findComponent(AlbumItem)
            .trigger('dragstart');
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(
            album,
            expect.any(DragEvent),
          );
        });
      });
    });

    describe('when frequentAlbums is an empty array', () => {
      beforeEach(() => {
        frequentAlbumsMock.value = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the frequent albums CarouselSwiper component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'frequentAlbumsCarouselSwiper' })
            .exists(),
        ).toBe(false);
      });
    });

    describe('when favourites tracks is not an empty array', () => {
      it('shows the TracksList component', () => {
        expect(wrapper.findComponent(TracksList).exists()).toBe(true);
      });

      describe(`when favourites tracks has less than ${PREVIEW_TRACK_COUNT} items`, () => {
        it('shows the correct number of the TracksList component', () => {
          expect(
            wrapper.findComponent(TracksList).props('tracks').length,
          ).toEqual(4);
        });
      });

      describe(`when favourites tracks has more than ${PREVIEW_TRACK_COUNT} items`, () => {
        beforeEach(() => {
          favouritesMock.value.tracks = getFormattedTracksMock(
            PREVIEW_TRACK_COUNT + 5,
          );

          wrapper = factory();
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('sets the correct tracks prop on the TracksList component', () => {
          expect(
            wrapper.findComponent(TracksList).props('tracks').length,
          ).toEqual(PREVIEW_TRACK_COUNT);
        });
      });

      describe('when the TracksList component emits the addToPlaylist event', () => {
        beforeEach(() => {
          wrapper
            .findComponent(TracksList)
            .vm.$emit('addToPlaylist', track.id, 1);
        });

        it('calls the addToPlaylistModal function with the correct parameters', () => {
          expect(addToPlaylistModalMock).toHaveBeenCalledWith(track.id, 1);
        });
      });

      describe('when the TracksList component emits the addToQueue event', () => {
        beforeEach(() => {
          wrapper.findComponent(TracksList).vm.$emit('addToQueue', track);
        });

        it('calls the addTrackToQueue function with the correct parameters', () => {
          expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the TracksList component emits the downloadMedia event', () => {
        beforeEach(() => {
          wrapper.findComponent(TracksList).vm.$emit('downloadMedia', track);
        });

        it('calls the downloadMedia function with the correct parameters', () => {
          expect(downloadMediaMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the TracksList component emits the dragStart event', () => {
        beforeEach(() => {
          wrapper.findComponent(TracksList).vm.$emit('dragStart', track);
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the TracksList component emits the mediaInformation event', () => {
        beforeEach(() => {
          wrapper.findComponent(TracksList).vm.$emit('mediaInformation', track);
        });

        it('calls the openTrackInformationModal function with the correct parameters', () => {
          expect(openTrackInformationModalMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the TracksList component emits the playTrack event', () => {
        beforeEach(() => {
          wrapper.findComponent(TracksList).vm.$emit('playTrack', 1);
        });

        it('calls the playTracks function with the correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(
            favouritesMock.value.tracks,
            0,
          );
        });
      });
    });

    describe('when favourites tracks is an empty array', () => {
      beforeEach(() => {
        favouritesMock.value.tracks = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the TracksList component', () => {
        expect(wrapper.findComponent(TracksList).exists()).toBe(false);
      });
    });

    describe('when favourites albums is not an empty array', () => {
      it('shows the favourite albums CarouselSwiper component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'favouriteAlbumsCarouselSwiper' })
            .exists(),
        ).toBe(true);
      });

      describe(`when favourites albums has less than ${PREVIEW_ALBUM_COUNT} items`, () => {
        it('shows the correct number of favourite albums', () => {
          expect(
            wrapper
              .findComponent({ ref: 'favouriteAlbumsCarouselSwiper' })
              .findAll('[data-test-id="favourite-album-item"]').length,
          ).toEqual(2);
        });
      });

      describe(`when favourites albums has more than ${PREVIEW_ALBUM_COUNT} items`, () => {
        beforeEach(() => {
          favouritesMock.value.albums = getFormattedAlbumsMock(
            PREVIEW_ALBUM_COUNT + 5,
          );

          wrapper = factory();
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('shows the correct number of favourite albums', () => {
          expect(
            wrapper
              .findComponent({ ref: 'favouriteAlbumsCarouselSwiper' })
              .findAll('[data-test-id="favourite-album-item"]').length,
          ).toEqual(PREVIEW_ALBUM_COUNT);
        });
      });

      describe('when the AlbumItem component triggers the dragstart event', () => {
        beforeEach(async () => {
          await wrapper
            .findComponent({ ref: 'favouriteAlbumsCarouselSwiper' })
            .findComponent(AlbumItem)
            .trigger('dragstart');
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(
            album,
            expect.any(DragEvent),
          );
        });
      });
    });

    describe('when favourites albums is an empty array', () => {
      beforeEach(() => {
        favouritesMock.value.albums = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the favourite albums CarouselSwiper component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'favouriteAlbumsCarouselSwiper' })
            .exists(),
        ).toBe(false);
      });
    });

    describe('when favourites artists is not an empty array', () => {
      it('shows the favourite artists CarouselSwiper component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'favouriteArtistsCarouselSwiper' })
            .exists(),
        ).toBe(true);
      });

      it('shows the correct number of favourite artists', () => {
        expect(
          wrapper
            .findComponent({ ref: 'favouriteArtistsCarouselSwiper' })
            .findAll('[data-test-id="favourite-artist-item"]').length,
        ).toBe(3);
      });

      describe(`when favourites artists has less than ${PREVIEW_ARTIST_COUNT} items`, () => {
        it('shows the correct number of favourite artists', () => {
          expect(
            wrapper
              .findComponent({ ref: 'favouriteArtistsCarouselSwiper' })
              .findAll('[data-test-id="favourite-artist-item"]').length,
          ).toEqual(3);
        });
      });

      describe(`when favourites artists has more than ${PREVIEW_ARTIST_COUNT} items`, () => {
        beforeEach(() => {
          favouritesMock.value.artists = getFormattedArtistsMock(
            PREVIEW_ARTIST_COUNT + 5,
          );

          wrapper = factory();
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('shows the correct number of favourite artists', () => {
          expect(
            wrapper
              .findComponent({ ref: 'favouriteArtistsCarouselSwiper' })
              .findAll('[data-test-id="favourite-artist-item"]').length,
          ).toEqual(PREVIEW_ARTIST_COUNT);
        });
      });
    });

    describe('when favourites artists is an empty array', () => {
      beforeEach(() => {
        favouritesMock.value.artists = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the favourite artists CarouselSwiper component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'favouriteArtistsCarouselSwiper' })
            .exists(),
        ).toBe(false);
      });
    });
  });

  describe('when the RefreshButton component emits the refresh event', () => {
    beforeEach(() => {
      wrapper.findComponent(RefreshButton).vm.$emit('refresh');
    });

    it('calls the refresh function', () => {
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});

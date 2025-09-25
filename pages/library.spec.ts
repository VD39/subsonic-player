import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import HeaderSeeAllLink from '@/components/Molecules/HeaderSeeAllLink.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';
import PlaylistsList from '@/components/Organisms/PlaylistsList.vue';
import {
  getFormattedAlbumsMock,
  getFormattedArtistsMock,
  getFormattedGenresMock,
  getFormattedPlaylistsMock,
} from '@/test/helpers';
import { useHeadMock } from '@/test/useHeadMock';

import LibraryPage from './library.vue';

const dragStartMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  dragStart: dragStartMock,
}));

const getRandomAlbumsMock = vi.fn();

mockNuxtImport('useAlbum', () => () => ({
  getRandomAlbums: getRandomAlbumsMock,
}));

const getArtistsMock = vi.fn();

mockNuxtImport('useArtist', () => () => ({
  getArtists: getArtistsMock,
}));

const getGenresMock = vi.fn();

mockNuxtImport('useGenre', () => () => ({
  getGenres: getGenresMock,
}));

const getPlaylistsMock = vi.fn();
const playlistsMock = ref<Playlist[]>([]);

mockNuxtImport('usePlaylist', () => () => ({
  getPlaylists: getPlaylistsMock,
  playlists: playlistsMock,
}));

const libraryDataMock = ref<{
  artists: Artist[];
  genres: Genre[];
  randomAlbums: Album[];
}>({
  artists: [],
  genres: [],
  randomAlbums: [],
});

mockNuxtImport('useAsyncData', () => () => ({
  data: libraryDataMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();

const album = getFormattedAlbumsMock()[0];

function factory(props = {}) {
  return mount(LibraryPage, {
    global: {
      stubs: {
        PlaylistsList: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('library', () => {
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
    expect(useHeadTitleMock.value).toBe('Library');
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
      libraryDataMock.value = {
        artists: getFormattedArtistsMock(3),
        genres: getFormattedGenresMock(2),
        randomAlbums: getFormattedAlbumsMock(2),
      };
      playlistsMock.value = getFormattedPlaylistsMock(2);

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when randomAlbums is not an empty array', () => {
      it('shows the album CarouselSwiper component', () => {
        expect(
          wrapper.findComponent({ ref: 'randomAlbumCarouselSwiper' }).exists(),
        ).toBe(true);
      });

      it('shows the correct number of album item', () => {
        expect(
          wrapper
            .findComponent({ ref: 'randomAlbumCarouselSwiper' })
            .findAll('[data-test-id="random-album-item"]').length,
        ).toBe(2);
      });

      describe('when the AlbumItem component triggers the dragstart event', () => {
        beforeEach(async () => {
          await wrapper
            .findComponent({ ref: 'randomAlbumCarouselSwiper' })
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

    describe('when randomAlbums is an empty array', () => {
      beforeEach(() => {
        libraryDataMock.value.randomAlbums = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the album CarouselSwiper component', () => {
        expect(
          wrapper.findComponent({ ref: 'randomAlbumCarouselSwiper' }).exists(),
        ).toBe(false);
      });
    });

    describe('when artists is not an empty array', () => {
      describe(`when artists length is less than or equal to ${PREVIEW_ARTIST_COUNT}`, () => {
        it('shows the artist CarouselSwiper component', () => {
          expect(
            wrapper.findComponent({ ref: 'artistCarouselSwiper' }).exists(),
          ).toBe(true);
        });

        it('shows the correct number of artist item', () => {
          expect(
            wrapper
              .findComponent({ ref: 'artistCarouselSwiper' })
              .findAll('[data-test-id="random-artist-item"]').length,
          ).toBe(3);
        });
      });

      describe(`when artists length is greater than ${PREVIEW_ARTIST_COUNT}`, () => {
        beforeEach(() => {
          libraryDataMock.value.artists = getFormattedArtistsMock(
            PREVIEW_ARTIST_COUNT + 5,
          );

          wrapper = factory();
        });

        it('shows the artist CarouselSwiper component', () => {
          expect(
            wrapper.findComponent({ ref: 'artistCarouselSwiper' }).exists(),
          ).toBe(true);
        });

        it('shows the correct number of artist item', () => {
          expect(
            wrapper
              .findComponent({ ref: 'artistCarouselSwiper' })
              .findAll('[data-test-id="random-artist-item"]').length,
          ).toBe(PREVIEW_ARTIST_COUNT);
        });
      });
    });

    describe('when artists is an empty array', () => {
      beforeEach(() => {
        libraryDataMock.value.artists = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the artist CarouselSwiper component', () => {
        expect(
          wrapper.findComponent({ ref: 'artistCarouselSwiper' }).exists(),
        ).toBe(false);
      });
    });

    describe('when genres is not an empty array', () => {
      describe(`when genres length is less than or equal to ${PREVIEW_GENRES_COUNT}`, () => {
        it('shows the genre CarouselSwiper component', () => {
          expect(
            wrapper.findComponent({ ref: 'genreCarouselSwiper' }).exists(),
          ).toBe(true);
        });

        it('shows the correct number of genre item', () => {
          expect(
            wrapper
              .findComponent({ ref: 'genreCarouselSwiper' })
              .findAll('[data-test-id="random-genre-item"]').length,
          ).toBe(2);
        });
      });

      describe(`when genres length is greater than ${PREVIEW_GENRES_COUNT}`, () => {
        beforeEach(() => {
          libraryDataMock.value.genres = getFormattedGenresMock(
            PREVIEW_GENRES_COUNT + 5,
          );

          wrapper = factory();
        });

        it('shows the genre CarouselSwiper component', () => {
          expect(
            wrapper.findComponent({ ref: 'genreCarouselSwiper' }).exists(),
          ).toBe(true);
        });

        it('shows the correct number of genre item', () => {
          expect(
            wrapper
              .findComponent({ ref: 'genreCarouselSwiper' })
              .findAll('[data-test-id="random-genre-item"]').length,
          ).toBe(PREVIEW_GENRES_COUNT);
        });
      });
    });

    describe('when genres is an empty array', () => {
      beforeEach(() => {
        libraryDataMock.value.genres = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the genre CarouselSwiper component', () => {
        expect(
          wrapper.findComponent({ ref: 'genreCarouselSwiper' }).exists(),
        ).toBe(false);
      });
    });

    describe('when playlists is not an empty array', () => {
      it('shows the PlaylistsList component', () => {
        expect(wrapper.findComponent(PlaylistsList).exists()).toBe(true);
      });

      describe(`when playlists has less than ${PREVIEW_PLAYLIST_COUNT} items`, () => {
        it('shows the correct number of playlist item', () => {
          expect(
            wrapper.findComponent(PlaylistsList).props('playlists').length,
          ).toEqual(2);
        });
      });

      describe(`when playlists has more than ${PREVIEW_PLAYLIST_COUNT} items`, () => {
        beforeEach(() => {
          playlistsMock.value = getFormattedPlaylistsMock(
            PREVIEW_PLAYLIST_COUNT + 5,
          );

          wrapper = factory();
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('shows the correct number of playlist item', () => {
          expect(
            wrapper.findComponent(PlaylistsList).props('playlists').length,
          ).toEqual(PREVIEW_PLAYLIST_COUNT);
        });
      });
    });

    describe('when playlists is an empty array', () => {
      beforeEach(() => {
        playlistsMock.value = [];
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the PlaylistsList component', () => {
        expect(wrapper.findComponent(PlaylistsList).exists()).toBe(false);
      });
    });
  });
});

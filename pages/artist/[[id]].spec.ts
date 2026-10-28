import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import AlbumList from '@/components/album/AlbumList.vue';
import ArtistList from '@/components/artist/ArtistList.vue';
import GenreList from '@/components/artist/GenreList.vue';
import LoadingData from '@/components/notification/LoadingData.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TextClamp from '@/components/ui/TextClamp.vue';
import {
  getFormattedArtistsMock,
  getFormattedTracksMock,
} from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import ArtistPage from './[[id]].vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(() => ({
    data: null,
  })),
  getImageUrl: vi.fn((path) => path),
}));

const openModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useModal', (original) => () => ({
  ...original(),
  openModal: openModalMock,
}));

const downloadTrackMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaLibrary', (original) => () => ({
  ...original(),
  downloadTrack: downloadTrackMock,
}));

const addToPlaylistModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('usePlaylist', (original) => () => ({
  ...original(),
  addToPlaylistModal: addToPlaylistModalMock,
}));

const { openAlbumDetailsModalMock, openTrackDetailsModalMock } = vi.hoisted(
  () => ({
    openAlbumDetailsModalMock: vi.fn(),
    openTrackDetailsModalMock: vi.fn(),
  }),
);

mockNuxtImport('useMediaInformation', (original) => () => ({
  ...original(),
  openAlbumDetailsModal: openAlbumDetailsModalMock,
  openTrackDetailsModal: openTrackDetailsModalMock,
}));

const getMediaTracksMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaTracks', (original) => () => ({
  ...original(),
  getMediaTracks: getMediaTracksMock,
}));

const dragStartMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  dragStart: dragStartMock,
}));

const artistDataMock = ref<{
  artist: Artist | null;
}>({
  artist: null,
});
const topSongsDataMock = ref<{
  tracks: Track[];
}>({
  tracks: [],
});
const topSongsStatusMock = ref('success');

mockNuxtImport('useAsyncData', () => (key: (() => string) | string) => ({
  data: typeof key === 'function' ? topSongsDataMock : artistDataMock,
  error: ref(null),
  pending: ref(false),
  status: typeof key === 'function' ? topSongsStatusMock : ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const { addTracksToQueueMock, addTrackToQueueMock, playTracksMock } =
  useAudioPlayerMock();

const track = getFormattedTracksMock()[0];
const albumTracks = getFormattedTracksMock(3);
const artist = getFormattedArtistsMock()[0];
const album = artist.albums[0];

function factory(props = {}) {
  return mount(ArtistPage, {
    global: {
      stubs: {
        AlbumList: true,
        ArtistList: true,
        GenreList: true,
        TracklistGeneric: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('[[id]]', () => {
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

  describe('when getArtist does not return any data', () => {
    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('Artist');
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });

    it('does not show the artist content', () => {
      expect(wrapper.find({ ref: 'artistContent' }).exists()).toBe(false);
    });
  });

  describe('when getArtist does return data', () => {
    beforeEach(() => {
      artistDataMock.value = {
        artist: getFormattedArtistsMock()[0],
      };

      wrapper = factory();
    });

    afterAll(() => {
      artistDataMock.value = {
        artist: null,
      };
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('artist-0 - Artist');
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    it('shows the artist content', () => {
      expect(wrapper.find({ ref: 'artistContent' }).exists()).toBe(true);
    });

    describe('when the topSongsStatus value is pending', () => {
      beforeEach(() => {
        topSongsStatusMock.value = 'pending';
        wrapper = factory();
      });

      afterAll(() => {
        topSongsStatusMock.value = 'success';
      });

      it('sets the correct status prop on the LoadingData component', () => {
        expect(wrapper.findComponent(LoadingData).props('status')).toBe(
          'success',
        );
      });

      it('shows the artistContent element', () => {
        expect(wrapper.find({ ref: 'artistContent' }).isVisible()).toBe(true);
      });
    });

    describe('when artist.biography is not set', () => {
      it('does not show the TextClamp component', () => {
        expect(wrapper.findComponent(TextClamp).exists()).toBe(false);
      });
    });

    describe('when artist.biography is set', () => {
      beforeEach(() => {
        artistDataMock.value = {
          artist: getFormattedArtistsMock(1, {
            biography: 'biography',
          })[0],
        };

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the TextClamp component', () => {
        expect(wrapper.findComponent(TextClamp).exists()).toBe(true);
      });

      describe('when the TextClamp component emits the expand event', () => {
        beforeEach(() => {
          wrapper.findComponent(TextClamp).vm.$emit('expand');
        });

        it('calls the openModal function with the correct parameters', () => {
          expect(openModalMock).toHaveBeenCalledWith(MODAL_TYPE.readMoreModal, {
            text: artistDataMock.value.artist!.biography,
            title: 'Artist biography',
          });
        });
      });
    });

    describe('when artist.genres is an empty array', () => {
      beforeEach(() => {
        artistDataMock.value = {
          artist: getFormattedArtistsMock(1, {
            genres: [],
          })[0],
        };

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the GenreList component', () => {
        expect(wrapper.findComponent(GenreList).exists()).toBe(false);
      });
    });

    describe('when artist.genres is not an empty array', () => {
      it('shows the GenreList component', () => {
        expect(wrapper.findComponent(GenreList).exists()).toBe(true);
      });
    });

    describe('when artist.totalAlbums is 1', () => {
      it('shows the correct album count text', () => {
        expect(wrapper.find({ ref: 'albumCount' }).text()).toBe('1 Album');
      });
    });

    describe('when artist.totalAlbums is greater than 1', () => {
      beforeEach(() => {
        artistDataMock.value = {
          artist: getFormattedArtistsMock(1, {
            totalAlbums: 5,
          })[0],
        };

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct album count text', () => {
        expect(wrapper.find({ ref: 'albumCount' }).text()).toBe('5 Albums');
      });
    });

    describe('when artist.totalTracks is 1', () => {
      it('shows the correct track count text', () => {
        expect(wrapper.find({ ref: 'trackCount' }).text()).toBe('1 Track');
      });
    });

    describe('when artist.totalTracks is greater than 1', () => {
      beforeEach(() => {
        artistDataMock.value = {
          artist: getFormattedArtistsMock(1, {
            totalTracks: 10,
          })[0],
        };

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct track count text', () => {
        expect(wrapper.find({ ref: 'trackCount' }).text()).toBe('10 Tracks');
      });
    });

    describe('when artist.lastFmUrl is not set', () => {
      it('does not show the LastFm ButtonLink component', () => {
        expect(wrapper.findComponent({ ref: 'lastFmButton' }).exists()).toBe(
          false,
        );
      });
    });

    describe('when artist.lastFmUrl is set', () => {
      beforeEach(() => {
        artistDataMock.value = {
          artist: getFormattedArtistsMock(1, {
            lastFmUrl: 'lastFmUrl',
          })[0],
        };

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the LastFm ButtonLink component', () => {
        expect(wrapper.findComponent({ ref: 'lastFmButton' }).exists()).toBe(
          true,
        );
      });
    });

    describe('when artist.musicBrainzUrl is not set', () => {
      it('does not show the MusicBrainz ButtonLink component', () => {
        expect(
          wrapper.findComponent({ ref: 'musicBrainzButton' }).exists(),
        ).toBe(false);
      });
    });

    describe('when artist.musicBrainzUrl is set', () => {
      beforeEach(() => {
        artistDataMock.value = {
          artist: getFormattedArtistsMock(1, {
            musicBrainzUrl: 'musicBrainzUrl',
          })[0],
        };

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the MusicBrainz ButtonLink component', () => {
        expect(
          wrapper.findComponent({ ref: 'musicBrainzButton' }).exists(),
        ).toBe(true);
      });
    });

    describe.each([
      ['topSongsData.tracks', 'top', 'topTracksTracklistGeneric'],
      ['artist.similarTracks', 'similar', 'similarTracksTracklistGeneric'],
    ])('when %s is an empty array', (_key, component, ref) => {
      it(`does not show the ${component} tracks TracklistGeneric component`, () => {
        expect(wrapper.findComponent({ ref }).exists()).toBe(false);
      });
    });

    describe.each([
      ['topSongsData.tracks', 'top', 'topTracksTracklistGeneric'],
      ['artist.similarTracks', 'similar', 'similarTracksTracklistGeneric'],
    ])('when %s is not an empty array', (_key, component, ref) => {
      beforeEach(() => {
        if (component === 'top') {
          topSongsDataMock.value = {
            tracks: getFormattedTracksMock(5),
          };
        } else {
          artistDataMock.value = {
            artist: getFormattedArtistsMock(1, {
              similarTracks: getFormattedTracksMock(3),
            })[0],
          };
        }

        wrapper = factory();
      });

      afterEach(() => {
        topSongsDataMock.value = {
          tracks: [],
        };
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it(`shows the ${component} tracks TracklistGeneric component`, () => {
        expect(wrapper.findComponent({ ref }).exists()).toBe(true);
      });

      describe(`when the ${component} TracklistGeneric component emits the addToPlaylist event`, () => {
        beforeEach(() => {
          wrapper.findComponent({ ref }).vm.$emit('addToPlaylist', track);
        });

        it('calls the addToPlaylistModal function with the correct parameters', () => {
          expect(addToPlaylistModalMock).toHaveBeenCalledWith(track);
        });
      });

      describe(`when the ${component} TracklistGeneric component emits the addToQueue event`, () => {
        beforeEach(() => {
          wrapper.findComponent({ ref }).vm.$emit('addToQueue', track);
        });

        it('calls the addTrackToQueue function with the correct parameters', () => {
          expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
        });
      });

      describe(`when the ${component} TracklistGeneric component emits the downloadMedia event`, () => {
        beforeEach(() => {
          wrapper.findComponent({ ref }).vm.$emit('downloadMedia', track);
        });

        it('calls the downloadTrack function with the correct parameters', () => {
          expect(downloadTrackMock).toHaveBeenCalledWith(track);
        });
      });

      describe(`when the ${component} TracklistGeneric component emits the dragStart event`, () => {
        beforeEach(() => {
          wrapper.findComponent({ ref }).vm.$emit('dragStart', track);
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(track);
        });
      });

      describe(`when the ${component} TracklistGeneric component emits the playTrack event`, () => {
        beforeEach(() => {
          wrapper.findComponent({ ref }).vm.$emit('playTrack', 2);
        });

        it('calls the playTracks function with the correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(
            component === 'top'
              ? topSongsDataMock.value.tracks
              : artistDataMock.value.artist!.similarTracks,
            2,
          );
        });
      });

      describe(`when the ${component} TracklistGeneric component emits the mediaInformation event`, () => {
        beforeEach(() => {
          wrapper.findComponent({ ref }).vm.$emit('mediaInformation', track);
        });

        it('calls the openTrackDetailsModal function with the correct parameters', () => {
          expect(openTrackDetailsModalMock).toHaveBeenCalledWith(track);
        });
      });
    });

    describe('when artist.similarArtists is an empty array', () => {
      it('does not show the ArtistList component', () => {
        expect(wrapper.findComponent(ArtistList).exists()).toBe(false);
      });
    });

    describe('when artist.similarArtists is not an empty array', () => {
      beforeEach(() => {
        artistDataMock.value = {
          artist: getFormattedArtistsMock(1, {
            similarArtists: [artist],
          })[0],
        };

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the ArtistList component', () => {
        expect(wrapper.findComponent(ArtistList).exists()).toBe(true);
      });
    });

    describe('when the AlbumList component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper.findComponent(AlbumList).vm.$emit('dragStart', album);
      });

      it('calls the dragStart function with the correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(album);
      });
    });

    describe('when the AlbumList component emits the addToQueue event', () => {
      describe('when getMediaTracks returns tracks', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(albumTracks);
          wrapper.findComponent(AlbumList).vm.$emit('addToQueue', album);
        });

        it('calls the addTracksToQueue function with the correct parameters', () => {
          expect(addTracksToQueueMock).toHaveBeenCalledWith(albumTracks);
        });
      });

      describe('when getMediaTracks returns null', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(null);
          wrapper.findComponent(AlbumList).vm.$emit('addToQueue', album);
        });

        it('does not call the addTracksToQueue function', () => {
          expect(addTracksToQueueMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the AlbumList component emits the mediaInformation event', () => {
      beforeEach(() => {
        wrapper.findComponent(AlbumList).vm.$emit('mediaInformation', album);
      });

      it('calls the openAlbumDetailsModal function with the correct parameters', () => {
        expect(openAlbumDetailsModalMock).toHaveBeenCalledWith(album);
      });
    });

    describe('when the AlbumList component emits the playAlbum event', () => {
      describe('when getMediaTracks returns tracks', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(albumTracks);
          wrapper.findComponent(AlbumList).vm.$emit('playAlbum', album);
        });

        it('calls the playTracks function with the correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(albumTracks);
        });
      });

      describe('when getMediaTracks returns null', () => {
        beforeEach(() => {
          getMediaTracksMock.mockResolvedValue(null);
          wrapper.findComponent(AlbumList).vm.$emit('playAlbum', album);
        });

        it('does not call the playTracks function', () => {
          expect(playTracksMock).not.toHaveBeenCalled();
        });
      });
    });
  });
});

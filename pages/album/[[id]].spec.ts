import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ArtistLinkList from '@/components/artist/ArtistLinkList.vue';
import GenreList from '@/components/artist/GenreList.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistAlbum from '@/components/tracklist/TracklistAlbum.vue';
import EntryHeader from '@/components/ui/EntryHeader.vue';
import { getFormattedAlbumsMock, getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import AlbumPage from './[[id]].vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

mockNuxtImport('useDropdownMenu', () => () => ({
  isOpen: ref(true),
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

const openTrackDetailsModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaInformation', (original) => () => ({
  ...original(),
  openTrackDetailsModal: openTrackDetailsModalMock,
}));

const dragStartMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  dragStart: dragStartMock,
}));

const albumDataMock = ref<{
  album: Album | null;
}>({
  album: null,
});

mockNuxtImport('useAsyncData', () => () => ({
  data: albumDataMock,
  error: ref(null),
  pending: ref(false),
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const {
  addTracksToQueueMock,
  addTrackToQueueMock,
  playTracksMock,
  shuffleTracksMock,
} = useAudioPlayerMock();

const track = getFormattedTracksMock()[0];
const album = getFormattedAlbumsMock()[0];

function factory(props = {}) {
  return mount(AlbumPage, {
    global: {
      stubs: {
        ArtistLinkList: true,
        FavouriteButton: true,
        GenreList: true,
        TracklistAlbum: true,
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

  describe('when getAlbum does not return any data', () => {
    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('Album');
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });

    it('does not show the album content', () => {
      expect(wrapper.find({ ref: 'albumContent' }).exists()).toBe(false);
    });
  });

  describe('when getAlbum does return data', () => {
    beforeEach(() => {
      albumDataMock.value = {
        album: getFormattedAlbumsMock()[0],
      };

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('album-0 - Album');
    });

    it('shows the album content', () => {
      expect(wrapper.find({ ref: 'albumContent' }).exists()).toBe(true);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when album.artists is an empty array', () => {
      beforeEach(() => {
        albumDataMock.value = {
          album: getFormattedAlbumsMock(1, {
            artists: [],
          })[0],
        };

        wrapper = factory();
      });

      it('does not show the ArtistLinkList component', () => {
        expect(wrapper.findComponent(ArtistLinkList).exists()).toBe(false);
      });
    });

    describe('when album.artists is not an empty array', () => {
      it('shows the ArtistLinkList component', () => {
        expect(wrapper.findComponent(ArtistLinkList).exists()).toBe(true);
      });
    });

    describe('when album.genres is an empty array', () => {
      beforeEach(() => {
        albumDataMock.value = {
          album: getFormattedAlbumsMock(1, {
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

    describe('when album.genres is not an empty array', () => {
      it('shows the GenreList component', () => {
        expect(wrapper.findComponent(GenreList).exists()).toBe(true);
      });
    });

    describe('when album.trackCount is 1', () => {
      beforeEach(() => {
        albumDataMock.value = {
          album: getFormattedAlbumsMock(1, {
            trackCount: 1,
          })[0],
        };

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct track count text', () => {
        expect(wrapper.find({ ref: 'trackCount' }).text()).toBe('1  Track');
      });
    });

    describe('when album.trackCount is greater than 1', () => {
      it('shows the correct track count text', () => {
        expect(wrapper.find({ ref: 'trackCount' }).text()).toBe('4  Tracks');
      });
    });

    describe('when album.totalDiscNumber is 1', () => {
      it('shows the correct disc count text', () => {
        expect(wrapper.find({ ref: 'discCount' }).text()).toBe('1  Disc');
      });

      it('does not show the disc number title', () => {
        expect(wrapper.find({ ref: 'discNumberTitle' }).exists()).toBe(false);
      });
    });

    describe('when album.totalDiscNumber is greater than 1', () => {
      beforeEach(() => {
        albumDataMock.value = {
          album: getFormattedAlbumsMock(1, {
            totalDiscNumber: 5,
            tracksByDiscNumber: {
              1: [track],
              2: [track],
              3: [track],
              4: [track],
              5: [track],
            },
          })[0],
        };

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct disc count text', () => {
        expect(wrapper.find({ ref: 'discCount' }).text()).toBe('5  Discs');
      });

      it('shows the correct disc number of disc number title', () => {
        expect(
          wrapper.findAll('[data-test-id="disc-number-title"]'),
        ).toHaveLength(5);
      });
    });

    describe('when the EntryHeader component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper.findComponent(EntryHeader).vm.$emit('dragStart', DragEvent);
      });

      it('calls the dragStart function with correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(album, DragEvent);
      });
    });

    describe('when the play tracks ButtonLink component emits a click event', () => {
      beforeEach(async () => {
        await wrapper
          .findComponent({ ref: 'playTracksButton' })
          .trigger('click');
      });

      it('calls the playTracks function with correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith(album.tracks);
      });
    });

    describe('when the shuffle tracks ButtonLink component emits a click event', () => {
      beforeEach(async () => {
        await wrapper
          .findComponent({ ref: 'shuffleTracksButton' })
          .trigger('click');
      });

      it('calls the playTracksShuffled function with correct parameters', () => {
        expect(shuffleTracksMock).toHaveBeenCalledWith(album.tracks);
      });
    });

    describe('when the add to queue DropdownItem component emits a click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ ref: 'addToQueueDropdownItem' })
          .vm.$emit('click');
      });

      it('calls the addTracksToQueue function with correct parameters', () => {
        expect(addTracksToQueueMock).toHaveBeenCalledWith(album.tracks);
      });
    });

    describe('when the play tracks DropdownItem component emits a click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ ref: 'playTracksDropdownItem' })
          .vm.$emit('click');
      });

      it('calls the playTracks function with correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith(album.tracks);
      });
    });

    describe('when the TracklistAlbum component emits the addToPlaylist event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(TracklistAlbum)
          .vm.$emit('addToPlaylist', track.id, 1);
      });

      it('calls the addToPlaylistModal function with correct parameters', () => {
        expect(addToPlaylistModalMock).toHaveBeenCalledWith(track.id, 1);
      });
    });

    describe('when the TracklistAlbum component emits the addToQueue event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracklistAlbum).vm.$emit('addToQueue', track);
      });

      it('calls the addTrackToQueue function with correct parameters', () => {
        expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TracklistAlbum component emits the downloadMedia event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracklistAlbum).vm.$emit('downloadMedia', track);
      });

      it('calls the downloadTrack function with correct parameters', () => {
        expect(downloadTrackMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TracklistAlbum component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(TracklistAlbum)
          .vm.$emit('dragStart', track, DragEvent);
      });

      it('calls the dragStart function with correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(track, DragEvent);
      });
    });

    describe('when the TracklistAlbum component emits the mediaInformation event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(TracklistAlbum)
          .vm.$emit('mediaInformation', track);
      });

      it('calls the openTrackDetailsModal function with correct parameters', () => {
        expect(openTrackDetailsModalMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the TracklistAlbum component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TracklistAlbum).vm.$emit('playTrack', 1);
      });

      it('calls the playTracks function with correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith(album.tracks, 1);
      });
    });
  });
});

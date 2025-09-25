import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import GenreList from '@/components/Atoms/GenreList.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import AlbumTracksList from '@/components/Organisms/TrackLists/AlbumTracksList.vue';
import { getFormattedAlbumsMock, getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import AlbumPage from './[[id]].vue';

const downloadMediaMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  downloadMedia: downloadMediaMock,
}));

const addToPlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addToPlaylistModal: addToPlaylistModalMock,
}));

const openTrackInformationModalMock = vi.fn();

mockNuxtImport('useMediaInformation', () => () => ({
  openTrackInformationModal: openTrackInformationModalMock,
}));

const dragStartMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  dragStart: dragStartMock,
}));

const albumDataMock = ref<{
  album: Album | null;
}>({
  album: null,
});

mockNuxtImport('useAsyncData', () => () => ({
  data: albumDataMock,
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

async function factory(props = {}) {
  const wrapper = mount(AlbumPage, {
    global: {
      stubs: {
        AlbumTracksList: true,
        ArtistsList: true,
        FavouriteButton: true,
        GenreList: true,
      },
    },
    props: {
      ...props,
    },
  });

  await wrapper.vm.$nextTick();

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
}

describe('[[id]]', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await factory();
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
    beforeEach(async () => {
      albumDataMock.value = {
        album: getFormattedAlbumsMock()[0],
      };

      wrapper = await factory();
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
      beforeEach(async () => {
        albumDataMock.value = {
          album: getFormattedAlbumsMock(1, {
            artists: [],
          })[0],
        };

        wrapper = await factory();
      });

      it('does not show the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
      });
    });

    describe('when album.artists is not an empty array', () => {
      it('shows the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
      });
    });

    describe('when album.genres is an empty array', () => {
      beforeEach(async () => {
        albumDataMock.value = {
          album: getFormattedAlbumsMock(1, {
            genres: [],
          })[0],
        };

        wrapper = await factory();
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
      beforeEach(async () => {
        albumDataMock.value = {
          album: getFormattedAlbumsMock(1, {
            trackCount: 1,
          })[0],
        };

        wrapper = await factory();
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
      beforeEach(async () => {
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

        wrapper = await factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct disc count text', () => {
        expect(wrapper.find({ ref: 'discCount' }).text()).toBe('5  Discs');
      });

      it('shows the correct disc number of disc number title', () => {
        expect(
          wrapper.findAll('[data-test-id="disc-number-title"]').length,
        ).toBe(5);
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
      beforeEach(() => {
        wrapper.findComponent({ ref: 'playTracksButton' }).vm.$emit('click');
      });

      it('calls the playTracks function with correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith(album.tracks);
      });
    });

    describe('when the shuffle tracks ButtonLink component emits a click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'shuffleTracksButton' }).vm.$emit('click');
      });

      it('calls the shuffleTracks function with correct parameters', () => {
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

    describe('when the AlbumTracksList component emits the addToPlaylist event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(AlbumTracksList)
          .vm.$emit('addToPlaylist', track.id, 1);
      });

      it('calls the addToPlaylistModal function with correct parameters', () => {
        expect(addToPlaylistModalMock).toHaveBeenCalledWith(track.id, 1);
      });
    });

    describe('when the AlbumTracksList component emits the addToQueue event', () => {
      beforeEach(() => {
        wrapper.findComponent(AlbumTracksList).vm.$emit('addToQueue', track);
      });

      it('calls the addTrackToQueue function with correct parameters', () => {
        expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the AlbumTracksList component emits the downloadMedia event', () => {
      beforeEach(() => {
        wrapper.findComponent(AlbumTracksList).vm.$emit('downloadMedia', track);
      });

      it('calls the downloadMedia function with correct parameters', () => {
        expect(downloadMediaMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the AlbumTracksList component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(AlbumTracksList)
          .vm.$emit('dragStart', track, DragEvent);
      });

      it('calls the dragStart function with correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(track, DragEvent);
      });
    });

    describe('when the AlbumTracksList component emits the mediaInformation event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(AlbumTracksList)
          .vm.$emit('mediaInformation', track);
      });

      it('calls the openTrackInformationModal function with correct parameters', () => {
        expect(openTrackInformationModalMock).toHaveBeenCalledWith(track);
      });
    });

    describe('when the AlbumTracksList component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(AlbumTracksList).vm.$emit('playTrack', 1);
      });

      it('calls the playTracks function with correct parameters', () => {
        expect(playTracksMock).toHaveBeenCalledWith(album.tracks, 0);
      });
    });
  });
});

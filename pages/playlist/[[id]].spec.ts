import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import { getFormattedPlaylistsMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import PlaylistPage from './[[id]].vue';

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

const openTrackInformationModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaInformation', (original) => () => ({
  ...original(),
  openTrackInformationModal: openTrackInformationModalMock,
}));

const {
  addToPlaylistModalMock,
  deletePlaylistMock,
  loadPlaylistTracksByIdMock,
  removeFromPlaylistMock,
  reorderPlaylistTracksMock,
  updatePlaylistModalMock,
} = vi.hoisted(() => ({
  addToPlaylistModalMock: vi.fn(),
  deletePlaylistMock: vi.fn(),
  loadPlaylistTracksByIdMock: vi.fn(),
  removeFromPlaylistMock: vi.fn(),
  reorderPlaylistTracksMock: vi.fn(),
  updatePlaylistModalMock: vi.fn(),
}));
const playlistMock = ref<null | Playlist>(null);

mockNuxtImport('usePlaylist', (original) => () => ({
  ...original(),
  addToPlaylistModal: addToPlaylistModalMock,
  deletePlaylist: deletePlaylistMock,
  loadPlaylistTracksById: loadPlaylistTracksByIdMock,
  playlist: playlistMock,
  removeFromPlaylist: removeFromPlaylistMock,
  reorderPlaylistTracks: reorderPlaylistTracksMock,
  updatePlaylistModal: updatePlaylistModalMock,
}));

const dragStartMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  dragStart: dragStartMock,
}));

const refreshMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useAsyncData', () => () => ({
  data: ref([]),
  error: ref(null),
  pending: ref(false),
  refresh: refreshMock,
  status: ref('success'),
}));

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const { useHeadTitleMock } = useHeadMock();
const {
  addTracksToQueueMock,
  addTrackToQueueMock,
  playTracksMock,
  shuffleTracksMock,
} = useAudioPlayerMock();

const track = getFormattedPlaylistsMock()[0].tracks[0];

async function factory(props = {}, route = '/playlist/0') {
  return mountSuspended(PlaylistPage, {
    global: {
      stubs: {
        MixedTracksList: true,
      },
    },
    props: {
      ...props,
    },
    route,
  });
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

  describe('when loadPlaylistTracksById does not return any data', () => {
    beforeEach(async () => {
      playlistMock.value = null;
      wrapper = await factory();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('Playlist');
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });

    it('does not show the playlist content', () => {
      expect(wrapper.find({ ref: 'playlistContent' }).exists()).toBe(false);
    });
  });

  describe('when loadPlaylistTracksById does return data', () => {
    beforeEach(async () => {
      playlistMock.value = getFormattedPlaylistsMock()[0];
      wrapper = await factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('playlist-0 - Playlist');
    });

    it('shows the playlist content', () => {
      expect(wrapper.find({ ref: 'playlistContent' }).exists()).toBe(true);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when playlist.trackCount is 1', () => {
      it('shows the correct track count text', () => {
        expect(wrapper.find({ ref: 'trackCount' }).text()).toBe('1 Track');
      });
    });

    describe('when playlist.trackCount is greater than 1', () => {
      beforeEach(async () => {
        playlistMock.value = getFormattedPlaylistsMock(1, {
          trackCount: 5,
        })[0];

        wrapper = await factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct track count text', () => {
        expect(wrapper.find({ ref: 'trackCount' }).text()).toBe('5 Tracks');
      });
    });

    describe('when the update playlist DropdownItem component emits a click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ ref: 'updatePlaylistDropdownItem' })
          .vm.$emit('click');
      });

      it('calls the updatePlaylistModal function with correct parameters', () => {
        expect(updatePlaylistModalMock).toHaveBeenCalledWith(
          playlistMock.value,
        );
      });
    });

    describe('when the delete playlist DropdownItem component emits a click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ ref: 'deletePlaylistDropdownItem' })
          .vm.$emit('click');
      });

      it('calls the deletePlaylist function with correct parameters', () => {
        expect(deletePlaylistMock).toHaveBeenCalledWith('0');
      });

      it('calls the navigateTo function with correct parameters', () => {
        expect(navigateToMock).toHaveBeenCalledWith({
          name: ROUTE_NAMES.playlists,
        });
      });
    });

    describe('when playlist tracks is an empty array', () => {
      beforeEach(async () => {
        playlistMock.value = getFormattedPlaylistsMock(1, {
          tracks: [],
        })[0];

        wrapper = await factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct disabled prop on the play tracks ButtonLink component', () => {
        expect(
          wrapper.findComponent({ ref: 'playTracksButton' }).props('disabled'),
        ).toBe(true);
      });

      it('sets the correct disabled prop on the shuffle track ButtonLink component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'shuffleTracksButton' })
            .props('disabled'),
        ).toBe(true);
      });

      it('does not show the add to queue DropdownItem component', () => {
        expect(
          wrapper.findComponent({ ref: 'addToQueueDropdownItem' }).exists(),
        ).toBe(false);
      });

      it('does not show the play tracks DropdownItem component', () => {
        expect(
          wrapper.findComponent({ ref: 'playTracksDropdownItem' }).exists(),
        ).toBe(false);
      });
    });

    describe('when playlist tracks is not an empty array', () => {
      it('sets the correct disabled prop on the play tracks ButtonLink component', () => {
        expect(
          wrapper.findComponent({ ref: 'playTracksButton' }).props('disabled'),
        ).toBe(false);
      });

      it('sets the correct disabled prop on the shuffle track ButtonLink component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'shuffleTracksButton' })
            .props('disabled'),
        ).toBe(false);
      });

      it('shows the add to queue DropdownItem component', () => {
        expect(
          wrapper.findComponent({ ref: 'addToQueueDropdownItem' }).exists(),
        ).toBe(true);
      });

      it('shows the play tracks DropdownItem component', () => {
        expect(
          wrapper.findComponent({ ref: 'playTracksDropdownItem' }).exists(),
        ).toBe(true);
      });

      describe('when the play tracks ButtonLink component emits a click event', () => {
        beforeEach(async () => {
          await wrapper
            .findComponent({ ref: 'playTracksButton' })
            .trigger('click');
        });

        it('calls the playTracks function with correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(
            playlistMock.value!.tracks,
          );
        });
      });

      describe('when the shuffle tracks ButtonLink component emits a click event', () => {
        beforeEach(async () => {
          await wrapper
            .findComponent({ ref: 'shuffleTracksButton' })
            .trigger('click');
        });

        it('calls the playTracksShuffled function with correct parameters', () => {
          expect(shuffleTracksMock).toHaveBeenCalledWith(
            playlistMock.value!.tracks,
          );
        });
      });

      describe('when the add to queue DropdownItem component emits a click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'addToQueueDropdownItem' })
            .vm.$emit('click');
        });

        it('calls the addTracksToQueue function with correct parameters', () => {
          expect(addTracksToQueueMock).toHaveBeenCalledWith(
            playlistMock.value!.tracks,
          );
        });
      });

      describe('when the play tracks DropdownItem component emits a click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'playTracksDropdownItem' })
            .vm.$emit('click');
        });

        it('calls the playTracks function with correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(
            playlistMock.value!.tracks,
          );
        });
      });
    });

    describe(`when playlist.id is not equal to ${RANDOM_PLAYLIST.id}`, () => {
      it('shows the none random MixedTracksList component', () => {
        expect(wrapper.findComponent({ ref: 'mixedTracksList' }).exists()).toBe(
          true,
        );
      });

      it('does not show the random MixedTracksList component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'mixedTracksListRandomPlaylist' })
            .exists(),
        ).toBe(false);
      });

      describe('when the none random MixedTracksList component emits the addToPlaylist event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksList' })
            .vm.$emit('addToPlaylist', track);
        });

        it('calls the addToPlaylistModal function with the correct parameters', () => {
          expect(addToPlaylistModalMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the none random MixedTracksList component emits the addToQueue event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksList' })
            .vm.$emit('addToQueue', track);
        });

        it('calls the addTrackToQueue function with the correct parameters', () => {
          expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the none random MixedTracksList component emits the downloadMedia event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksList' })
            .vm.$emit('downloadMedia', track);
        });

        it('calls the downloadTrack function with the correct parameters', () => {
          expect(downloadTrackMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the none random MixedTracksList component emits the dragStart event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksList' })
            .vm.$emit('dragStart', track);
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the none random MixedTracksList component emits the mediaInformation event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksList' })
            .vm.$emit('mediaInformation', track);
        });

        it('calls the openTrackInformationModal function with the correct parameters', () => {
          expect(openTrackInformationModalMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the none random MixedTracksList component emits the playTrack event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksList' })
            .vm.$emit('playTrack', 1);
        });

        it('calls the playTracks function with the correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(
            playlistMock.value!.tracks,
            1,
          );
        });
      });

      describe('when the none random MixedTracksList component emits the remove event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'mixedTracksList' }).vm.$emit('remove', {
            index: 1,
          });
        });

        it('calls the removeFromPlaylist function with correct parameters', () => {
          expect(removeFromPlaylistMock).toHaveBeenCalledWith({
            playlistId: '0',
            songIndexToRemove: 1,
          });
        });
      });

      describe('when the none random MixedTracksList component emits the sortList event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksList' })
            .vm.$emit('sortList', 1, 2);
        });

        it('calls the reorderPlaylistTracks function with correct parameters', () => {
          expect(reorderPlaylistTracksMock).toHaveBeenCalledWith('0', 1, 2);
        });
      });
    });

    describe(`when playlist.id is equal to ${RANDOM_PLAYLIST.id}`, () => {
      beforeEach(async () => {
        playlistMock.value = {
          ...getFormattedPlaylistsMock()[0],
          id: RANDOM_PLAYLIST.id,
        };

        wrapper = await factory();
      });

      it('shows the random MixedTracksList component', () => {
        expect(
          wrapper
            .findComponent({ ref: 'mixedTracksListRandomPlaylist' })
            .exists(),
        ).toBe(true);
      });

      it('does not show the none random MixedTracksList component', () => {
        expect(wrapper.findComponent({ ref: 'mixedTracksList' }).exists()).toBe(
          false,
        );
      });

      describe('when the random MixedTracksList component emits the addToPlaylist event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksListRandomPlaylist' })
            .vm.$emit('addToPlaylist', track);
        });

        it('calls the addToPlaylistModal function with the correct parameters', () => {
          expect(addToPlaylistModalMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the random MixedTracksList component emits the addToQueue event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksListRandomPlaylist' })
            .vm.$emit('addToQueue', track);
        });

        it('calls the addTrackToQueue function with the correct parameters', () => {
          expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the random MixedTracksList component emits the downloadMedia event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksListRandomPlaylist' })
            .vm.$emit('downloadMedia', track);
        });

        it('calls the downloadTrack function with the correct parameters', () => {
          expect(downloadTrackMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the random MixedTracksList component emits the dragStart event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksListRandomPlaylist' })
            .vm.$emit('dragStart', track);
        });

        it('calls the dragStart function with the correct parameters', () => {
          expect(dragStartMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the random MixedTracksList component emits the mediaInformation event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksListRandomPlaylist' })
            .vm.$emit('mediaInformation', track);
        });

        it('calls the openTrackInformationModal function with the correct parameters', () => {
          expect(openTrackInformationModalMock).toHaveBeenCalledWith(track);
        });
      });

      describe('when the random MixedTracksList component emits the playTrack event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'mixedTracksListRandomPlaylist' })
            .vm.$emit('playTrack', 1);
        });

        it('calls the playTracks function with the correct parameters', () => {
          expect(playTracksMock).toHaveBeenCalledWith(
            playlistMock.value!.tracks,
            1,
          );
        });
      });
    });

    describe('when the EntryHeader component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper.findComponent(EntryHeader).vm.$emit('dragStart', DragEvent);
      });

      it('calls the dragStart function with correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(
          playlistMock.value,
          DragEvent,
        );
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
});

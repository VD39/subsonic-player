import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import MixedTracksList from '@/components/Organisms/TrackLists/MixedTracksList.vue';
import { getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import QueuePage from './queue.vue';

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

const refreshMock = vi.fn();

mockNuxtImport('useAsyncData', () => () => ({
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const {
  clearQueueMock,
  playTrackFromQueueListMock,
  queueListMock,
  removeTrackFromQueueListMock,
} = useAudioPlayerMock();

const queueTrack = getFormattedTracksMock()[0];

function factory(props = {}) {
  return mount(QueuePage, {
    props: {
      ...props,
    },
  });
}

describe('queue', () => {
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
    expect(useHeadTitleMock.value).toBe('Queue');
  });

  describe('when the ButtonLink is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'clearQueueButton' }).vm.$emit('click');
    });

    it('calls the clearQueue function with the correct parameters', () => {
      expect(clearQueueMock).toHaveBeenCalled();
    });
  });

  describe('when queueList is an empty array', () => {
    beforeEach(() => {
      queueListMock.value = [];
    });

    it('displays zero queue count in the title', () => {
      expect(wrapper.find({ ref: 'title' }).text()).toBe('Queue (0)');
    });
  });

  describe('when queueList is not an empty array', () => {
    beforeEach(() => {
      queueListMock.value = getFormattedTracksMock(2);
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('displays the correct queue count in the title', () => {
      expect(wrapper.find({ ref: 'title' }).text()).toBe('Queue (2)');
    });
  });

  describe('when the MixedTracksList component emits the addToPlaylist event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(MixedTracksList)
        .vm.$emit('addToPlaylist', queueTrack.id, 1);
    });

    it('calls the addToPlaylistModal function with the correct parameters', () => {
      expect(addToPlaylistModalMock).toHaveBeenCalledWith(queueTrack.id, 1);
    });
  });

  describe('when the MixedTracksList component emits the downloadMedia event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(MixedTracksList)
        .vm.$emit('downloadMedia', queueTrack);
    });

    it('calls the downloadMedia function with the correct parameters', () => {
      expect(downloadMediaMock).toHaveBeenCalledWith(queueTrack);
    });
  });

  describe('when the MixedTracksList component emits the dragStart event', () => {
    beforeEach(() => {
      wrapper.findComponent(MixedTracksList).vm.$emit('dragStart', queueTrack);
    });

    it('calls the dragStart function with the correct parameters', () => {
      expect(dragStartMock).toHaveBeenCalledWith(queueTrack);
    });
  });

  describe('when the MixedTracksList component emits the mediaInformation event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(MixedTracksList)
        .vm.$emit('mediaInformation', queueTrack);
    });

    it('calls the openTrackInformationModal function with the correct parameters', () => {
      expect(openTrackInformationModalMock).toHaveBeenCalledWith(queueTrack);
    });
  });

  describe('when the MixedTracksList component emits the playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(MixedTracksList).vm.$emit('playTrack', queueTrack);
    });

    it('calls the playTrackFromQueueList function with the correct parameters', () => {
      expect(playTrackFromQueueListMock).toHaveBeenCalledWith(queueTrack);
    });
  });

  describe('when the MixedTracksList component emits the remove event', () => {
    beforeEach(() => {
      wrapper.findComponent(MixedTracksList).vm.$emit('remove', {
        id: queueTrack.id,
      });
    });

    it('calls the removeTrackFromQueueList function with the correct parameters', () => {
      expect(removeTrackFromQueueListMock).toHaveBeenCalledWith(queueTrack.id);
    });
  });
});

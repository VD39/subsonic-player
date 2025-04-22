import type { VueWrapper } from '@vue/test-utils';

import MixedTracksList from '@/components/Organisms/TrackLists/MixedTracksList.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import QueueList from './QueueList.vue';

const toggleQueueListMock = vi.fn();

mockNuxtImport('useQueue', () => () => ({
  toggleQueueList: toggleQueueListMock,
}));

const {
  clearQueueListMock,
  playTrackFromQueueListMock,
  removeTrackFromQueueListMock,
} = useAudioPlayerMock();

function factory(props = {}) {
  return mount(QueueList, {
    props: {
      ...props,
    },
  });
}

describe('QueueList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the MixedTracksList component', () => {
    expect(wrapper.findComponent(MixedTracksList).exists()).toBe(true);
  });

  describe('when MixedTracksList component emits a playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(MixedTracksList).vm.$emit('playTrack');
    });

    it('calls the playTrackFromQueueList function', () => {
      expect(playTrackFromQueueListMock).toHaveBeenCalled();
    });
  });

  describe('when MixedTracksList component emits a remove event', () => {
    beforeEach(() => {
      wrapper.findComponent(MixedTracksList).vm.$emit('remove', {
        id: 'id',
      });
    });

    it('calls the removeTrackFromQueueList function', () => {
      expect(removeTrackFromQueueListMock).toHaveBeenCalledWith('id');
    });
  });

  describe('when the close queue list ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'closeQueueList' }).vm.$emit('click');
    });

    it('calls the toggleQueueList function', () => {
      expect(toggleQueueListMock).toHaveBeenCalled();
    });
  });

  describe('when the clear queue ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'clearQueue' }).vm.$emit('click');
    });

    it('calls the clearQueueList function', () => {
      expect(clearQueueListMock).toHaveBeenCalled();
    });
  });
});

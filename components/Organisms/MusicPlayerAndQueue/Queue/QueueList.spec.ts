import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import MixedTracksList from '@/components/Organisms/TrackLists/MixedTracksList.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useQueueMock } from '@/test/useQueueMock';

import QueueList from './QueueList.vue';

const {
  playFromQueueMock,
  removeFromQueueMock,
  reorderQueueTrackMock,
  resetPlayerMock,
} = useAudioPlayerMock();
const { resetQueueMock, toggleQueueListMock } = useQueueMock();

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

  describe('when the MixedTracksList component emits a playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(MixedTracksList).vm.$emit('playTrack');
    });

    it('calls the playFromQueue function', () => {
      expect(playFromQueueMock).toHaveBeenCalled();
    });
  });

  describe('when the MixedTracksList component emits a remove event', () => {
    beforeEach(() => {
      wrapper.findComponent(MixedTracksList).vm.$emit('remove', {
        id: 'id',
      });
    });

    it('calls the removeFromQueue function with the correct parameters', () => {
      expect(removeFromQueueMock).toHaveBeenCalledWith('id');
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
      wrapper.findComponent({ ref: 'clearQueueButton' }).vm.$emit('click');
    });

    it('calls the resetPlayer function', () => {
      expect(resetPlayerMock).toHaveBeenCalled();
    });

    it('calls the resetQueue function', () => {
      expect(resetQueueMock).toHaveBeenCalled();
    });
  });

  describe('when the MixedTracksList component emits a sortList event', () => {
    beforeEach(() => {
      wrapper.findComponent(MixedTracksList).vm.$emit('sortList', 0, 2);
    });

    it('calls the reorderQueueTrack function with the correct parameters', () => {
      expect(reorderQueueTrackMock).toHaveBeenCalledWith(0, 2);
    });
  });
});

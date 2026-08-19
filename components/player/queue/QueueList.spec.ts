import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import TracklistMixed from '@/components/tracklist/TracklistMixed.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useQueueMock } from '@/test/useQueueMock';

import QueueList from './QueueList.vue';

const {
  playFromQueueMock,
  removeFromQueueMock,
  reorderQueueTrackMock,
  resetPlayerSessionMock,
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

  it('shows the TracklistMixed component', () => {
    expect(wrapper.findComponent(TracklistMixed).exists()).toBe(true);
  });

  describe('when the TracklistMixed component emits a playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(TracklistMixed).vm.$emit('playTrack');
    });

    it('calls the playFromQueue function', () => {
      expect(playFromQueueMock).toHaveBeenCalled();
    });
  });

  describe('when the TracklistMixed component emits a remove event', () => {
    beforeEach(() => {
      wrapper.findComponent(TracklistMixed).vm.$emit('remove', {
        index: 0,
      });
    });

    it('calls the removeFromQueue function with the correct parameters', () => {
      expect(removeFromQueueMock).toHaveBeenCalledWith(0);
    });
  });

  describe('when the close queue list ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ ref: 'closeQueueList' }).trigger('click');
    });

    it('calls the toggleQueueList function', () => {
      expect(toggleQueueListMock).toHaveBeenCalled();
    });
  });

  describe('when the clear queue ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ ref: 'clearQueueButton' }).trigger('click');
    });

    it('calls the resetPlayerSession function', () => {
      expect(resetPlayerSessionMock).toHaveBeenCalled();
    });

    it('calls the resetQueue function', () => {
      expect(resetQueueMock).toHaveBeenCalled();
    });
  });

  describe('when the TracklistMixed component emits a sortList event', () => {
    beforeEach(() => {
      wrapper.findComponent(TracklistMixed).vm.$emit('sortList', 0, 2);
    });

    it('calls the reorderQueueTrack function with the correct parameters', () => {
      expect(reorderQueueTrackMock).toHaveBeenCalledWith(0, 2);
    });
  });
});

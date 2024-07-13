import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import QueueList from './QueueList.vue';
import QueueMenu from './QueueMenu.vue';

const queueTrackMock = getFormattedQueueTracksMock();

const {
  clearQueueListMock,
  playCurrentTrackMock,
  removeTrackFromQueueListMock,
} = useAudioPlayerMock();

function factory(props = {}) {
  return mount(QueueMenu, {
    props: {
      ...props,
    },
  });
}

describe('QueueMenu', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct length queue length in title', () => {
    expect(wrapper.find({ ref: 'title' }).text()).toBe('Queue (1)');
  });

  describe('when the clear button is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'clear' }).vm.$emit('click');
    });

    it('emits the close event', () => {
      expect(wrapper.emitted('close')).toEqual([[]]);
    });

    it('calls the clearQueueList function', () => {
      expect(clearQueueListMock).toHaveBeenCalled();
    });
  });

  describe('when the close button is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'close' }).vm.$emit('click');
    });

    it('emits the close event', () => {
      expect(wrapper.emitted('close')).toEqual([[]]);
    });
  });

  describe('when the QueueList emits a play current track event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(QueueList)
        .vm.$emit('playCurrentTrack', queueTrackMock);
    });

    it('calls the playCurrentTrack function', () => {
      expect(playCurrentTrackMock).toHaveBeenCalledWith(queueTrackMock);
    });
  });

  describe('when the QueueList emits a remove item event', () => {
    beforeEach(() => {
      wrapper.findComponent(QueueList).vm.$emit('removeItem', 'id');
    });

    it('calls the removeTrackFromQueueList function', () => {
      expect(removeTrackFromQueueListMock).toHaveBeenCalledWith('id');
    });
  });
});

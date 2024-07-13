import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import IconButton from '@/components/Buttons/IconButton.vue';
import TrackDetails from './TrackDetail.vue';
import QueueList from './QueueList.vue';

const queueTrackMock = getFormattedQueueTracksMock(2);

function factory(props = {}) {
  return mount(QueueList, {
    props: {
      currentTrackId: 'queue-track-0',
      isCurrentTrackPlaying: false,
      trackCanPlay: false,
      tracks: queueTrackMock,
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

  it('shows the correct amount of track items', () => {
    expect(wrapper.findAll('[data-test-id="track-list-item"]').length).toBe(2);
  });

  describe('when track is not a current track', () => {
    it('adds the current class to list item', () => {
      expect(
        wrapper.findAll('[data-test-id="track-list-item"]')[0].classes(),
      ).toContain('current');
    });
  });

  describe('when track is a current track', () => {
    it('does not add the current class to list item', () => {
      expect(
        wrapper.findAll('[data-test-id="track-list-item"]')[1].classes(),
      ).not.toContain('current');
    });
  });

  describe('when the TrackDetails emits a play current track event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(TrackDetails)
        .vm.$emit('playCurrentTrack', 'queue-track-0');
    });

    it('emits playCurrentTrack event with track values', () => {
      expect(wrapper.emitted('playCurrentTrack')).toEqual([
        [queueTrackMock[0]],
      ]);
    });
  });

  describe('when remove item from queue button is clicked', () => {
    beforeEach(() => {
      wrapper.findAllComponents(IconButton)[1].vm.$emit('click');
    });

    it('emits the removeItem event', () => {
      expect(wrapper.emitted('removeItem')).toEqual([['queue-track-0']]);
    });
  });
});

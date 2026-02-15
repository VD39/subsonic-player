import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import TracksListItem from '@/components/Organisms/TrackLists/TracksListItem.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import TracksList from './TracksList.vue';

const tracks = getFormattedTracksMock(5);
const track = tracks[0];

function factory(props = {}) {
  return mount(TracksList, {
    props: {
      tracks,
      ...props,
    },
  });
}

describe('TracksList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when tracks prop is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        tracks: [],
      });
    });

    it('does not show the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when tracks prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of track items', () => {
      expect(wrapper.findAllComponents(TracksListItem).length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe.each([
      ['addToPlaylist', [track.id]],
      ['mediaInformation', [track]],
      ['downloadMedia', [track]],
      ['addToQueue', [track]],
      ['playTrack', [0]],
    ])(
      'when the TracksListItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(async () => {
          wrapper.findComponent(TracksListItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );

    describe('when the TracksListItem component emits the dragStart event', () => {
      beforeEach(async () => {
        wrapper
          .findComponent(TracksListItem)
          .vm.$emit('dragStart', new DragEvent('dragstart'));
      });

      it('emits the dragStart event with the correct value', () => {
        expect(wrapper.emitted('dragStart')).toEqual([
          [track, expect.any(DragEvent)],
        ]);
      });
    });
  });
});

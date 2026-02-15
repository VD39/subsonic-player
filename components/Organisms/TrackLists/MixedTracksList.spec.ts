import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import MixedTracksListItem from '@/components/Organisms/TrackLists/MixedTracksListItem.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import MixedTracksList from './MixedTracksList.vue';

let onAddToQueueMock: typeof vi.fn | undefined = undefined;
let onDragStartMock: typeof vi.fn | undefined = undefined;

vi.mock('vue', async () => {
  const vue = await vi.importActual<typeof import('vue')>('vue');

  return {
    ...vue,
    getCurrentInstance: vi.fn(() => ({
      ...vue.getCurrentInstance(),
      vnode: {
        props: {
          onAddToQueue: onAddToQueueMock,
          onDragStart: onDragStartMock,
        },
      },
    })),
  };
});

const tracks = getFormattedTracksMock(5);
const track = tracks[0];

function factory(props = {}) {
  return mount(MixedTracksList, {
    props: {
      tracks,
      ...props,
    },
  });
}

describe('MixedTracksList', () => {
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
      expect(wrapper.findAllComponents(MixedTracksListItem).length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when hideRemoveOption prop is false', () => {
      it('shows the track options element in track header', () => {
        expect(wrapper.find({ ref: 'trackRemoveHeader' }).exists()).toBe(true);
      });
    });

    describe('when hideRemoveOption prop is true', () => {
      beforeEach(() => {
        wrapper = factory({
          hideRemoveOption: true,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the track options element in track header', () => {
        expect(wrapper.find({ ref: 'trackRemoveHeader' }).exists()).toBe(false);
      });
    });

    describe.each([
      ['addToPlaylist', [track.id, 0]],
      ['mediaInformation', [track]],
      ['downloadMedia', [track]],
      ['playTrack', [0]],
      ['remove', [{ id: track.id, index: 0 }]],
    ])(
      'when the MixedTracksListItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(async () => {
          wrapper.findComponent(MixedTracksListItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );

    describe('when the onAddToQueue event is not attached', () => {
      it('passes false for hasAddToQueueEvent prop', () => {
        expect(
          wrapper
            .findComponent(MixedTracksListItem)
            .props('hasAddToQueueEvent'),
        ).toBe(false);
      });
    });

    describe('when the onAddToQueue event is attached', () => {
      beforeEach(() => {
        onAddToQueueMock = vi.fn();
        wrapper = factory();
      });

      it('passes true for hasAddToQueueEvent prop', () => {
        expect(
          wrapper
            .findComponent(MixedTracksListItem)
            .props('hasAddToQueueEvent'),
        ).toBe(true);
      });

      describe('when the MixedTracksListItem component emits the addToQueue event', () => {
        beforeEach(async () => {
          wrapper.findComponent(MixedTracksListItem).vm.$emit('addToQueue');
        });

        it('emits the addToQueue event with the correct value', () => {
          expect(wrapper.emitted('addToQueue')).toEqual([[track]]);
        });
      });
    });

    describe('when the onDragStart event is not attached', () => {
      it('passes false for hasDragStartEvent prop', () => {
        expect(
          wrapper.findComponent(MixedTracksListItem).props('hasDragStartEvent'),
        ).toBe(false);
      });
    });

    describe('when the onDragStart event is attached', () => {
      beforeEach(() => {
        onDragStartMock = vi.fn();
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('passes true for hasDragStartEvent prop', () => {
        expect(
          wrapper.findComponent(MixedTracksListItem).props('hasDragStartEvent'),
        ).toBe(true);
      });

      describe('when the MixedTracksListItem component emits the dragStart event', () => {
        beforeEach(async () => {
          wrapper
            .findComponent(MixedTracksListItem)
            .vm.$emit('dragStart', DragEvent);
        });

        it('emits the dragStart event with the correct value', () => {
          expect(wrapper.emitted('dragStart')).toEqual([[track, DragEvent]]);
        });
      });
    });
  });
});

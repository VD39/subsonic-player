import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistMixedItem from '@/components/tracklist/TracklistMixedItem.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import TracklistMixed from './TracklistMixed.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

let onReorderMock: SortableListOptions['onReorder'];

mockNuxtImport('useSortableList', () => (options: SortableListOptions) => {
  onReorderMock = options.onReorder;
});

const tracks = getFormattedTracksMock(5);
const track = tracks[0];

let onAddToQueueMock:
  ((track: globalThis.PlayableTrack) => unknown) | undefined;
let onDragStartMock:
  ((track: globalThis.PlayableTrack, event: DragEvent) => unknown) | undefined;
let onRemoveMock:
  ((removeArgs: { id: string; index: number }) => unknown) | undefined;
let onSortListMock:
  ((fromIndex: number, toIndex: number) => unknown) | undefined;

function factory(props = {}) {
  return mount(TracklistMixed, {
    props: {
      onAddToQueue: onAddToQueueMock,
      onDragStart: onDragStartMock,
      onRemove: onRemoveMock,
      onSortList: onSortListMock,
      tracks,
      ...props,
    },
  });
}

describe('TracklistMixed', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the tracks prop is an empty array', () => {
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

  describe('when the tracks prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of track items', () => {
      expect(wrapper.findAllComponents(TracklistMixedItem)).toHaveLength(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe.each([
      ['addToPlaylist', [track.id, 0]],
      ['mediaInformation', [track]],
      ['downloadMedia', [track]],
      ['playTrack', [0]],
      ['remove', [{ id: track.id, index: 0 }]],
    ])(
      'when the TracklistMixedItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(() => {
          wrapper.findComponent(TracklistMixedItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );

    describe('when the onAddToQueue event is not attached', () => {
      it('passes false for isAddToQueueVisible prop', () => {
        expect(
          wrapper
            .findComponent(TracklistMixedItem)
            .props('isAddToQueueVisible'),
        ).toBe(false);
      });

      it('does not show the add to queue header element', () => {
        expect(wrapper.find({ ref: 'trackAddToQueueHeader' }).exists()).toBe(
          false,
        );
      });
    });

    describe('when the onAddToQueue event is attached', () => {
      beforeEach(() => {
        onAddToQueueMock = vi.fn();
        wrapper = factory();
      });

      it('passes true for isAddToQueueVisible prop', () => {
        expect(
          wrapper
            .findComponent(TracklistMixedItem)
            .props('isAddToQueueVisible'),
        ).toBe(true);
      });

      it('shows the add to queue header element', () => {
        expect(wrapper.find({ ref: 'trackAddToQueueHeader' }).exists()).toBe(
          true,
        );
      });
    });

    describe('when the onDragStart event is not attached', () => {
      it('passes false for isDraggable prop', () => {
        expect(
          wrapper.findComponent(TracklistMixedItem).props('isDraggable'),
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

      it('passes true for isDraggable prop', () => {
        expect(
          wrapper.findComponent(TracklistMixedItem).props('isDraggable'),
        ).toBe(true);
      });
    });

    describe('when the onRemove event is not attached', () => {
      it('passes false for isRemovable prop', () => {
        expect(
          wrapper.findComponent(TracklistMixedItem).props('isRemovable'),
        ).toBe(false);
      });

      it('does not show the remove header element', () => {
        expect(wrapper.find({ ref: 'trackRemoveHeader' }).exists()).toBe(false);
      });
    });

    describe('when the onRemove event is attached', () => {
      beforeEach(() => {
        onRemoveMock = vi.fn();
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('passes true for isRemovable prop', () => {
        expect(
          wrapper.findComponent(TracklistMixedItem).props('isRemovable'),
        ).toBe(true);
      });

      it('shows the remove header element', () => {
        expect(wrapper.find({ ref: 'trackRemoveHeader' }).exists()).toBe(true);
      });
    });

    describe('when the onSortList event is not attached', () => {
      it('passes false for isSortable prop', () => {
        expect(
          wrapper.findComponent(TracklistMixedItem).props('isSortable'),
        ).toBe(false);
      });

      it('does not show the sort list header element', () => {
        expect(wrapper.find({ ref: 'trackSortListHeader' }).exists()).toBe(
          false,
        );
      });

      describe('when the useSortableList onReorder function is called', () => {
        beforeEach(() => {
          onReorderMock?.(1, 3);
        });

        it('does not emit the sortList event', () => {
          expect(wrapper.emitted('sortList')).toBeUndefined();
        });
      });
    });

    describe('when the onSortList event is attached', () => {
      beforeEach(() => {
        onSortListMock = vi.fn();
        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('passes true for isSortable prop', () => {
        expect(
          wrapper.findComponent(TracklistMixedItem).props('isSortable'),
        ).toBe(true);
      });

      describe('when the useSortableList onReorder function is called', () => {
        beforeEach(() => {
          onReorderMock?.(1, 3);
        });

        it('emits the sortList event with the correct parameters', () => {
          expect(wrapper.emitted('sortList')).toEqual([[1, 3]]);
        });
      });
    });
  });
});

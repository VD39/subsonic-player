import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistBookmarkItem from '@/components/tracklist/TracklistBookmarkItem.vue';
import { getFormattedBookmarksMock } from '@/test/helpers';

import TracklistBookmark from './TracklistBookmark.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const bookmarks = getFormattedBookmarksMock(5);
const bookmark = bookmarks[0];

function factory(props = {}) {
  return mount(TracklistBookmark, {
    props: {
      bookmarks,
      ...props,
    },
  });
}

describe('TracklistBookmark', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the bookmarks prop is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        bookmarks: [],
      });
    });

    it('does not show the bookmarks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when the bookmarks prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the bookmarks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of bookmark items', () => {
      expect(wrapper.findAllComponents(TracklistBookmarkItem)).toHaveLength(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe.each([
      ['addToPlaylist', [bookmark.id]],
      ['addToQueue', [bookmark]],
      ['dragStart', [bookmark, undefined]],
      ['mediaInformation', [bookmark]],
      ['downloadMedia', [bookmark]],
      ['playTrack', [0]],
      ['remove', [bookmark.id]],
    ])(
      'when the TracklistBookmarkItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(() => {
          wrapper.findComponent(TracklistBookmarkItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );
  });
});

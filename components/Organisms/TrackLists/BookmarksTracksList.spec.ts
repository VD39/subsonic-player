import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import BookmarksTracksListItem from '@/components/Organisms/TrackLists/BookmarksTracksListItem.vue';
import { getFormattedBookmarksMock } from '@/test/helpers';

import BookmarksTracksList from './BookmarksTracksList.vue';

const bookmarks = getFormattedBookmarksMock(5);
const bookmark = bookmarks[0];

function factory(props = {}) {
  return mount(BookmarksTracksList, {
    props: {
      bookmarks,
      ...props,
    },
  });
}

describe('BookmarksTracksList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when bookmarks prop is an empty array', () => {
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

  describe('when bookmarks prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the bookmarks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of bookmark items', () => {
      expect(wrapper.findAllComponents(BookmarksTracksListItem).length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe.each([
      ['addToPlaylist', [bookmark.id]],
      ['mediaInformation', [bookmark]],
      ['downloadMedia', [bookmark]],
      ['playTrack', [0]],
      ['remove', [bookmark.id]],
    ])(
      'when the BookmarksTracksListItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(async () => {
          wrapper.findComponent(BookmarksTracksListItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );
  });
});

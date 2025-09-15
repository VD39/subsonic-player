import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedBookmarksMock } from '@/test/helpers';

import BookmarksTracksList from './BookmarksTracksList.vue';

const bookmarks = getFormattedBookmarksMock(5);
const bookmark = bookmarks[0];

async function factory(props = {}) {
  const wrapper = mount(BookmarksTracksList, {
    props: {
      bookmarks,
      ...props,
    },
  });

  await wrapper.vm.$nextTick();

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
}

describe('BookmarksTracksList', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when bookmarks prop is an empty array', () => {
    beforeEach(async () => {
      wrapper = await factory({
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

    it('shows the correct number of track items', () => {
      expect(wrapper.findAll('[data-test-id="track"]').length).toBe(5);
    });

    it('does not show the NoMediaArtistsListMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when track.author is undefined', () => {
      beforeEach(async () => {
        wrapper = await factory({
          bookmarks: getFormattedBookmarksMock(1, {
            author: undefined,
          }),
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the author details', () => {
        expect(
          wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
        ).toBe(false);
      });

      it('shows the author else element', () => {
        expect(wrapper.find({ ref: 'authorsElse' }).exists()).toBe(true);
      });
    });

    describe('when track.author is defined', () => {
      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the MarqueeScroll component containing the author details', () => {
        expect(
          wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
        ).toBe(true);
      });

      it('does not show the author else element', () => {
        expect(wrapper.find({ ref: 'authorsElse' }).exists()).toBe(false);
      });
    });

    describe('when track.podcastName is undefined', () => {
      beforeEach(async () => {
        wrapper = await factory({
          bookmarks: getFormattedBookmarksMock(1, {
            podcastName: undefined,
          }),
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the podcast name', () => {
        expect(
          wrapper.findComponent({ ref: 'podcastNameMarqueeScroll' }).exists(),
        ).toBe(false);
      });

      it('shows the podcast name else element', () => {
        expect(wrapper.find({ ref: 'podcastNameElse' }).exists()).toBe(true);
      });
    });

    describe('when track.podcastName is defined', () => {
      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the MarqueeScroll component containing the podcast name', () => {
        expect(
          wrapper.findComponent({ ref: 'podcastNameMarqueeScroll' }).exists(),
        ).toBe(true);
      });

      it('does not show the podcast name else element', () => {
        expect(wrapper.find({ ref: 'podcastNameElse' }).exists()).toBe(false);
      });
    });
  });

  describe.each([
    ['remove DropdownItem', 'dropdownItemRemove', 'remove', [bookmark.id]],
    [
      'add to playlist DropdownItem',
      'addToPlaylist',
      'addToPlaylist',
      [bookmark.id],
    ],
    [
      'media information DropdownItem',
      'mediaInformation',
      'mediaInformation',
      [bookmark],
    ],
    [
      'download media DropdownItem',
      'downloadMedia',
      'downloadMedia',
      [bookmark],
    ],
    ['play track DropdownItem', 'playTrack', 'playTrack', [0]],
    ['remove ButtonLink', 'removeButton', 'remove', [bookmark.id]],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName, expectedArgs) => {
      beforeEach(async () => {
        wrapper.findComponent({ ref }).vm.$emit('click');
      });

      it(`emits the ${emitEventName} event with the correct value`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([expectedArgs]);
      });
    },
  );

  describe('when the TrackPlayPause component emits the playTrack event', () => {
    beforeEach(async () => {
      wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
    });

    it('emits the playTrack event with the correct value', () => {
      expect(wrapper.emitted('playTrack')).toEqual([[0]]);
    });
  });
});

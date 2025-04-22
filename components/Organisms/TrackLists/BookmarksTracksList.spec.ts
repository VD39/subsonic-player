import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedBookmarksMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import BookmarksTracksList from './BookmarksTracksList.vue';

const bookmarks = getFormattedBookmarksMock(5);

function factory(props = {}) {
  const wrapper = mount(BookmarksTracksList, {
    props: {
      bookmarks,
      ...props,
    },
  });

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
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

    it('shows the correct number of track items', () => {
      expect(wrapper.findAll('[data-test-id="track"]').length).toBe(5);
    });

    it('does not show the NoMediaArtistsListMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when track.author is undefined', () => {
      beforeEach(() => {
        wrapper = factory({
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
      beforeEach(() => {
        wrapper = factory({
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

  describe('when the remove DropdownItem component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'dropdownItemRemove' }).vm.$emit('click');
    });

    it('emits the remove event with track', () => {
      expect(wrapper.emitted('remove')).toEqual([[bookmarks[0].id]]);
    });
  });

  describe('when the add to playlist DropdownItem component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'addToPlaylist' }).vm.$emit('click');
    });

    it('emits the addToPlaylist event with track', () => {
      expect(wrapper.emitted('addToPlaylist')).toEqual([[bookmarks[0].id]]);
    });
  });

  describe('when the media information DropdownItem component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'mediaInformation' }).vm.$emit('click');
    });

    it('emits the mediaInformation event with track', () => {
      expect(wrapper.emitted('mediaInformation')).toEqual([[bookmarks[0]]]);
    });
  });

  describe('when the download media DropdownItem component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'downloadMedia' }).vm.$emit('click');
    });

    it('emits the downloadMedia event with track', () => {
      expect(wrapper.emitted('downloadMedia')).toEqual([[bookmarks[0].id]]);
    });
  });

  describe('when the play track DropdownItem component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'playTrack' }).vm.$emit('click');
    });

    it('emits the playTrack event with track', () => {
      expect(wrapper.emitted('playTrack')).toEqual([[0]]);
    });
  });

  describe('when the TrackPlayPause component emits the playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
    });

    it('emits the playTrack event with track', () => {
      expect(wrapper.emitted('playTrack')).toEqual([[0]]);
    });
  });

  describe('when the remove ButtonLink component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'removeButton' }).vm.$emit('click');
    });

    it('emits the remove event with track id', () => {
      expect(wrapper.emitted('remove')).toEqual([[bookmarks[0].id]]);
    });
  });
});

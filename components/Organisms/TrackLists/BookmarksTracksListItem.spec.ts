import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedBookmarksMock } from '@/test/helpers';

import BookmarksTracksListItem from './BookmarksTracksListItem.vue';

const isCurrentTrackMock = vi.fn().mockReturnValue(false);

mockNuxtImport('useAudioPlayer', () => () => ({
  isCurrentTrack: isCurrentTrackMock,
}));

const bookmark = getFormattedBookmarksMock()[0];

const openDropdownMenuMock = vi.fn();

function factory(props = {}) {
  return mount(BookmarksTracksListItem, {
    global: {
      stubs: {
        DropdownMenu: {
          methods: {
            openDropdownMenu: openDropdownMenuMock,
          },
          template: '<div><slot /></div>',
        },
        TrackPlayPause: true,
      },
    },
    props: {
      bookmark,
      ...props,
    },
  });
}

describe('BookmarksTracksListItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when bookmark.podcastName is defined', () => {
    it('shows the MarqueeScroll component containing the podcast name', () => {
      expect(
        wrapper.findComponent({ ref: 'podcastNameMarqueeScroll' }).exists(),
      ).toBe(true);
    });

    it('does not show the podcast name else element', () => {
      expect(wrapper.find({ ref: 'podcastNameElse' }).exists()).toBe(false);
    });
  });

  describe('when bookmark.podcastName is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        bookmark: getFormattedBookmarksMock(1, {
          podcastName: undefined,
        })[0],
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

  describe('when bookmark.author is defined', () => {
    it('shows the MarqueeScroll component containing the author details', () => {
      expect(
        wrapper.findComponent({ ref: 'authorMarqueeScroll' }).exists(),
      ).toBe(true);
    });

    it('does not show the author else element', () => {
      expect(wrapper.find({ ref: 'authorsElse' }).exists()).toBe(false);
    });
  });

  describe('when bookmark.author is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        bookmark: getFormattedBookmarksMock(1, { author: undefined })[0],
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

  describe('when bookmark.podcastId is defined', () => {
    it('shows the go to podcast DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'goToPodcast' }).exists()).toBe(true);
    });
  });

  describe('when bookmark.podcastId is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        bookmark: getFormattedBookmarksMock(1, {
          podcastId: undefined,
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the go to podcast DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'goToPodcast' }).exists()).toBe(
        false,
      );
    });
  });

  describe.each([
    ['add to playlist DropdownItem', 'addToPlaylist', 'addToPlaylist'],
    ['media information DropdownItem', 'mediaInformation', 'mediaInformation'],
    ['download media DropdownItem', 'downloadMedia', 'downloadMedia'],
    ['play track DropdownItem', 'playTrack', 'playTrack'],
    ['remove DropdownItem', 'dropdownItemRemove', 'remove'],
    ['remove ButtonLink', 'removeButton', 'remove'],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName) => {
      beforeEach(() => {
        wrapper.findComponent({ ref }).vm.$emit('click');
      });

      it(`emits the ${emitEventName} event`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([[]]);
      });
    },
  );

  describe('when the TrackPlayPause component emits the playTrack event', () => {
    beforeEach(async () => {
      wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
    });

    it('emits the playTrack event', () => {
      expect(wrapper.emitted('playTrack')).toEqual([[]]);
    });
  });

  describe('when the InteractionWrapper component emits the click event', () => {
    describe('when isCurrentTrack is true', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(true);
        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('does not emit the playTrack event', () => {
        expect(wrapper.emitted('playTrack')).toBeUndefined();
      });
    });

    describe('when isCurrentTrack is false', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(false);

        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('emits the playTrack event', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[]]);
      });
    });
  });

  describe('when the InteractionWrapper component emits the longPress event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('longPress');
    });

    it('calls the openDropdownMenu function', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
    });
  });

  describe('when the InteractionWrapper component emits the contextMenu event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('contextMenu');
    });

    it('calls the openDropdownMenu function', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
    });
  });
});

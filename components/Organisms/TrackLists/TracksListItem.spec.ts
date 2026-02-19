import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import TracksListItem from './TracksListItem.vue';

const isCurrentTrackMock = vi.fn().mockReturnValue(false);

mockNuxtImport('useAudioPlayer', () => () => ({
  isCurrentTrack: isCurrentTrackMock,
}));

const track = getFormattedTracksMock()[0];

const openDropdownMenuMock = vi.fn();

function factory(props = {}) {
  return mount(TracksListItem, {
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
      track,
      ...props,
    },
  });
}

describe('TracksListItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when track.album is defined', () => {
    it('shows the MarqueeScroll component containing the album details', () => {
      expect(
        wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
      ).toBe(true);
    });

    it('does not show the album else element', () => {
      expect(wrapper.find({ ref: 'albumElse' }).exists()).toBe(false);
    });
  });

  describe('when track.album is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedTracksMock(1, { album: undefined })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MarqueeScroll component containing the album details', () => {
      expect(
        wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
      ).toBe(false);
    });

    it('shows the album else element', () => {
      expect(wrapper.find({ ref: 'albumElse' }).exists()).toBe(true);
    });
  });

  describe('when track.artists is not an empty array', () => {
    it('shows the MarqueeScroll component containing the artists details', () => {
      expect(
        wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
      ).toBe(true);
    });

    it('does not show the artists else element', () => {
      expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(false);
    });
  });

  describe('when track.artists is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedTracksMock(1, { artists: [] })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MarqueeScroll component containing the artists details', () => {
      expect(
        wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
      ).toBe(false);
    });

    it('shows the artists else element', () => {
      expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(true);
    });
  });

  describe.each([
    ['add to playlist DropdownItem', 'addToPlaylist', 'addToPlaylist'],
    ['media information DropdownItem', 'mediaInformation', 'mediaInformation'],
    ['download media DropdownItem', 'downloadMedia', 'downloadMedia'],
    ['add to queue DropdownItem', 'addToQueue', 'addToQueue'],
    ['play track DropdownItem', 'playTrack', 'playTrack'],
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

  describe('when the InteractionWrapper component emits the dragStart event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(InteractionWrapper)
        .vm.$emit('dragStart', DragEvent);
    });

    it('emits the dragStart event', () => {
      expect(wrapper.emitted('dragStart')).toEqual([[DragEvent]]);
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

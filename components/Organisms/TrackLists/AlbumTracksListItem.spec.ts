import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownSubmenu from '@/components/Molecules/Dropdown/DropdownSubmenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import TrackPlayPauseDropdownItem from '@/components/Organisms/TrackPlayPauseDropdownItem.vue';
import { getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import AlbumTracksListItem from './AlbumTracksListItem.vue';

const { isCurrentTrackMock } = useAudioPlayerMock();

const track = getFormattedTracksMock()[0];

const openDropdownMenuMock = vi.fn();

function factory(props = {}) {
  return mount(AlbumTracksListItem, {
    global: {
      stubs: {
        DropdownMenu: {
          methods: {
            openDropdownMenu: openDropdownMenuMock,
          },
          template: '<div><slot /></div>',
        },
        TrackPlayPause: true,
        TrackPlayPauseDropdownItem: true,
      },
    },
    props: {
      track,
      ...props,
    },
  });
}

describe('AlbumTracksListItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when track.artists is not an empty array', () => {
    beforeEach(async () => {
      const dropdownSubMenu = wrapper.findComponent(DropdownSubmenu);

      if (dropdownSubMenu.exists()) {
        await dropdownSubMenu.trigger('mouseenter');
      }
    });

    it('shows the MarqueeScroll component containing the artists details', () => {
      expect(
        wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
      ).toBe(true);
    });

    it('shows the DropdownSubmenu component', () => {
      expect(wrapper.findComponent(DropdownSubmenu).exists()).toBe(true);
    });

    it('shows the correct number of DropdownItem components inside the DropdownSubmenu', () => {
      expect(
        wrapper.findComponent(DropdownSubmenu).findAllComponents(DropdownItem)
          .length,
      ).toBe(track.artists.length);
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

    it('does not show the DropdownSubmenu component', () => {
      expect(wrapper.findComponent(DropdownSubmenu).exists()).toBe(false);
    });
  });

  describe.each([
    ['add to queue ButtonLink', 'addToQueueButton', 'addToQueue'],
    ['add to playlist DropdownItem', 'addToPlaylist', 'addToPlaylist'],
    ['media information DropdownItem', 'mediaInformation', 'mediaInformation'],
    ['download media DropdownItem', 'downloadMedia', 'downloadMedia'],
    ['add to queue DropdownItem', 'addToQueue', 'addToQueue'],
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

  describe('when the TrackPlayPauseDropdownItem component emits the playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(TrackPlayPauseDropdownItem).vm.$emit('playTrack');
    });

    it('emits the playTrack event', () => {
      expect(wrapper.emitted('playTrack')).toEqual([[]]);
    });
  });

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

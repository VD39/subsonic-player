import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import FileListItem from './FileListItem.vue';

const isCurrentTrackMock = vi.fn().mockReturnValue(false);

mockNuxtImport('useAudioPlayer', () => () => ({
  isCurrentTrack: isCurrentTrackMock,
}));

const track = getFormattedTracksMock()[0];

const openDropdownMenuMock = vi.fn();

function factory(props = {}) {
  return mount(FileListItem, {
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

describe('FileListItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
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

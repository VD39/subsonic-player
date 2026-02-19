import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import { getFormattedAlbumsMock } from '@/test/helpers';

import AlbumItem from './AlbumItem.vue';

const album = getFormattedAlbumsMock()[0];

const openDropdownMenuMock = vi.fn();

function factory(props = {}) {
  return mount(AlbumItem, {
    global: {
      stubs: {
        DropdownMenu: {
          methods: {
            openDropdownMenu: openDropdownMenuMock,
          },
          template: '<div><slot /></div>',
        },
      },
    },
    props: {
      album,
      ...props,
    },
  });
}

describe('AlbumItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when album artists is not an empty array', () => {
    describe('when the hideArtist prop is false', () => {
      it('shows the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
      });
    });

    describe('when the hideArtist prop is true', () => {
      beforeEach(() => {
        wrapper = factory({
          hideArtist: true,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
      });
    });
  });

  describe('when album artists is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        album: getFormattedAlbumsMock(1, {
          artists: [],
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the ArtistsList component', () => {
      expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
    });
  });

  describe.each([
    ['play album ButtonLink', 'playAlbumButtonLink', 'playAlbum'],
    ['play album DropdownItem', 'playAlbum', 'playAlbum'],
    ['add to queue DropdownItem', 'addToQueue', 'addToQueue'],
    ['media information DropdownItem', 'mediaInformation', 'mediaInformation'],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName) => {
      beforeEach(() => {
        wrapper.findComponent({ ref }).vm.$emit('click');
      });

      it(`emits the ${emitEventName} event`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([[album]]);
      });
    },
  );

  describe('when the InteractionWrapper component emits the dragStart event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(InteractionWrapper)
        .vm.$emit('dragStart', DragEvent);
    });

    it('emits the dragStart event', () => {
      expect(wrapper.emitted('dragStart')).toEqual([[album, DragEvent]]);
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

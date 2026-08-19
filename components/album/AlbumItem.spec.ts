import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ArtistLinkList from '@/components/artist/ArtistLinkList.vue';
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownSubmenu from '@/components/dropdown/DropdownSubmenu.vue';
import InteractionWrapper from '@/components/ui/InteractionWrapper.vue';
import { getFormattedAlbumsMock } from '@/test/helpers';

import AlbumItem from './AlbumItem.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const openDropdownMenuMock = vi.fn();

const album = getFormattedAlbumsMock()[0];

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
      beforeEach(async () => {
        const dropdownSubMenu = wrapper.findComponent(DropdownSubmenu);

        if (dropdownSubMenu.exists()) {
          await dropdownSubMenu.trigger('mouseenter');
        }
      });

      it('shows the ArtistLinkList component', () => {
        expect(wrapper.findComponent(ArtistLinkList).exists()).toBe(true);
      });

      it('shows the DropdownSubmenu component', () => {
        expect(wrapper.findComponent(DropdownSubmenu).exists()).toBe(true);
      });

      it('shows the correct number of DropdownItem components inside the DropdownSubmenu', () => {
        expect(
          wrapper
            .findComponent(DropdownSubmenu)
            .findAllComponents(DropdownItem),
        ).toHaveLength(album.artists.length);
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

      it('does not show the ArtistLinkList component', () => {
        expect(wrapper.findComponent(ArtistLinkList).exists()).toBe(false);
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

    it('does not show the ArtistLinkList component', () => {
      expect(wrapper.findComponent(ArtistLinkList).exists()).toBe(false);
    });

    it('does not show the DropdownSubmenu component', () => {
      expect(wrapper.findComponent(DropdownSubmenu).exists()).toBe(false);
    });
  });

  describe.each([
    ['play album ButtonLink', 'playAlbumButtonLink', 'playAlbum'],
    ['add to queue ButtonLink', 'addToQueueButtonLink', 'addToQueue'],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName) => {
      beforeEach(async () => {
        await wrapper.findComponent({ ref }).trigger('click');
      });

      it(`emits the ${emitEventName} event`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([[album]]);
      });
    },
  );

  describe.each([
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

  describe('when the InteractionWrapper component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('click');
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.album,
        params: {
          [ROUTE_PARAM_KEYS.album.id]: album.id,
        },
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

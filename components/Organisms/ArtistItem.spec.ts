import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import { getFormattedArtistsMock } from '@/test/helpers';

import ArtistItem from './ArtistItem.vue';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const openDropdownMenuMock = vi.fn();

const artist = getFormattedArtistsMock()[0];

function factory(props = {}) {
  return mount(ArtistItem, {
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
      artist,
      ...props,
    },
  });
}

describe('ArtistItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the FavouriteButton component', () => {
    expect(wrapper.findComponent(FavouriteButton).exists()).toBe(true);
  });

  it('shows the DropdownMenu component', () => {
    expect(wrapper.findComponent({ ref: 'dropdownMenuRef' }).exists()).toBe(
      true,
    );
  });

  describe('when the InteractionWrapper component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('click');
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.artist,
        params: {
          [ROUTE_PARAM_KEYS.artist.id]: artist.id,
        },
      });
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

import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import FavouriteButton from './FavouriteButton.vue';

const toggleFavouriteMock = vi.fn();
const addToFavouriteIdsMock = vi.fn();
const favouriteIdsMock = ref<Record<string, boolean>>({});

mockNuxtImport('useFavourite', () => () => ({
  addToFavouriteIds: addToFavouriteIdsMock,
  favouriteIds: favouriteIdsMock,
  toggleFavourite: toggleFavouriteMock,
}));

function factory(props = {}) {
  return mount(FavouriteButton, {
    props: {
      favourite: true,
      id: 'id',
      type: 'album',
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

const buttonProps = {
  false: {
    color: undefined,
    text: 'Like album',
    weight: 'regular',
  },
  true: {
    color: 'var(--error-color)',
    text: 'Unlike album',
    weight: 'fill',
  },
};

describe('FavouriteButton', () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the id prop is in favouriteIds value', () => {
    beforeEach(() => {
      favouriteIdsMock.value = {
        id: false,
      };

      factory();
    });

    it('does not call the addToFavouriteIds function', () => {
      expect(addToFavouriteIdsMock).not.toHaveBeenCalled();
    });
  });

  describe('when the id prop is not in favouriteIds value', () => {
    beforeEach(() => {
      favouriteIdsMock.value = {};
    });

    describe('when the favourite prop is false', () => {
      beforeEach(() => {
        factory({
          favourite: false,
        });
      });

      it('does not call the addToFavouriteIds function', () => {
        expect(addToFavouriteIdsMock).not.toHaveBeenCalled();
      });
    });

    describe('when the favourite prop is true', () => {
      beforeEach(() => {
        factory();
      });

      it('calls the addToFavouriteIds function', () => {
        expect(addToFavouriteIdsMock).toHaveBeenCalled();
      });
    });
  });

  describe.each([
    [false, buttonProps.false],
    [true, buttonProps.true],
  ])('when favouriteIds id key is %s', (isFavourite, currentProps) => {
    beforeEach(() => {
      favouriteIdsMock.value = {
        id: isFavourite,
      };

      wrapper = factory({
        favourite: isFavourite,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct iconColor prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('iconColor')).toBe(
        currentProps.color,
      );
    });

    it('sets the correct iconWeight prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('iconWeight')).toBe(
        currentProps.weight,
      );
    });

    it('sets the correct title attribute on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
        currentProps.text,
      );
    });

    it('sets the correct slot data on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toContain(
        currentProps.text,
      );
    });

    describe('when the ButtonLink component is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent(ButtonLink).vm.$emit('click');
      });

      it('calls the toggleFavourite function', () => {
        expect(toggleFavouriteMock).toHaveBeenCalledWith(
          {
            favourite: isFavourite,
            id: 'id',
            showText: false,
            type: 'album',
          },
          isFavourite,
        );
      });
    });
  });
});

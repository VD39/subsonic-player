import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import FavouriteButton from './FavouriteButton.vue';

const addFavouriteMock = vi.fn();
const removeFavouriteMock = vi.fn();

mockNuxtImport('useFavourite', () => () => ({
  addFavourite: addFavouriteMock,
  removeFavourite: removeFavouriteMock,
}));

function factory(props = {}) {
  return mount(FavouriteButton, {
    props: {
      favourite: false,
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
    mockFn: addFavouriteMock,
    title: 'Like',
    weight: 'duotone',
  },
  true: {
    color: 'var(--error-color)',
    mockFn: removeFavouriteMock,
    title: 'Unlike',
    weight: 'fill',
  },
};

describe('FavouriteButton', () => {
  let wrapper: VueWrapper;

  describe.each([
    [false, buttonProps.false, buttonProps.true],
    [true, buttonProps.true, buttonProps.false],
  ])(
    'when favourite prop is set to %s',
    (favourite, currentProps, inverseProp) => {
      beforeEach(() => {
        wrapper = factory({
          favourite,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct color on ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('iconColor')).toBe(
          currentProps.color,
        );
      });

      it('sets the correct weight on ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('iconWeight')).toBe(
          currentProps.weight,
        );
      });

      it('sets the correct title on ButtonLink component', () => {
        const title = `${currentProps.title} album`;
        const buttonLink = wrapper.findComponent(ButtonLink);

        expect(buttonLink.attributes('title')).toBe(title);
        expect(buttonLink.text()).toBe(title);
      });

      describe('when the ButtonLink component emits a click event', () => {
        beforeEach(() => {
          wrapper.findComponent(ButtonLink).vm.$emit('click');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('calls the correct favourite action', () => {
          expect(currentProps.mockFn).toHaveBeenCalled();
        });

        it('sets the correct color on ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).props('iconColor')).toBe(
            inverseProp.color,
          );
        });

        it('sets the correct weight on ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).props('iconWeight')).toBe(
            inverseProp.weight,
          );
        });

        it('sets the correct title on ButtonLink component', () => {
          const title = `${inverseProp.title} album`;
          const buttonLink = wrapper.findComponent(ButtonLink);

          expect(buttonLink.attributes('title')).toBe(title);
          expect(buttonLink.text()).toBe(title);
        });
      });
    },
  );
});

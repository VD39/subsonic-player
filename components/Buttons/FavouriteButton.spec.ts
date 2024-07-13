import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import IconButton from './IconButton.vue';
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
      default: 'Text',
    },
  });
}

const buttonProps = {
  true: {
    color: 'var(--error-color)',
    mockFn: removeFavouriteMock,
    title: 'Unlike',
    weight: 'fill',
  },
  false: {
    color: undefined,
    mockFn: addFavouriteMock,
    title: 'Like',
    weight: 'duotone',
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
      beforeAll(() => {
        wrapper = factory({
          favourite,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct color on IconButton component', () => {
        expect(wrapper.findComponent(IconButton).props('iconColor')).toBe(
          currentProps.color,
        );
      });

      it('sets the correct weight on IconButton component', () => {
        expect(wrapper.findComponent(IconButton).props('iconWeight')).toBe(
          currentProps.weight,
        );
      });

      it('sets the correct title on IconButton component', () => {
        const title = `${currentProps.title} album`;
        const iconButton = wrapper.findComponent(IconButton);

        expect(iconButton.attributes('title')).toBe(title);
        expect(iconButton.text()).toBe(title);
      });

      describe('when button is clicked', () => {
        beforeAll(() => {
          wrapper.findComponent(IconButton).vm.$emit('click');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('calls the correct favourite action', () => {
          expect(currentProps.mockFn).toHaveBeenCalled();
        });

        it('sets the correct color on IconButton component', () => {
          expect(wrapper.findComponent(IconButton).props('iconColor')).toBe(
            inverseProp.color,
          );
        });

        it('sets the correct weight on IconButton component', () => {
          expect(wrapper.findComponent(IconButton).props('iconWeight')).toBe(
            inverseProp.weight,
          );
        });

        it('sets the correct title on IconButton component', () => {
          const title = `${inverseProp.title} album`;
          const iconButton = wrapper.findComponent(IconButton);

          expect(iconButton.attributes('title')).toBe(title);
          expect(iconButton.text()).toBe(title);
        });
      });
    },
  );
});

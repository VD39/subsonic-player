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
    text: 'Like album',
    weight: 'regular',
  },
  true: {
    color: 'var(--error-color)',
    mockFn: removeFavouriteMock,
    text: 'Unlike album',
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

      it('sets the correct color on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('iconColor')).toBe(
          currentProps.color,
        );
      });

      it('sets the correct weight on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('iconWeight')).toBe(
          currentProps.weight,
        );
      });

      it('sets the correct title on the ButtonLink component', () => {
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

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('calls the correct favourite action', () => {
          expect(currentProps.mockFn).toHaveBeenCalled();
        });

        it('sets the correct color on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).props('iconColor')).toBe(
            inverseProp.color,
          );
        });

        it('sets the correct weight on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).props('iconWeight')).toBe(
            inverseProp.weight,
          );
        });

        it('sets the correct title on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
            inverseProp.text,
          );
        });

        it('sets the correct slot data on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).text()).toContain(
            inverseProp.text,
          );
        });
      });
    },
  );
});

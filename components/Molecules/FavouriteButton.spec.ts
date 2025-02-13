import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import FavouriteButton from './FavouriteButton.vue';

const { updateQueueTrackFavouriteMock } = useAudioPlayerMock();

const addFavouriteMock = vi.fn();
const addToFavouriteIdsMock = vi.fn();
const favouriteIdsMock = ref<Record<string, boolean>>({});
const removeFavouriteMock = vi.fn();

mockNuxtImport('useFavourite', () => () => ({
  addFavourite: addFavouriteMock,
  addToFavouriteIds: addToFavouriteIdsMock,
  favouriteIds: favouriteIdsMock,
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

  describe('when component is mounted', () => {
    describe('when id prop is in favouriteIds value', () => {
      beforeEach(() => {
        favouriteIdsMock.value = {
          id: false,
        };
      });

      it('does not call the addToFavouriteIds function', () => {
        expect(addToFavouriteIdsMock).not.toHaveBeenCalled();
      });
    });

    describe('when id prop is not in favouriteIds value', () => {
      beforeEach(() => {
        favouriteIdsMock.value = {};
      });

      describe('when favourite prop is false', () => {
        beforeEach(() => {
          factory();
        });

        it('does not call the addToFavouriteIds function', () => {
          expect(addToFavouriteIdsMock).not.toHaveBeenCalled();
        });
      });

      describe('when favourite prop is true', () => {
        beforeEach(() => {
          factory({
            favourite: true,
          });
        });

        it('calls the addToFavouriteIds function', () => {
          expect(addToFavouriteIdsMock).toHaveBeenCalled();
        });
      });
    });
  });

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
          favouriteIdsMock.value.id = !favourite;
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

        it('calls the updateQueueTrackFavourite function with correct parameters', () => {
          expect(updateQueueTrackFavouriteMock).toHaveBeenCalledWith(
            'id',
            !favourite,
          );
        });
      });
    },
  );
});

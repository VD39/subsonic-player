import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { flushPromises, mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputField from '@/components/Atoms/InputField.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';
import { documentEventListenerMock } from '@/test/eventListenersMock.js';
import { searchSuggestionsMock } from '@/test/fixtures.js';
import { getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import SearchForm from './SearchForm.vue';
import SearchSuggestions from './SearchSuggestions.vue';

const blurSpy = vi.spyOn(HTMLElement.prototype, 'blur');

const fetchSearchSuggestionsMock = vi.fn().mockResolvedValue([]);

mockNuxtImport('useSearch', () => () => ({
  fetchSearchSuggestions: fetchSearchSuggestionsMock,
}));

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const debouncedCancelMock = vi.fn();

mockNuxtImport('debounce', () => {
  return <T extends (...args: unknown[]) => unknown>(cb: T) => {
    const debounced = (...args: Parameters<T>) => cb(...args);
    debounced.cancel = debouncedCancelMock;
    return debounced;
  };
});

const lockScrollMock = vi.fn();
const unlockScrollMock = vi.fn();

mockNuxtImport('useScrollLock', () => () => ({
  lockScroll: lockScrollMock,
  unlockScroll: unlockScrollMock,
}));

const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();
const { documentEvents } = documentEventListenerMock();

const track = getFormattedTracksMock()[0];

function factory(props = {}) {
  return mount(SearchForm, {
    props: {
      ...props,
    },
  });
}

describe('SearchForm', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the correct loading prop on the SearchSuggestions component', () => {
    expect(wrapper.findComponent(SearchSuggestions).props('loading')).toBe(
      false,
    );
  });

  it('sets the correct suggestions prop on the SearchSuggestions component', () => {
    expect(
      wrapper.findComponent(SearchSuggestions).props('suggestions'),
    ).toEqual([]);
  });

  describe('when form is invalid', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'searchForm' }).trigger('submit');
    });

    it('does not call the navigateTo function', () => {
      expect(navigateToMock).not.toHaveBeenCalled();
    });

    it('does not call the blur function', () => {
      expect(blurSpy).not.toHaveBeenCalled();
    });
  });

  describe('when form is valid', () => {
    beforeEach(async () => {
      wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'query');
      await wrapper.find({ ref: 'searchForm' }).trigger('submit');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.search,
        params: {
          [ROUTE_PARAM_KEYS.search.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Albums,
          [ROUTE_PARAM_KEYS.search.query]: 'query',
        },
      });
    });

    it('sets the correct query prop on the SearchSuggestions component', () => {
      expect(wrapper.findComponent(SearchSuggestions).props('query')).toBe('');
    });

    it('sets the correct showSuggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('showSuggestions'),
      ).toBe(false);
    });

    it('sets the correct suggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('suggestions'),
      ).toEqual([]);
    });

    it('sets the correct loading prop on the SearchSuggestions component', () => {
      expect(wrapper.findComponent(SearchSuggestions).props('loading')).toBe(
        false,
      );
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        ICONS.search,
      );
    });

    it('displays the correct text in the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toContain('Search');
    });
  });

  describe('when the query value changes to a value with less than 2 characters', () => {
    beforeEach(() => {
      wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'a');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct showSuggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('showSuggestions'),
      ).toBe(false);
    });

    it('sets the correct query prop on the SearchSuggestions component', () => {
      expect(wrapper.findComponent(SearchSuggestions).props('query')).toBe('a');
    });

    it('sets the correct loading prop on the SearchSuggestions component', () => {
      expect(wrapper.findComponent(SearchSuggestions).props('loading')).toBe(
        false,
      );
    });

    it('sets the correct suggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('suggestions'),
      ).toEqual([]);
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        ICONS.search,
      );
    });

    it('displays the correct text in the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toContain('Search');
    });

    it('does not call the fetchSearchSuggestions function', () => {
      expect(fetchSearchSuggestionsMock).not.toHaveBeenCalled();
    });

    it('calls the debouncedFetch cancel function', () => {
      expect(debouncedCancelMock).toHaveBeenCalled();
    });

    it('calls the unlockScroll function', () => {
      expect(unlockScrollMock).toHaveBeenCalled();
    });
  });

  describe('when the query value changes to a value with at least 2 characters', () => {
    beforeEach(() => {
      wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'ab');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct showSuggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('showSuggestions'),
      ).toBe(true);
    });

    it('sets the correct query prop on the SearchSuggestions component', () => {
      expect(wrapper.findComponent(SearchSuggestions).props('query')).toBe(
        'ab',
      );
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        ICONS.search,
      );
    });

    it('displays the correct text in the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toContain('Search');
    });

    it('calls the fetchSearchSuggestions function with the correct parameters', () => {
      expect(fetchSearchSuggestionsMock).toHaveBeenCalledWith('ab');
    });

    it('sets the correct suggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('suggestions'),
      ).toEqual([]);
    });

    it('calls the lockScroll function', () => {
      expect(lockScrollMock).toHaveBeenCalled();
    });

    describe('when fetchSearchSuggestions resolves with data', () => {
      beforeEach(async () => {
        fetchSearchSuggestionsMock.mockResolvedValueOnce(searchSuggestionsMock);
        wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'abc');
        await flushPromises();
      });

      it('sets the correct suggestions prop on the SearchSuggestions component', () => {
        expect(
          wrapper.findComponent(SearchSuggestions).props('suggestions'),
        ).toEqual(searchSuggestionsMock);
      });

      it('sets the correct loading prop to false on the SearchSuggestions component', () => {
        expect(wrapper.findComponent(SearchSuggestions).props('loading')).toBe(
          false,
        );
      });

      it('sets the search icon on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          ICONS.search,
        );
      });

      it('displays the correct text in the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).text()).toContain('Search');
      });

      describe('when the query changes to the same value with different casing while a fetch is in progress', () => {
        beforeEach(async () => {
          fetchSearchSuggestionsMock.mockResolvedValueOnce(
            searchSuggestionsMock,
          );
          fetchSearchSuggestionsMock.mockResolvedValueOnce(
            searchSuggestionsMock,
          );
          wrapper
            .findComponent(InputField)
            .vm.$emit('update:modelValue', 'test');
          wrapper
            .findComponent(InputField)
            .vm.$emit('update:modelValue', 'Test');
          await flushPromises();
        });

        it('updates suggestions with the fetch result', () => {
          expect(
            wrapper.findComponent(SearchSuggestions).props('suggestions'),
          ).toEqual(searchSuggestionsMock);
        });

        it('sets the correct loading prop to false on the SearchSuggestions component', () => {
          expect(
            wrapper.findComponent(SearchSuggestions).props('loading'),
          ).toBe(false);
        });
      });

      describe('when the query changes while a fetch is in progress', () => {
        beforeEach(async () => {
          fetchSearchSuggestionsMock.mockResolvedValueOnce(
            searchSuggestionsMock,
          );
          wrapper
            .findComponent(InputField)
            .vm.$emit('update:modelValue', 'abcd');
          await wrapper.vm.$nextTick();
          wrapper
            .findComponent(InputField)
            .vm.$emit('update:modelValue', 'abcde');
          await flushPromises();
        });

        it('does not update suggestions with stale fetch result', () => {
          expect(
            wrapper.findComponent(SearchSuggestions).props('suggestions'),
          ).toEqual([]);
        });
      });
    });
  });

  describe('when fetchSearchSuggestions is pending', () => {
    beforeEach(() => {
      fetchSearchSuggestionsMock.mockReturnValue(new Promise(() => {}));
      wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'abc');
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        SpinningLoader,
      );
    });

    it('displays the correct text in the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toContain(
        'Searching...',
      );
    });
  });

  describe('when the esc key is pressed', () => {
    beforeEach(async () => {
      wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'ab');
      await wrapper.vm.$nextTick();
      documentEvents.keydown({ key: 'Escape' });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct showSuggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('showSuggestions'),
      ).toBe(false);
    });

    it('calls the blur function', () => {
      expect(blurSpy).toHaveBeenCalled();
    });
  });

  describe('when a non esc key is pressed', () => {
    beforeEach(async () => {
      wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'ab');
      documentEvents.keydown({ key: 'Shift' });
    });

    it('does not call the blur function', () => {
      expect(blurSpy).not.toHaveBeenCalled();
    });

    it('sets the correct showSuggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('showSuggestions'),
      ).toBe(true);
    });
  });

  describe('when the InputField component emits the focus event', () => {
    describe('when the query has at least 2 characters', () => {
      beforeEach(async () => {
        wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'ab');
        await wrapper.vm.$nextTick();
        await wrapper.findComponent(InputField).find('input').trigger('focus');
      });

      it('sets the correct showSuggestions prop on the SearchSuggestions component', () => {
        expect(
          wrapper.findComponent(SearchSuggestions).props('showSuggestions'),
        ).toBe(true);
      });
    });

    describe('when the query has less than 2 characters', () => {
      beforeEach(async () => {
        wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'a');
        await wrapper.findComponent(InputField).find('input').trigger('focus');
      });

      it('sets the correct showSuggestions prop on the SearchSuggestions component', () => {
        expect(
          wrapper.findComponent(SearchSuggestions).props('showSuggestions'),
        ).toBe(false);
      });
    });
  });

  describe('when the SearchSuggestions component emits the close event', () => {
    beforeEach(async () => {
      wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'ab');
      await wrapper.vm.$nextTick();
      wrapper.findComponent(SearchSuggestions).vm.$emit('close');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct query prop on the SearchSuggestions component', () => {
      expect(wrapper.findComponent(SearchSuggestions).props('query')).toBe('');
    });

    it('sets the correct showSuggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('showSuggestions'),
      ).toBe(false);
    });

    it('sets the correct suggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('suggestions'),
      ).toEqual([]);
    });

    it('sets the correct loading prop on the SearchSuggestions component', () => {
      expect(wrapper.findComponent(SearchSuggestions).props('loading')).toBe(
        false,
      );
    });
  });

  describe('when the backdrop is clicked', () => {
    beforeEach(async () => {
      wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'ab');
      await wrapper.vm.$nextTick();
      await wrapper.find({ ref: 'backdrop' }).trigger('click');
    });

    it('sets the correct showSuggestions prop on the SearchSuggestions component', () => {
      expect(
        wrapper.findComponent(SearchSuggestions).props('showSuggestions'),
      ).toBe(false);
    });

    it('sets the correct query prop on the SearchSuggestions component', () => {
      expect(wrapper.findComponent(SearchSuggestions).props('query')).toBe('');
    });

    it('calls the blur function', () => {
      expect(blurSpy).toHaveBeenCalled();
    });

    it('calls the unlockScroll function', () => {
      expect(unlockScrollMock).toHaveBeenCalled();
    });
  });

  describe('when the SearchSuggestions component emits the addToQueue event', () => {
    beforeEach(() => {
      wrapper.findComponent(SearchSuggestions).vm.$emit('addToQueue', track);
    });

    it('calls the addTrackToQueue function with the correct parameters', () => {
      expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
    });
  });

  describe('when the SearchSuggestions component emits the playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(SearchSuggestions).vm.$emit('playTrack', track);
    });

    it('calls the playTracks function with the correct parameters', () => {
      expect(playTracksMock).toHaveBeenCalledWith([track]);
    });
  });

  describe('when the component unmounts', () => {
    beforeEach(() => {
      wrapper.unmount();
    });

    it('cancels the debouncedFetch function', () => {
      expect(debouncedCancelMock).toHaveBeenCalled();
    });

    it('calls the unlockScroll function', () => {
      expect(unlockScrollMock).toHaveBeenCalled();
    });
  });
});

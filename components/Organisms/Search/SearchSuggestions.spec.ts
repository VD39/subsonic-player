import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';
import { searchSuggestionsMock } from '@/test/fixtures';

import SearchSuggestionItem from './SearchSuggestionItem.vue';
import SearchSuggestions from './SearchSuggestions.vue';
import SearchSuggestionTrackItem from './SearchSuggestionTrackItem.vue';

const track = searchSuggestionsMock[1].items[0].track;

function factory(props = {}) {
  return mount(SearchSuggestions, {
    props: {
      loading: false,
      query: 'query',
      showSuggestions: true,
      suggestions: [],
      ...props,
    },
  });
}

describe('SearchSuggestions', () => {
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

  describe('when the showSuggestions prop is false', () => {
    beforeEach(() => {
      wrapper = factory({
        showSuggestions: false,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the suggestions wrapper element', () => {
      expect(wrapper.find({ ref: 'suggestionsWrapper' }).exists()).toBe(false);
    });
  });

  describe('when the showSuggestions prop is true', () => {
    it('shows the suggestions wrapper element', () => {
      expect(wrapper.find({ ref: 'suggestionsWrapper' }).exists()).toBe(true);
    });

    describe('when the loading prop is true', () => {
      beforeEach(() => {
        wrapper = factory({
          loading: true,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the SpinningLoader component', () => {
        expect(wrapper.findComponent(SpinningLoader).exists()).toBe(true);
      });

      it('does not show the no results found element', () => {
        expect(wrapper.find({ ref: 'noResultsFound' }).exists()).toBe(false);
      });
    });

    describe('when the loading prop is false', () => {
      it('does not show the SpinningLoader component', () => {
        expect(wrapper.findComponent(SpinningLoader).exists()).toBe(false);
      });

      describe('when the suggestions prop is an empty array', () => {
        it('shows the no results found element', () => {
          expect(wrapper.find({ ref: 'noResultsFound' }).exists()).toBe(true);
        });

        it('does not show the group suggestions element', () => {
          expect(
            wrapper.find('[data-test-id="search-suggestion-group"]').exists(),
          ).toBe(false);
        });
      });

      describe('when the suggestions prop is not an empty array', () => {
        beforeEach(() => {
          wrapper = factory({
            suggestions: searchSuggestionsMock,
          });
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('does not show the no results found element', () => {
          expect(wrapper.find({ ref: 'noResultsFound' }).exists()).toBe(false);
        });

        it('shows the group suggestions element', () => {
          expect(
            wrapper.findAll('[data-test-id="search-suggestion-group"]').length,
          ).toBe(2);
        });

        it('shows the correct number of SearchSuggestionItem components', () => {
          expect(wrapper.findAllComponents(SearchSuggestionItem).length).toBe(
            2,
          );
        });

        it('shows the correct number of SearchSuggestionTrackItem components', () => {
          expect(
            wrapper.findAllComponents(SearchSuggestionTrackItem).length,
          ).toBe(1);
        });

        it('sets the correct to prop on the RouterLink component', () => {
          const routerLinks = wrapper.findAllComponents(
            '[data-test-id="viewAllLink"]',
          ) as VueWrapper<unknown, never>[];

          expect(routerLinks[0].props('to')).toEqual({
            name: ROUTE_NAMES.search,
            params: {
              [ROUTE_PARAM_KEYS.search.mediaType]: 'albums',
              [ROUTE_PARAM_KEYS.search.query]: 'query',
            },
          });

          expect(routerLinks[1].props('to')).toEqual({
            name: ROUTE_NAMES.search,
            params: {
              [ROUTE_PARAM_KEYS.search.mediaType]: 'tracks',
              [ROUTE_PARAM_KEYS.search.query]: 'query',
            },
          });
        });

        describe('when the close button is clicked', () => {
          beforeEach(async () => {
            await wrapper
              .findComponent({ ref: 'closeButton' })
              .trigger('click');
          });

          it('emits the close event', () => {
            expect(wrapper.emitted('close')).toEqual([[]]);
          });
        });

        describe('when the RouterLink component is clicked', () => {
          beforeEach(async () => {
            const routerLink = wrapper.findComponent(
              '[data-test-id="viewAllLink"]',
            ) as VueWrapper<unknown, never>;

            await routerLink.trigger('click');
          });

          it('emits the close event', () => {
            expect(wrapper.emitted('close')).toEqual([[]]);
          });
        });

        describe('when the SearchSuggestionItem component emits the close event', () => {
          beforeEach(async () => {
            wrapper.findComponent(SearchSuggestionItem).vm.$emit('close');
          });

          it('emits the close event', () => {
            expect(wrapper.emitted('close')).toEqual([[]]);
          });
        });

        describe('when the SearchSuggestionTrackItem component emits the close event', () => {
          beforeEach(async () => {
            wrapper.findComponent(SearchSuggestionTrackItem).vm.$emit('close');
          });

          it('emits the close event', () => {
            expect(wrapper.emitted('close')).toEqual([[]]);
          });
        });

        describe('when the SearchSuggestionTrackItem component emits the addToQueue event', () => {
          beforeEach(async () => {
            wrapper
              .findComponent(SearchSuggestionTrackItem)
              .vm.$emit('addToQueue', track);
          });

          it('emits the addToQueue event with the correct value', () => {
            const track = searchSuggestionsMock[1].items[0].track;
            expect(wrapper.emitted('addToQueue')).toEqual([[track]]);
          });
        });

        describe('when the SearchSuggestionTrackItem component emits the playTrack event', () => {
          beforeEach(async () => {
            wrapper
              .findComponent(SearchSuggestionTrackItem)
              .vm.$emit('playTrack', track);
          });

          it('emits the playTrack event with the correct value', () => {
            expect(wrapper.emitted('playTrack')).toEqual([[track]]);
          });
        });
      });
    });
  });
});

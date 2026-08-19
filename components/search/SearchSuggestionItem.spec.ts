import type { VueWrapper } from '@vue/test-utils';

import { mount, RouterLinkStub } from '@vue/test-utils';

import ArtistLinkList from '@/components/artist/ArtistLinkList.vue';
import { searchSuggestionsMock } from '@/test/fixtures';

import SearchSuggestionItem from './SearchSuggestionItem.vue';

const item = searchSuggestionsMock[0].items[0];

function factory(props = {}) {
  return mount(SearchSuggestionItem, {
    props: {
      item,
      ...props,
    },
  });
}

describe('SearchSuggestionItem', () => {
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

  describe('when artists is not an empty array', () => {
    it('shows the ArtistLinkList component', () => {
      expect(wrapper.findComponent(ArtistLinkList).exists()).toBe(true);
    });
  });

  describe('when artists is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        item: {
          ...item,
          artists: [],
        },
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the ArtistLinkList component', () => {
      expect(wrapper.findComponent(ArtistLinkList).exists()).toBe(false);
    });
  });

  describe('when the RouterLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent(RouterLinkStub).trigger('click');
    });

    it('emits the close event', () => {
      expect(wrapper.emitted('close')).toEqual([[]]);
    });
  });
});

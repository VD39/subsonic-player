import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { getFormattedArtistsMock } from '@/test/helpers';
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';
import MediaListWrapper from './MediaListWrapper.vue';
import ArtistItem from './ArtistItem.vue';
import ArtistsList from './ArtistsList.vue';

function factory(props = {}) {
  return mount(ArtistsList, {
    props: {
      artists: [],
      ...props,
    },
  });
}

describe('ArtistsList', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when artists prop is an empty array', () => {
    it('does not show the MediaListWrapper component', () => {
      expect(wrapper.findComponent(MediaListWrapper).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when artists prop is not an empty array', () => {
    beforeAll(() => {
      wrapper = factory({
        artists: getFormattedArtistsMock(5),
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the MediaListWrapper component', () => {
      expect(wrapper.findComponent(MediaListWrapper).exists()).toBe(true);
    });

    it('shows the correct number of ArtistItem components', () => {
      expect(wrapper.findAllComponents(ArtistItem).length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });
  });
});

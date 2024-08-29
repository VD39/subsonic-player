import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { getFormattedAlbumsMock } from '@/test/helpers';
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';
import MediaListWrapper from './MediaListWrapper.vue';
import AlbumItem from './AlbumItem.vue';
import AlbumsList from './AlbumsList.vue';

function factory(props = {}) {
  return mount(AlbumsList, {
    props: {
      albums: [],
      ...props,
    },
  });
}

describe('AlbumsList', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when albums prop is an empty array', () => {
    it('does not show the MediaListWrapper component', () => {
      expect(wrapper.findComponent(MediaListWrapper).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when albums prop is not an empty array', () => {
    beforeAll(() => {
      wrapper = factory({
        albums: getFormattedAlbumsMock(5),
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the MediaListWrapper component', () => {
      expect(wrapper.findComponent(MediaListWrapper).exists()).toBe(true);
    });

    it('shows the correct number of AlbumItem components', () => {
      expect(wrapper.findAllComponents(AlbumItem).length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });
  });
});

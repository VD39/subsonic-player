import type { VueWrapper } from '@vue/test-utils';

import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';
import { getFormattedAlbumsMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

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

  beforeEach(() => {
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
    beforeEach(() => {
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

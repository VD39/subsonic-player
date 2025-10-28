import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import ArtistItem from '@/components/Organisms/ArtistItem.vue';
import { getFormattedArtistsMock } from '@/test/helpers';

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

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when artists prop is an empty array', () => {
    it('does not show the GridWrapper component', () => {
      expect(wrapper.findComponent(GridWrapper).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when artists prop is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        artists: getFormattedArtistsMock(5),
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the GridWrapper component', () => {
      expect(wrapper.findComponent(GridWrapper).exists()).toBe(true);
    });

    it('shows the correct number of the ArtistItem component', () => {
      expect(wrapper.findAllComponents(ArtistItem).length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });
  });
});

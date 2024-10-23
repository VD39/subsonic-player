import type { VueWrapper } from '@vue/test-utils';

import ImageLink from '@/components/Organisms/ImageLink.vue';
import { formattedPodcastMock } from '@/test/fixtures';
import { mount } from '@vue/test-utils';

import PodcastItem from './PodcastItem.vue';

function factory(props = {}) {
  return mount(PodcastItem, {
    props: {
      podcast: formattedPodcastMock,
      ...props,
    },
  });
}

describe('PodcastItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the correct ImageLink to prop', () => {
    expect(wrapper.findComponent(ImageLink).props('to')).toBe(
      '/podcast/all/id',
    );
  });
});

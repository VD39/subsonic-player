import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ImageLink from '@/components/Organisms/ImageLink.vue';
import { formattedPodcastMock } from '@/test/fixtures';

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

  it('sets the correct to prop on the ImageLink component', () => {
    expect(wrapper.findComponent(ImageLink).props('to')).toEqual({
      name: ROUTE_NAMES.podcast,
      params: {
        [ROUTE_PARAM_KEYS.podcast.id]: 'id',
        [ROUTE_PARAM_KEYS.podcast.sortBy]: ROUTE_PODCAST_SORT_BY_PARAMS.All,
      },
    });
  });
});

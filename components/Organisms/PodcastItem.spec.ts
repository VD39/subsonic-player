import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

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
});

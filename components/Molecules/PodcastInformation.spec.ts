import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { getFormattedPodcastsMock } from '@/test/helpers';

import PodcastInformation from './PodcastInformation.vue';

function factory(props = {}) {
  return mount(PodcastInformation, {
    props: {
      podcast: getFormattedPodcastsMock()[0],
      ...props,
    },
  });
}

describe('PodcastInformation', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

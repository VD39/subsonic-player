import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { getFormattedPodcastsMock } from '@/test/helpers';

import PodcastDetails from './PodcastDetails.vue';

function factory(props = {}) {
  return mount(PodcastDetails, {
    props: {
      podcast: getFormattedPodcastsMock()[0],
      ...props,
    },
  });
}

describe('PodcastDetails', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

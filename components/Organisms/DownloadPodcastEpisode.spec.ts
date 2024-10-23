import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { mount } from '@vue/test-utils';

import DownloadPodcastEpisode from './DownloadPodcastEpisode.vue';

function factory(props = {}) {
  return mount(DownloadPodcastEpisode, {
    props: {
      image: 'image',
      ...props,
    },
  });
}

describe('DownloadPodcastEpisode', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the ButtonLink component emits a click event', () => {
    beforeEach(() => {
      wrapper.findComponent(ButtonLink).vm.$emit('click');
    });

    it('emits the downloadEpisode event with track', () => {
      expect(wrapper.emitted('downloadEpisode')).toEqual([[]]);
    });
  });
});

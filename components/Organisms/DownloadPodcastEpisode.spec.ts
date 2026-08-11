import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import DownloadPodcastEpisode from './DownloadPodcastEpisode.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

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

  describe('when the ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent(ButtonLink).trigger('click');
    });

    it('emits the downloadPodcastEpisode event', () => {
      expect(wrapper.emitted('downloadPodcastEpisode')).toEqual([[]]);
    });
  });
});

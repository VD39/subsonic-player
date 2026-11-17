import type { VueWrapper } from '@vue/test-utils';

import { getFormattedPodcastEpisodesMock } from '@@/test/helpers';
import { mount } from '@vue/test-utils';

import BaseIcon from '@/components/ui/BaseIcon.vue';

import PodcastEpisodeDetails from './PodcastEpisodeDetails.vue';

function factory(props = {}) {
  return mount(PodcastEpisodeDetails, {
    props: {
      podcastEpisode: getFormattedPodcastEpisodesMock()[0],
      ...props,
    },
  });
}

describe('PodcastEpisodeDetails', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when episode is downloaded', () => {
    it('shows the correct icon', () => {
      expect(wrapper.findComponent(BaseIcon).props('icon')).toBe(
        ICONS.downloaded,
      );
    });
  });

  describe('when episode is not downloaded', () => {
    beforeEach(() => {
      wrapper = factory({
        podcastEpisode: getFormattedPodcastEpisodesMock(1, {
          downloaded: false,
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the correct icon', () => {
      expect(wrapper.findComponent(BaseIcon).props('icon')).toBe(
        ICONS.notDownloaded,
      );
    });
  });
});

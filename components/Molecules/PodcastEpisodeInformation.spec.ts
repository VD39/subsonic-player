import type { VueWrapper } from '@vue/test-utils';

import { getFormattedPodcastEpisodesMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import PodcastEpisodeInformation from './PodcastEpisodeInformation.vue';

function factory(props = {}) {
  return mount(PodcastEpisodeInformation, {
    props: {
      podcastEpisode: getFormattedPodcastEpisodesMock()[0],
      ...props,
    },
  });
}

describe('PodcastEpisodeInformation', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when episode is downloaded', () => {
    it('shows the correct icon', () => {
      expect(
        (wrapper.find({ ref: 'iconComponent' }).element as HTMLElement).tagName,
      ).toBe(ICONS.downloaded.toUpperCase());
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
      expect(
        (wrapper.find({ ref: 'iconComponent' }).element as HTMLElement).tagName,
      ).toBe(ICONS.notDownloaded.toUpperCase());
    });
  });
});

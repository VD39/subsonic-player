import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistPodcastItem from '@/components/tracklist/TracklistPodcastItem.vue';
import { getFormattedPodcastEpisodesMock } from '@/test/helpers';

import TracklistPodcast from './TracklistPodcast.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const podcastEpisodes = getFormattedPodcastEpisodesMock(5);
const podcastEpisode = getFormattedPodcastEpisodesMock()[0];

function factory(props = {}) {
  return mount(TracklistPodcast, {
    props: {
      podcastEpisodes,
      ...props,
    },
  });
}

describe('TracklistPodcast', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the podcastEpisodes prop is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        podcastEpisodes: [],
      });
    });

    it('does not show the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when the podcastEpisodes prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of podcast episode items', () => {
      expect(wrapper.findAllComponents(TracklistPodcastItem)).toHaveLength(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when the isRecentList prop is true', () => {
      beforeEach(() => {
        wrapper = factory({
          isRecentList: true,
        });
      });

      it('passes isRecentList prop to TracklistPodcastItem', () => {
        expect(
          wrapper.findComponent(TracklistPodcastItem).props('isRecentList'),
        ).toBe(true);
      });
    });

    describe.each([
      ['addToPlaylist', [podcastEpisode.id]],
      ['addToQueue', [podcastEpisode]],
      ['deletePodcastEpisode', [podcastEpisode]],
      ['downloadPodcastEpisode', [podcastEpisode]],
      ['downloadMedia', [podcastEpisode]],
      ['podcastEpisodeInformation', [podcastEpisode]],
      ['playPodcastEpisode', [podcastEpisode]],
    ])(
      'when the TracklistPodcastItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(() => {
          wrapper.findComponent(TracklistPodcastItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );

    describe('when the TracklistPodcastItem component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper
          .findComponent(TracklistPodcastItem)
          .vm.$emit('dragStart', DragEvent);
      });

      it('emits the dragStart event with the correct value', () => {
        expect(wrapper.emitted('dragStart')).toEqual([
          [podcastEpisode, DragEvent],
        ]);
      });
    });
  });
});

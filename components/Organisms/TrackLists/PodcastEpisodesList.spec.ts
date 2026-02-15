import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import PodcastEpisodesListItem from '@/components/Organisms/TrackLists/PodcastEpisodesListItem.vue';
import { getFormattedPodcastEpisodesMock } from '@/test/helpers';

import PodcastEpisodesList from './PodcastEpisodesList.vue';

const podcastEpisodes = getFormattedPodcastEpisodesMock(5);
const episode = podcastEpisodes[0];

function factory(props = {}) {
  return mount(PodcastEpisodesList, {
    props: {
      podcastEpisodes,
      ...props,
    },
  });
}

describe('PodcastEpisodesList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when podcastEpisodes prop is an empty array', () => {
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

  describe('when podcastEpisodes prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of episode items', () => {
      expect(wrapper.findAllComponents(PodcastEpisodesListItem).length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when isRecentList prop is true', () => {
      beforeEach(() => {
        wrapper = factory({
          isRecentList: true,
        });
      });

      it('passes isRecentList prop to PodcastEpisodesListItem', () => {
        expect(
          wrapper.findComponent(PodcastEpisodesListItem).props('isRecentList'),
        ).toBe(true);
      });
    });

    describe.each([
      ['addToPlaylist', [episode.id]],
      ['addToQueue', [episode]],
      ['deleteEpisode', [episode]],
      ['downloadEpisode', [episode]],
      ['downloadMedia', [episode]],
      ['episodeInformation', [episode]],
      ['playEpisode', [episode]],
    ])(
      'when the PodcastEpisodesListItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(async () => {
          wrapper.findComponent(PodcastEpisodesListItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );

    describe('when the PodcastEpisodesListItem component emits the dragStart event', () => {
      beforeEach(async () => {
        wrapper
          .findComponent(PodcastEpisodesListItem)
          .vm.$emit('dragStart', DragEvent);
      });

      it('emits the dragStart event with the correct value', () => {
        expect(wrapper.emitted('dragStart')).toEqual([[episode, DragEvent]]);
      });
    });
  });
});

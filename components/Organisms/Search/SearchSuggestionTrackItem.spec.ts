import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ArtistLinks from '@/components/Atoms/ArtistLinks.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import SearchSuggestionTrackItem from './SearchSuggestionTrackItem.vue';

const track = getFormattedTracksMock()[0];

function factory(props = {}) {
  return mount(SearchSuggestionTrackItem, {
    props: {
      track,
      ...props,
    },
  });
}

describe('SearchSuggestionTrackItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when artists is not an empty array', () => {
    it('shows the ArtistLinks component', () => {
      expect(wrapper.findComponent(ArtistLinks).exists()).toBe(true);
    });

    describe('when the ArtistLinks component emits the click event', () => {
      beforeEach(async () => {
        await wrapper.findComponent(ArtistLinks).trigger('click');
      });

      it('emits the close event', () => {
        expect(wrapper.emitted('close')).toEqual([[]]);
      });
    });
  });

  describe('when artists is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        track: getFormattedTracksMock(1, {
          artists: [],
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the ArtistLinks component', () => {
      expect(wrapper.findComponent(ArtistLinks).exists()).toBe(false);
    });
  });

  describe('when the wrapper element is clicked', () => {
    beforeEach(async () => {
      await wrapper.trigger('click');
    });

    it('emits the playTrack event with the correct value', () => {
      expect(wrapper.emitted('playTrack')).toEqual([[track]]);
    });
  });

  describe('when the TrackPlayPause component emits the playTrack event', () => {
    beforeEach(() => {
      wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack', track);
    });

    it('emits the playTrack event', () => {
      expect(wrapper.emitted('playTrack')).toEqual([[track]]);
    });
  });

  describe('when the ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper
        .findComponent({ ref: 'addToQueueButtonLink' })
        .trigger('click');
    });

    it('emits the addToQueue event with the correct value', () => {
      expect(wrapper.emitted('addToQueue')).toEqual([[track]]);
    });
  });
});

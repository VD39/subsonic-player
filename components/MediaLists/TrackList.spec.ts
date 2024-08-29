import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { getFormattedTracksMock } from '@/test/helpers';
import IconButton from '@/components/Buttons/IconButton.vue';
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';
import TrackList from './TrackList.vue';

function factory(props = {}) {
  return mount(TrackList, {
    props: {
      tracks: [],
      ...props,
    },
  });
}

describe('TrackList', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when radioStations prop is an empty array', () => {
    it('does not show the tracks wrapper', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when radioStations prop is not an empty array', () => {
    const tracks = getFormattedTracksMock(5);

    beforeAll(async () => {
      wrapper = factory({
        tracks,
      });

      wrapper
        .findAllComponents('[data-test-id="dropdown-menu"]')[0]
        .findComponent(IconButton)
        .vm.$emit('click');

      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the tracks wrapper', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of track items', () => {
      expect(wrapper.findAll('[data-test-id="track"]').length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when the add to playlist button is clicked', () => {
      beforeAll(() => {
        (
          wrapper.findAllComponents(
            '[data-test-id="add-to-playlist"]',
          )[0] as VueWrapper
        ).vm.$emit('click');
      });

      it('emits the addToPlaylist event with track', () => {
        expect(wrapper.emitted('addToPlaylist')).toEqual([[tracks[0]]]);
      });
    });

    describe('when the add to queue button is clicked', () => {
      beforeAll(() => {
        (
          wrapper.findAllComponents(
            '[data-test-id="add-to-queue"]',
          )[0] as VueWrapper
        ).vm.$emit('click');
      });

      it('emits the addToQueue event with track', () => {
        expect(wrapper.emitted('addToQueue')).toEqual([[tracks[0]]]);
      });
    });

    describe('when the play track button is clicked', () => {
      beforeAll(() => {
        (
          wrapper.findAllComponents(
            '[data-test-id="play-track"]',
          )[0] as VueWrapper
        ).vm.$emit('click');
      });

      it('emits the playTrack event with track', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[0]]);
      });
    });
  });
});

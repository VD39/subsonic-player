import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { getFormattedPlaylistsMock } from '@/test/helpers';
import IconButton from '@/components/Buttons/IconButton.vue';
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';
import MediaListWrapper from './MediaListWrapper.vue';
import PlaylistsList from './PlaylistsList.vue';

function factory(props = {}) {
  return mount(PlaylistsList, {
    props: {
      playlists: [],
      ...props,
    },
  });
}

describe('PlaylistsList', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when artists prop is an empty array', () => {
    it('does not show the MediaListWrapper component', () => {
      expect(wrapper.findComponent(MediaListWrapper).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when artists prop is not an empty array', () => {
    const playlists = getFormattedPlaylistsMock(5);

    beforeAll(async () => {
      wrapper = factory({
        playlists,
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

    it('shows the MediaListWrapper component', () => {
      expect(wrapper.findComponent(MediaListWrapper).exists()).toBe(true);
    });

    it('shows the correct number of playlist items', () => {
      expect(wrapper.findAll('[data-test-id="playlist"]').length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when the delete playlist button is clicked', () => {
      beforeAll(() => {
        (
          wrapper.findAllComponents(
            '[data-test-id="delete-playlist"]',
          )[0] as VueWrapper
        ).vm.$emit('click');
      });

      it('emits the deletePlaylist event with track', () => {
        expect(wrapper.emitted('deletePlaylist')).toEqual([[playlists[0]]]);
      });
    });

    describe('when the edit playlist button is clicked', () => {
      beforeAll(() => {
        (
          wrapper.findAllComponents(
            '[data-test-id="edit-playlist"]',
          )[0] as VueWrapper
        ).vm.$emit('click');
      });

      it('emits the editPlaylist event with track', () => {
        expect(wrapper.emitted('editPlaylist')).toEqual([[playlists[0]]]);
      });
    });
  });
});

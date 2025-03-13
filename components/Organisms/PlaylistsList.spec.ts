import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import { getFormattedPlaylistsMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import PlaylistsList from './PlaylistsList.vue';

const playlists = getFormattedPlaylistsMock(5);

function factory(props = {}) {
  const wrapper = mount(PlaylistsList, {
    props: {
      playlists: [],
      ...props,
    },
  });

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
}

describe('PlaylistsList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when playlists prop is an empty array', () => {
    it('does not show the MediaListWrapper component', () => {
      expect(wrapper.findComponent(MediaListWrapper).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when playlists prop is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        playlists,
      });
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

    describe('when the delete playlist DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'deletePlaylist' }).vm.$emit('click');
      });

      it('emits the deletePlaylist event with track', () => {
        expect(wrapper.emitted('deletePlaylist')).toEqual([[playlists[0].id]]);
      });
    });

    describe('when the edit playlist DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'editPlaylist' }).vm.$emit('click');
      });

      it('emits the editPlaylist event with track', () => {
        expect(wrapper.emitted('editPlaylist')).toEqual([[playlists[0]]]);
      });
    });
  });
});

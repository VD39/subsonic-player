import type { VueWrapper } from '@vue/test-utils';

import { getFormattedPlaylistsMock } from '@/test/helpers';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import SubNavigationItem from './Items/SubNavigationItem.vue';
import PlaylistItems from './PlaylistNavigation.vue';

const playlistsMock = ref<Playlist[]>([]);
const addPlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addPlaylistModal: addPlaylistModalMock,
  playlists: playlistsMock,
}));

function factory(props = {}) {
  return mount(PlaylistItems, {
    props: {
      collapsed: false,
      ...props,
    },
  });
}

describe('PlaylistItems', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when playlist value returns null', () => {
    it('does not show the SubNavigationItem component', () => {
      expect(wrapper.findComponent(SubNavigationItem).exists()).toBe(false);
    });
  });

  describe('when playlist value returns playlists', () => {
    beforeEach(() => {
      playlistsMock.value = getFormattedPlaylistsMock(2);
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    describe('when playlist value returned is less than 5', () => {
      it('shows the correct number of the SubNavigationItem component', () => {
        expect(wrapper.findAllComponents(SubNavigationItem).length).toBe(2);
      });
    });

    describe('when playlist value returned is more than 5', () => {
      beforeEach(() => {
        playlistsMock.value = getFormattedPlaylistsMock(10);
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct number of the SubNavigationItem component', () => {
        expect(wrapper.findAllComponents(SubNavigationItem).length).toBe(5);
      });
    });
  });

  describe('when the add playlist ButtonLink component emits a click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'addPlaylist' }).vm.$emit('click');
    });

    it('calls the addPlaylistModal function', () => {
      expect(addPlaylistModalMock).toHaveBeenCalled();
    });
  });
});

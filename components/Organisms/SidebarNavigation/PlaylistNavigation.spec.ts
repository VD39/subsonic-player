import type { VueWrapper } from '@vue/test-utils';

import { getFormattedPlaylistsMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import SubNavigationItem from './Items/SubNavigationItem.vue';
import PlaylistItems from './PlaylistNavigation.vue';

function factory(props = {}) {
  return mount(PlaylistItems, {
    props: {
      collapsed: false,
      playlists: [],
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
      wrapper = factory({
        playlists: getFormattedPlaylistsMock(2),
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    describe(`when playlist value returned is less than ${PREVIEW_PLAYLIST_COUNT}`, () => {
      it('shows the correct number of the SubNavigationItem component', () => {
        expect(wrapper.findAllComponents(SubNavigationItem).length).toBe(2);
      });
    });

    describe(`when playlist value returned is more than ${PREVIEW_PLAYLIST_COUNT}`, () => {
      beforeEach(() => {
        wrapper = factory({
          playlists: getFormattedPlaylistsMock(PREVIEW_PLAYLIST_COUNT + 1),
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct number of the SubNavigationItem component', () => {
        expect(wrapper.findAllComponents(SubNavigationItem).length).toBe(
          PREVIEW_PLAYLIST_COUNT,
        );
      });
    });
  });

  describe('when the add playlist ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'addPlaylist' }).vm.$emit('click');
    });

    it('emits the addPlaylist event', () => {
      expect(wrapper.emitted('addPlaylist')).toEqual([[]]);
    });
  });
});

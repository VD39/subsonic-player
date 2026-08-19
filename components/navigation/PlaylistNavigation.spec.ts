import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import { getFormattedPlaylistsMock } from '@/test/helpers';

import SubNavigationItem from './items/SubNavigationItem.vue';
import PlaylistItems from './PlaylistNavigation.vue';

const dropMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useDragAndDrop', (original) => () => ({
  ...original(),
  drop: dropMock,
}));

const playlists = getFormattedPlaylistsMock(2);

function factory(props = {}) {
  return mount(PlaylistItems, {
    props: {
      collapsed: false,
      playlists,
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

  describe('when the playlist value is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        playlists: [],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the SubNavigationItem component', () => {
      expect(wrapper.findComponent(SubNavigationItem).exists()).toBe(false);
    });
  });

  describe('when the playlist value returns playlists', () => {
    describe(`when the playlist value returned is less than ${PREVIEW_PLAYLIST_COUNT}`, () => {
      it('shows the correct number of the SubNavigationItem component', () => {
        expect(wrapper.findAllComponents(SubNavigationItem)).toHaveLength(2);
      });
    });

    describe(`when the playlist value returned is more than ${PREVIEW_PLAYLIST_COUNT}`, () => {
      beforeEach(() => {
        wrapper = factory({
          playlists: getFormattedPlaylistsMock(PREVIEW_PLAYLIST_COUNT + 1),
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct number of the SubNavigationItem component', () => {
        expect(wrapper.findAllComponents(SubNavigationItem)).toHaveLength(
          PREVIEW_PLAYLIST_COUNT,
        );
      });
    });
  });

  describe(`when playlist id is not ${RANDOM_PLAYLIST.id}`, () => {
    it(`adds the ${DRAG_AND_DROP_CLASS_NAMES.isDroppable} class to the SubNavigationItem component`, () => {
      expect(wrapper.findComponent(SubNavigationItem).classes()).toContain(
        DRAG_AND_DROP_CLASS_NAMES.isDroppable,
      );
    });
  });

  describe(`when playlist id is ${RANDOM_PLAYLIST.id}`, () => {
    beforeEach(() => {
      wrapper = factory({
        playlists: [
          {
            ...getFormattedPlaylistsMock()[0],
            id: RANDOM_PLAYLIST.id,
          },
        ],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it(`does not add the ${DRAG_AND_DROP_CLASS_NAMES.isDroppable} class to the SubNavigationItem component`, () => {
      expect(wrapper.findComponent(SubNavigationItem).classes()).not.toContain(
        DRAG_AND_DROP_CLASS_NAMES.isDroppable,
      );
    });
  });

  describe('when the SubNavigationItem component calls the drop action', () => {
    beforeEach(async () => {
      await wrapper.findComponent(SubNavigationItem).trigger('drop');
    });

    it('calls the drop function with the correct parameters', () => {
      expect(dropMock).toHaveBeenCalledWith(
        playlists[0].id,
        expect.any(DragEvent),
      );
    });
  });

  describe('when the add playlist ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ ref: 'addPlaylist' }).trigger('click');
    });

    it('emits the addPlaylist event', () => {
      expect(wrapper.emitted('addPlaylist')).toEqual([[]]);
    });
  });
});

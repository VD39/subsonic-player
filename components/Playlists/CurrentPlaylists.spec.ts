import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { getFormattedPlaylistsMock } from '@/test/helpers';
import IconButton from '@/components/Buttons/IconButton.vue';
import CurrentPlaylists from './CurrentPlaylists.vue';

const collapsedMock = ref(false);

mockNuxtImport('useSidebar', () => () => ({
  collapsed: collapsedMock,
}));

const playlistsMock = ref<Playlist[]>([]);
const getPlaylistsMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  playlists: playlistsMock,
  getPlaylists: getPlaylistsMock,
}));

function factory(props = {}) {
  return mount(CurrentPlaylists, {
    props: {
      ...props,
    },
  });
}

describe('CurrentPlaylists', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('calls the getPlaylists function', () => {
    expect(getPlaylistsMock).toHaveBeenCalled();
  });

  describe('when playlist value returns null', () => {
    it('does not show the playlist wrapper', () => {
      expect(wrapper.find({ ref: 'playlistWrapper' }).exists()).toBe(false);
    });
  });

  describe('when playlist value returns playlists', () => {
    beforeEach(() => {
      playlistsMock.value = getFormattedPlaylistsMock(2);
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the playlist wrapper', () => {
      expect(wrapper.find({ ref: 'playlistWrapper' }).exists()).toBe(true);
    });

    describe('when playlist value returned is less than 5', () => {
      it('shows the correct amount of the IconButton component', () => {
        expect(wrapper.findAllComponents(IconButton).length).toBe(2);
      });
    });

    describe('when playlist value returned is more than 5', () => {
      beforeEach(() => {
        playlistsMock.value = getFormattedPlaylistsMock(10);
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct amount of the IconButton component', () => {
        expect(wrapper.findAllComponents(IconButton).length).toBe(5);
      });
    });

    describe('when collapsed value is false', () => {
      it('sets the correct show-text prop on the IconButton component', () => {
        expect(wrapper.findAllComponents(IconButton)[0].props('showText')).toBe(
          true,
        );
      });
    });

    describe('when collapsed value is true', () => {
      beforeEach(() => {
        collapsedMock.value = true;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct show-text prop on the IconButton component', () => {
        expect(wrapper.findAllComponents(IconButton)[0].props('showText')).toBe(
          false,
        );
      });
    });
  });
});

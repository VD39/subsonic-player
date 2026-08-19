import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import PlaylistListItem from '@/components/playlist/PlaylistListItem.vue';
import { getFormattedPlaylistsMock } from '@/test/helpers';

import PlaylistList from './PlaylistList.vue';

const playlists = getFormattedPlaylistsMock(5);
const playlist = playlists[0];

function factory(props = {}) {
  return mount(PlaylistList, {
    props: {
      playlists: [],
      ...props,
    },
  });
}

describe('PlaylistList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the playlists prop is an empty array', () => {
    it('does not show the playlists grid wrapper element', () => {
      expect(wrapper.findComponent(PlaylistListItem).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when the playlists prop is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        playlists,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the correct number of playlist items', () => {
      expect(wrapper.findAllComponents(PlaylistListItem)).toHaveLength(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe.each([
      ['deletePlaylist', [playlist.id]],
      ['editPlaylist', [playlist]],
    ])(
      'when the PlaylistListItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(() => {
          wrapper.findComponent(PlaylistListItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );
  });
});

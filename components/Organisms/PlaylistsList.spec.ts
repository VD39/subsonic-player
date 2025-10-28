import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import { getFormattedPlaylistsMock } from '@/test/helpers';

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
    it('does not show the GridWrapper component', () => {
      expect(wrapper.findComponent(GridWrapper).exists()).toBe(false);
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

    it('shows the GridWrapper component', () => {
      expect(wrapper.findComponent(GridWrapper).exists()).toBe(true);
    });

    it('shows the correct number of playlist items', () => {
      expect(wrapper.findAll('[data-test-id="playlist"]').length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe.each([
      [
        'delete playlist DropdownItem',
        'deletePlaylist',
        'deletePlaylist',
        [playlists[0].id],
      ],
      [
        'edit playlist DropdownItem',
        'editPlaylist',
        'editPlaylist',
        [playlists[0]],
      ],
    ])(
      'when the %s component emits the click event',
      (_text, ref, emitEventName, expectedArgs) => {
        beforeEach(() => {
          wrapper.findComponent({ ref }).vm.$emit('click');
        });

        it(`emits the ${emitEventName} event with the correct value`, () => {
          expect(wrapper.emitted(emitEventName)).toEqual([expectedArgs]);
        });
      },
    );
  });
});

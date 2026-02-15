import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import { getFormattedPlaylistsMock } from '@/test/helpers';

import PlaylistsListItem from './PlaylistsListItem.vue';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const playlist = getFormattedPlaylistsMock(1)[0];

const openDropdownMenuMock = vi.fn();

function factory(props = {}) {
  return mount(PlaylistsListItem, {
    global: {
      stubs: {
        DropdownMenu: {
          methods: {
            openDropdownMenu: openDropdownMenuMock,
          },
          template: '<div><slot /></div>',
        },
      },
    },
    props: {
      playlist,
      ...props,
    },
  });
}

describe('PlaylistsListItem', () => {
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

  describe('when the InteractionWrapper component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('click');
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.playlist,
        params: {
          [ROUTE_PARAM_KEYS.playlist.id]: playlist.id,
        },
      });
    });
  });

  describe('when the InteractionWrapper component emits the longPress event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('longPress');
    });

    it('calls the openDropdownMenu function', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
    });
  });

  describe('when the InteractionWrapper component emits the contextMenu event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('contextMenu');
    });

    it('calls the openDropdownMenu function', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
    });
  });

  describe.each([
    ['edit playlist DropdownItem', 'editPlaylist', 'editPlaylist'],
    ['delete playlist DropdownItem', 'deletePlaylist', 'deletePlaylist'],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName) => {
      beforeEach(() => {
        wrapper.findComponent({ ref }).vm.$emit('click');
      });

      it(`emits the ${emitEventName} event`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([[]]);
      });
    },
  );
});

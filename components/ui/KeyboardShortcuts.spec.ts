import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import KeyboardShortcuts from './KeyboardShortcuts.vue';

const isShortcutListOpenedMock = ref(false);

mockNuxtImport('useKeyboardShortcuts', (original) => () => ({
  ...original(),
  isShortcutListOpened: isShortcutListOpenedMock,
  KEYBOARD_SHORTCUTS: {
    Test: [
      {
        action: vi.fn(),
        description: 'Description 1',
        helpText: 'Help text 1',
        keys: ['Any', 'Key'],
      },
    ],
    Test1: [
      {
        action: vi.fn(),
        description: 'Description 2',
        helpText: 'Help text 2',
        keys: ['Key'],
      },
    ],
  },
}));

function factory(props = {}) {
  return mount(KeyboardShortcuts, {
    props: {
      ...props,
    },
  });
}

describe('KeyboardShortcuts', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when the isShortcutListOpened value is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show  hot key mappings element', () => {
      expect(wrapper.find({ ref: 'shortcutList' }).exists()).toBe(false);
    });

    it('does not show the fullscreen element', () => {
      expect(wrapper.find({ ref: 'fullscreen' }).exists()).toBe(false);
    });
  });

  describe('when the isShortcutListOpened value is true', () => {
    beforeEach(() => {
      isShortcutListOpenedMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the hot key mappings element', () => {
      expect(wrapper.find({ ref: 'shortcutList' }).exists()).toBe(true);
    });

    it('shows the fullscreen element', () => {
      expect(wrapper.find({ ref: 'fullscreen' }).exists()).toBe(true);
    });
  });
});

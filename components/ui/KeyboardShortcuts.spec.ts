import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import KeyboardShortcuts from './KeyboardShortcuts.vue';

mockNuxtImport('useKeyboardShortcuts', (original) => () => ({
  ...original(),
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

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the shortcut list element', () => {
    expect(wrapper.find({ ref: 'shortcutList' }).exists()).toBe(true);
  });
});

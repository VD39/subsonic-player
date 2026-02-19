import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import HotkeyMappings from './HotkeyMappings.vue';

const isHotkeyListOpenedMock = ref(false);

mockNuxtImport('useHotkeyManager', () => () => ({
  HOTKEY_MAPPINGS: [
    {
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
  ],
  isHotkeyListOpened: isHotkeyListOpenedMock,
}));

function factory(props = {}) {
  return mount(HotkeyMappings, {
    props: {
      ...props,
    },
  });
}

describe('HotkeyMappings', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when isHotkeyListOpened is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show  hot key mappings element', () => {
      expect(wrapper.find({ ref: 'hotkeyMappings' }).exists()).toBe(false);
    });

    it('does not show the fullscreen element', () => {
      expect(wrapper.find({ ref: 'fullscreen' }).exists()).toBe(false);
    });
  });

  describe('when isHotkeyListOpened is true', () => {
    beforeEach(() => {
      isHotkeyListOpenedMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the hot key mappings element', () => {
      expect(wrapper.find({ ref: 'hotkeyMappings' }).exists()).toBe(true);
    });

    it('shows the fullscreen element', () => {
      expect(wrapper.find({ ref: 'fullscreen' }).exists()).toBe(true);
    });
  });
});

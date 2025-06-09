import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import HotkeyMappings from './HotkeyMappings.vue';

function factory(props = {}) {
  return mount(HotkeyMappings, {
    props: {
      keyMappings: {
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
      ...props,
    },
  });
}

describe('HotkeyMappings', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SettingsSection from './SettingsSection.vue';

function factory(props = {}, slots = {}) {
  return mount(SettingsSection, {
    props: {
      title: 'title',
      ...props,
    },
    slots,
  });
}

describe('SettingsSection', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the default slot is set', () => {
    beforeEach(() => {
      wrapper = factory(
        {},
        {
          default: 'Slot content',
        },
      );
    });

    it('displays the correct slot content', () => {
      expect(wrapper.text()).toContain('Slot content');
    });
  });
});

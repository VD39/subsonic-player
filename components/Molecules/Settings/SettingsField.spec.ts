import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SettingsField from './SettingsField.vue';

function factory(props = {}, slots = {}) {
  return mount(SettingsField, {
    props: {
      title: 'title',
      ...props,
    },
    slots,
  });
}

describe('SettingsField', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the description prop is not set', () => {
    it('does not show the description element', () => {
      expect(wrapper.find({ ref: 'descriptionEl' }).exists()).toBe(false);
    });
  });

  describe('when the description prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        description: 'description',
      });
    });

    it('shows the description element', () => {
      expect(wrapper.find({ ref: 'descriptionEl' }).exists()).toBe(true);
    });
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

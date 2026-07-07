import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ToggleSwitch from './ToggleSwitch.vue';

function factory(props = {}) {
  return mount(ToggleSwitch, {
    props: {
      label: 'label',
      pressed: false,
      ...props,
    },
  });
}

describe('ToggleSwitch', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the pressed prop is false', () => {
    it('sets the correct aria-checked attribute on the button element', () => {
      expect(wrapper.attributes('aria-checked')).toBe('false');
    });

    it('does not add the pressed class to wrapper element', () => {
      expect(wrapper.classes()).not.toContain('pressed');
    });
  });

  describe('when the pressed prop is true', () => {
    beforeEach(() => {
      wrapper = factory({
        pressed: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct aria-checked attribute on the button element', () => {
      expect(wrapper.attributes('aria-checked')).toBe('true');
    });

    it('adds the pressed class to wrapper element', () => {
      expect(wrapper.classes()).toContain('pressed');
    });
  });

  describe('when the click event is triggered', () => {
    beforeEach(async () => {
      await wrapper.trigger('click');
    });

    it('emits the click event', () => {
      expect(wrapper.emitted('click')).toEqual([[]]);
    });
  });
});

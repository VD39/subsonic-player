import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import InputField from './InputField.vue';

function factory(props = {}) {
  return mount(InputField, {
    props: {
      id: 'id',
      label: 'label',
      type: 'text',
      ...props,
    },
  });
}

describe('InputField', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when the hideLabel prop is not set', () => {
    it('does not add the visuallyHidden class', () => {
      expect(wrapper.find({ ref: 'label' }).classes()).not.toContain(
        'visuallyHidden',
      );
    });
  });

  describe('when the hideLabel prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        hideLabel: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the visuallyHidden class', () => {
      expect(wrapper.find({ ref: 'label' }).classes()).toContain(
        'visuallyHidden',
      );
    });
  });

  describe('when the error prop is not set', () => {
    it('does not add the error class to wrapper element', () => {
      expect(wrapper.classes()).not.toContain('error');
    });

    it('does not show the error element', () => {
      expect(wrapper.find({ ref: 'error' }).exists()).toBe(false);
    });
  });

  describe('when the error prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        error: 'Error message.',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds  the error class to wrapper element', () => {
      expect(wrapper.classes()).toContain('error');
    });

    it('shows the error element', () => {
      expect(wrapper.find({ ref: 'error' }).exists()).toBe(true);
    });
  });

  describe('when the required prop is not set', () => {
    it('does not show the required element', () => {
      expect(wrapper.find({ ref: 'required' }).exists()).toBe(false);
    });
  });

  describe('when the required prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        required: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the required element', () => {
      expect(wrapper.find({ ref: 'required' }).exists()).toBe(true);
    });
  });

  describe('when input is triggered', () => {
    beforeEach(async () => {
      const input = wrapper.find({ ref: 'input' });
      (input.element as HTMLInputElement).value = 'Input value.';
      await input.trigger('input');
    });

    it('emits exactly one input event', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([['Input value.']]);
    });
  });
});

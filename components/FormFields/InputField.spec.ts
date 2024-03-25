import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import InputField from './InputField.vue';

function factory(props = {}) {
  return mount(InputField, {
    props: {
      id: 'id',
      label: 'label',
      type: 'text',
      modelValue: '',
      ...props,
    },
  });
}

describe('InputField', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when hideLabel prop is not set', () => {
    it('does not add the visually-hidden class', () => {
      expect(wrapper.find({ ref: 'label' }).classes()).not.toContain(
        'visually-hidden',
      );
    });
  });

  describe('when hideLabel prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        hideLabel: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the visually-hidden class', () => {
      expect(wrapper.find({ ref: 'label' }).classes()).toContain(
        'visually-hidden',
      );
    });
  });

  describe('when hasError prop is not set', () => {
    it('does not add the error class to wrapper', () => {
      expect(wrapper.classes()).not.toContain('error');
    });
  });

  describe('when hasError prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        hasError: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds  the error class to wrapper', () => {
      expect(wrapper.classes()).toContain('error');
    });

    describe('when errorMessage prop is not set', () => {
      it('does not show the errorMessage element', () => {
        expect(wrapper.find({ ref: 'errorMessage' }).exists()).toBe(false);
      });
    });

    describe('when errorMessage prop is set', () => {
      beforeEach(() => {
        wrapper = factory({
          hasError: true,
          errorMessage: 'Error message.',
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the errorMessage element', () => {
        expect(wrapper.find({ ref: 'errorMessage' }).exists()).toBe(true);
      });
    });
  });

  describe('when required prop is not set', () => {
    it('does not show the required element', () => {
      expect(wrapper.find({ ref: 'required' }).exists()).toBe(false);
    });
  });

  describe('when required prop is set to true', () => {
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

import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SelectableBadge from './SelectableBadge.vue';

function factory(props = {}) {
  return mount(SelectableBadge, {
    props: {
      label: 'label',
      selected: false,
      ...props,
    },
  });
}

describe('SelectableBadge', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the selected prop is false', () => {
    it('sets the correct role attribute on the button element', () => {
      expect(wrapper.attributes('role')).toBe('radio');
    });

    it('sets the correct aria-checked attribute on the button element', () => {
      expect(wrapper.attributes('aria-checked')).toBe('false');
    });

    it('does not add the selected class to the wrapper element', () => {
      expect(wrapper.classes()).not.toContain('selected');
    });
  });

  describe('when the selected prop is true', () => {
    beforeEach(() => {
      wrapper = factory({
        selected: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct aria-checked attribute on the button element', () => {
      expect(wrapper.attributes('aria-checked')).toBe('true');
    });

    it('adds the selected class to the wrapper element', () => {
      expect(wrapper.classes()).toContain('selected');
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

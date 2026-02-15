import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import DropdownItem from './DropdownItem.vue';

function factory(props = {}) {
  return mount(DropdownItem, {
    props: {
      ...props,
    },
  });
}

describe('DropdownItem', () => {
  let wrapper: VueWrapper;

  describe('when is prop is span', () => {
    beforeEach(() => {
      wrapper = factory({
        is: 'span',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the span element', () => {
      expect(wrapper.find({ ref: 'spanElement' }).exists()).toBe(true);
    });

    it('does not show the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).exists()).toBe(false);
    });
  });

  describe('when is prop is not span', () => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).exists()).toBe(true);
    });

    it('does not show the span element', () => {
      expect(wrapper.find({ ref: 'spanElement' }).exists()).toBe(false);
    });

    describe('when the ButtonLink component is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent(ButtonLink).vm.$emit('click');
      });

      it('emits the click event', () => {
        expect(wrapper.emitted('click')).toEqual([[]]);
      });
    });
  });
});

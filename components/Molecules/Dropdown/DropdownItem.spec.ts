import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { mount } from '@vue/test-utils';

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

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the ButtonLink component emits a click event', () => {
    beforeEach(() => {
      wrapper.findComponent(ButtonLink).vm.$emit('click');
    });

    it('emits the click event', () => {
      expect(wrapper.emitted('click')).toEqual([[]]);
    });
  });
});

import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import IconButton from '@/components/Buttons/IconButton.vue';
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

  describe('when the IconButton component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent(IconButton).vm.$emit('click');
    });

    it('emits the click event', () => {
      expect(wrapper.emitted('click')).toEqual([[]]);
    });
  });
});

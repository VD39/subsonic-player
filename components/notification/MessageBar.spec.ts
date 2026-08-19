import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import MessageBar from './MessageBar.vue';

function factory(props = {}) {
  return mount(MessageBar, {
    props: {
      type: 'success',
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('MessageBar', () => {
  let wrapper: VueWrapper;

  describe.each([['success'], ['error', 'alert'], ['info']])(
    'when type prop is %s',
    (type, roleType = 'status') => {
      beforeEach(() => {
        wrapper = factory({
          type,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the correct class', () => {
        expect(wrapper.classes()).toContain(type);
      });

      it('sets the correct role attribute on the wrapper element', () => {
        expect(wrapper.attributes('role')).toBe(roleType);
      });
    },
  );
});

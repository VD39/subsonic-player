import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import LoadingData from './LoadingData.vue';

function factory(props = {}) {
  return mount(LoadingData, {
    attachTo: document.body,
    props: {
      status: 'success',
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('LoadingData', () => {
  let wrapper: VueWrapper;

  describe.each([
    ['pending', true, false],
    ['idle', false, true],
    ['success', false, true],
    ['error', false, true],
  ])(
    'when status prop is %s',
    (status, mainLoaderIsVisible, mainContentIsVisible) => {
      beforeEach(() => {
        wrapper = factory({
          status,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MainLoader component', () => {
        expect(wrapper.find({ ref: 'mainLoader' }).isVisible()).toBe(
          mainLoaderIsVisible,
        );
      });

      it('shows the main content', () => {
        expect(wrapper.find({ ref: 'mainContent' }).isVisible()).toBe(
          mainContentIsVisible,
        );
      });
    },
  );
});

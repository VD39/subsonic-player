import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import LayoutButton from './LayoutButton.vue';

const setViewLayoutMock = vi.fn();
const viewLayoutMock = ref<Layout>('gridLayout');

mockNuxtImport('useViewLayout', () => () => ({
  setViewLayout: setViewLayoutMock,
  viewLayout: viewLayoutMock,
}));

function factory(props = {}) {
  return mount(LayoutButton, {
    attachTo: document.body,
    props: {
      ...props,
    },
  });
}

describe('LayoutButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe.each([
    ['gridLayout', ICONS.listLayout, 'list', 'listLayout'],
    ['listLayout', ICONS.gridLayout, 'grid', 'gridLayout'],
  ])(
    'when layout value is %s',
    (layoutValue, expectedIcon, expectedTitle, expectedLayout) => {
      beforeEach(() => {
        viewLayoutMock.value = layoutValue as Layout;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct title attribute value on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          `Switch to ${expectedTitle} layout`,
        );
      });

      it('sets the correct icon prop on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          expectedIcon,
        );
      });

      describe('when ButtonLink component is clicked', () => {
        beforeEach(() => {
          wrapper.findComponent(ButtonLink).vm.$emit('click');
        });

        it('calls the setLayout function with the correct parameter', () => {
          expect(setViewLayoutMock).toHaveBeenCalledWith(expectedLayout);
        });
      });
    },
  );
});

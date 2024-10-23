import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { mount } from '@vue/test-utils';

import MobileNavigation from './MobileNavigation.vue';

function factory(props = {}) {
  return mount(MobileNavigation, {
    props: {
      ...props,
    },
  });
}

describe('MobileNavigation', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct number of ButtonLink components', () => {
    expect(wrapper.findAllComponents(ButtonLink).length).toBe(3);
  });
});

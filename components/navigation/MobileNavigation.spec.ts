import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/ui/ButtonLink.vue';

import MobileNavigation from './MobileNavigation.vue';

function factory(props = {}) {
  return mount(MobileNavigation, {
    props: {
      navigation: MOBILE_NAVIGATION,
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

  it('shows the correct number of navigation items', () => {
    expect(wrapper.findAllComponents(ButtonLink)).toHaveLength(
      MOBILE_NAVIGATION.length,
    );
  });
});

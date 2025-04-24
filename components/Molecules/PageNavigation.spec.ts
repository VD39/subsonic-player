import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { mount, RouterLinkStub } from '@vue/test-utils';

import PageNavigation from './PageNavigation.vue';

function factory(props = {}) {
  return mount(PageNavigation, {
    props: {
      navigation: {
        title: {
          params: {
            id: '/to',
          },
        },
        title1: {
          params: {
            id: '/to1',
          },
        },
      },
      ...props,
    },
  });
}

describe('PageNavigation', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct number of ButtonLink components', () => {
    expect(wrapper.findAllComponents(ButtonLink).length).toBe(2);
  });

  it('sets the correct to prop on ButtonLink component', () => {
    const router = wrapper.findAllComponents(RouterLinkStub);

    expect(router[0].props('to')).toEqual({
      params: {
        id: '/to',
      },
    });
    expect(router[1].props('to')).toEqual({
      params: {
        id: '/to1',
      },
    });
  });
});

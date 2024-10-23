import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { mount, RouterLinkStub } from '@vue/test-utils';

import PageNavigation from './PageNavigation.vue';

function factory(props = {}) {
  return mount(PageNavigation, {
    props: {
      navigation: {
        param: 'mediaType',
        routes: {
          title: '/to',
          title1: '/to1',
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

  describe('when param is defined', () => {
    it('sets the correct to prop', () => {
      expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
        params: {
          mediaType: '/to',
        },
      });
    });
  });

  describe('when param is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        navigation: {
          routes: {
            title: '/to',
            title1: '/to1',
          },
        },
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct to prop', () => {
      expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
        path: '/to',
      });
    });
  });
});

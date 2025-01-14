import type { VueWrapper } from '@vue/test-utils';

import { mount, RouterLinkStub } from '@vue/test-utils';

import LinkOrText from './LinkOrText.vue';

function factory(props = {}) {
  return mount(LinkOrText, {
    props: {
      is: 'nuxt-link',
      isLink: true,
      text: 'text',
      to: 'to',
      ...props,
    },
  });
}

describe('LinkOrText', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when isLink prop is true', () => {
    describe.each([
      [undefined, 'A'],
      ['nuxt-link', 'A'],
      ['a', 'A'],
    ])('when is prop is %s', (is, element) => {
      beforeEach(() => {
        wrapper = factory({
          is,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the link element', () => {
        expect(wrapper.find('[data-test-id="link"]').exists()).toBe(true);
      });

      it('does not show the p element', () => {
        expect(wrapper.find({ ref: 'noLink' }).exists()).toBe(false);
      });

      it('shows the correct element', () => {
        expect(wrapper.element.tagName).toBe(element);
      });
    });

    describe('when is prop is undefined', () => {
      it('sets the correct link attribute', () => {
        expect(wrapper.findComponent(RouterLinkStub).props('to')).toBeDefined();
        expect(
          wrapper.findComponent(RouterLinkStub).attributes('href'),
        ).not.toBeDefined();
      });
    });

    describe('when is prop is nuxt-link', () => {
      it('sets the correct link attribute', () => {
        expect(wrapper.findComponent(RouterLinkStub).props('to')).toBeDefined();
        expect(
          wrapper.findComponent(RouterLinkStub).attributes('href'),
        ).not.toBeDefined();
      });
    });

    describe('when is prop is a', () => {
      beforeEach(() => {
        wrapper = factory({
          is: 'a',
        });
      });

      it('sets the correct link attribute', () => {
        expect(
          wrapper.find('[data-test-id="link"]').attributes('to'),
        ).not.toBeDefined();
        expect(
          wrapper.find('[data-test-id="link"]').attributes('href'),
        ).toBeDefined();
      });
    });
  });

  describe('when isLink prop is false', () => {
    beforeEach(() => {
      wrapper = factory({
        isLink: false,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the NuxtLink component', () => {
      expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false);
    });

    it('shows the p element', () => {
      expect(wrapper.find({ ref: 'noLink' }).exists()).toBe(true);
    });
  });
});

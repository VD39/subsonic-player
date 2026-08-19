import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import GridWrapper from './GridWrapper.vue';

function factory(props = {}) {
  return mount(GridWrapper, {
    props: {
      ...props,
    },
  });
}

describe('GridWrapper', () => {
  let wrapper: VueWrapper;

  describe.each([
    ['mobileColumns', 'mobile', '2'],
    ['tabletColumns', 'tablet', '3'],
    ['desktopColumns', 'desktop', '5'],
  ])('when %s prop is not set', (propName, cssVarSuffix, defaultValue) => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct style attribute on the wrapper element', () => {
      expect(wrapper.attributes('style')).toContain(
        `--loop-rows-${cssVarSuffix}: ${defaultValue};`,
      );
    });
  });

  describe.each([
    ['mobileColumns', 'mobile', '5'],
    ['tabletColumns', 'tablet', '7'],
    ['desktopColumns', 'desktop', '9'],
  ])('when %s prop is set', (propName, cssVarSuffix, value) => {
    beforeEach(() => {
      wrapper = factory({
        [propName]: value,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct style attribute on the wrapper element', () => {
      expect(wrapper.attributes('style')).toContain(
        `--loop-rows-${cssVarSuffix}: ${value};`,
      );
    });
  });

  describe('when the spacing prop is not set', () => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct style attribute on the wrapper element', () => {
      expect(wrapper.attributes('style')).toContain('--loop-grid-gap: 24px;');
    });
  });

  describe('when the spacing prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        spacing: '12',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct style attribute on the wrapper element', () => {
      expect(wrapper.attributes('style')).toContain('--loop-grid-gap: 12px;');
    });
  });
});

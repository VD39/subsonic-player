import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

import SubmitButton from './SubmitButton.vue';

function factory(props = {}) {
  return mount(SubmitButton, {
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('SubmitButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the fullWidth prop is not set', () => {
    it('sets the correct fullWidth prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('fullWidth')).toBe(false);
    });
  });

  describe('when the fullWidth prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        fullWidth: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct fullWidth prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('fullWidth')).toBe(true);
    });
  });

  describe('when the loading prop is not set', () => {
    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).not.toBeDefined();
    });

    it('sets the correct disabled prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('disabled')).toBe(false);
    });
  });

  describe('when the loading prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        loading: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        SpinningLoader,
      );
    });

    it('sets the correct disabled prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('disabled')).toBe(true);
    });
  });
});

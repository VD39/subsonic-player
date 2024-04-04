import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import ButtonLoader from '@/components/Loaders/ButtonLoader.vue';
import LoadingButton from './LoadingButton.vue';

function factory(props = {}) {
  return mount(LoadingButton, {
    props: {
      ...props,
    },
    slots: {
      default: 'Text',
    },
  });
}

describe('LoadingButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when fullWidth prop is not set', () => {
    it('does not add the fullWidth class', () => {
      expect(wrapper.classes()).not.toContain('fullWidth');
    });
  });

  describe('when fullWidth prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        fullWidth: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the fullWidth class', () => {
      expect(wrapper.classes()).toContain('fullWidth');
    });
  });

  describe('when loading prop is not set', () => {
    it('does not show the ButtonLoader component', () => {
      expect(wrapper.findComponent(ButtonLoader).exists()).toBe(false);
    });
  });

  describe('when loading prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        loading: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the ButtonLoader component', () => {
      expect(wrapper.findComponent(ButtonLoader).exists()).toBe(true);
    });
  });

  describe('when disabled prop is not set', () => {
    it('does not add the disabled class', () => {
      expect(wrapper.classes()).not.toContain('disabled');
    });

    it('sets the correct disabled attribute', async () => {
      expect(wrapper.attributes('disabled')).not.toBeDefined();
    });
  });

  describe('when disabled prop is set as true', () => {
    beforeEach(() => {
      wrapper = factory({
        disabled: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the disabled class', () => {
      expect(wrapper.classes()).toContain('disabled');
    });

    it('sets the correct disabled attribute', async () => {
      expect(wrapper.attributes('disabled')).toBeDefined();
    });
  });
});

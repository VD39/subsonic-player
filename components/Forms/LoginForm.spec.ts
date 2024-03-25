import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import MassageBar from '@/components/MessageBar/MessageBar.vue';
import LoginForm from './LoginForm.vue';

const { config } = vi.hoisted(() => ({
  config: {
    serverUrl: '',
  },
}));

vi.mock('@/config', () => ({
  config,
}));

function factory(props = {}) {
  return mount(LoginForm, {
    props: {
      ...props,
    },
  });
}

describe('LoginForm', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when errorMessage prop is not set', () => {
    it('does not show the MassageBar component', () => {
      expect(wrapper.findComponent(MassageBar).exists()).toBe(false);
    });
  });

  describe('when errorMessage prop is set as true', () => {
    beforeEach(() => {
      wrapper = factory({
        errorMessage: 'Error message',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the MassageBar component', () => {
      expect(wrapper.findComponent(MassageBar).exists()).toBe(true);
    });
  });

  describe('when serverUrl in config is not defined', () => {
    it('shows the InputField component for server URL', () => {
      expect(wrapper.findComponent({ ref: 'serverUrl' }).exists()).toBe(true);
    });
  });

  describe('when serverUrl in config is defined', () => {
    beforeEach(() => {
      config.serverUrl = 'serverUrl';
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the InputField component for server URL', () => {
      expect(wrapper.findComponent({ ref: 'serverUrl' }).exists()).toBe(false);
    });
  });

  describe('when form is invalid', () => {
    beforeEach(async () => {
      await wrapper.trigger('submit');
    });

    it('does not emit submit event', () => {
      expect(wrapper.emitted('submit')).toBe(undefined);
    });
  });

  describe('when form is valid', () => {
    beforeEach(async () => {
      config.serverUrl = '';
      wrapper = factory();

      wrapper
        .findComponent({ ref: 'serverUrl' })
        .vm.$emit('update:modelValue', 'https://www.test.com');
      wrapper
        .findComponent({ ref: 'username' })
        .vm.$emit('update:modelValue', 'username');
      wrapper
        .findComponent({ ref: 'password' })
        .vm.$emit('update:modelValue', 'password');
      await wrapper.trigger('submit');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits submit event with form values', () => {
      expect(wrapper.emitted('submit')).toEqual([
        [
          {
            password: 'password',
            server: 'https://www.test.com',
            username: 'username',
          },
        ],
      ]);
    });
  });
});

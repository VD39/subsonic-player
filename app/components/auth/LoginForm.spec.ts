import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import MessageBar from '@/components/notification/MessageBar.vue';
import SelectableBadge from '@/components/settings/SelectableBadge.vue';

import LoginForm from './LoginForm.vue';

const { configMock } = vi.hoisted(() => ({
  configMock: {
    public: {
      SERVER_URL: '',
    },
  },
}));

mockNuxtImport('useRuntimeConfig', (original) => () => ({
  ...original(),
  ...configMock,
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

  it('shows the correct number of SelectableBadge components', () => {
    expect(
      wrapper
        .findComponent({ ref: 'loginModeGroup' })
        .findAllComponents(SelectableBadge),
    ).toHaveLength(LOGIN_MODE_OPTIONS.length);
  });

  it('sets the correct selected prop on each SelectableBadge component', () => {
    const badges = wrapper
      .findComponent({ ref: 'loginModeGroup' })
      .findAllComponents(SelectableBadge);

    expect(badges[0].props('selected')).toBe(true);
    expect(badges[1].props('selected')).toBe(false);
  });

  it('shows the username InputField component', () => {
    expect(wrapper.findComponent({ ref: 'username' }).exists()).toBe(true);
  });

  it('shows the password InputField component', () => {
    expect(wrapper.findComponent({ ref: 'password' }).exists()).toBe(true);
  });

  it('shows the legacy ToggleSwitch component', () => {
    expect(wrapper.findComponent({ ref: 'legacyToggle' }).exists()).toBe(true);
  });

  it('does not show the apiKey InputField component', () => {
    expect(wrapper.findComponent({ ref: 'apiKey' }).exists()).toBe(false);
  });

  describe('when serverUrl in config is not defined', () => {
    it('shows the InputField component for server URL', () => {
      expect(wrapper.findComponent({ ref: 'serverUrl' }).exists()).toBe(true);
    });
  });

  describe('when serverUrl in config is defined', () => {
    beforeEach(() => {
      configMock.public.SERVER_URL = 'https://www.test.com';
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
      expect(wrapper.emitted('submit')).toBeUndefined();
    });
  });

  describe('when form is valid', () => {
    beforeEach(async () => {
      configMock.public.SERVER_URL = '';
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

    it('emits submit event with the form values', () => {
      expect(wrapper.emitted('submit')).toEqual([
        [
          {
            authMethod: 'token',
            password: 'password',
            server: 'https://www.test.com',
            username: 'username',
          },
        ],
      ]);
    });

    describe('when the error prop is not set', () => {
      it('does not show the MessageBar component', () => {
        expect(wrapper.findComponent(MessageBar).exists()).toBe(false);
      });
    });

    describe('when the error prop is set', () => {
      beforeEach(async () => {
        configMock.public.SERVER_URL = '';
        wrapper = factory({
          error: 'Error message',
        });

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

      it('shows the MessageBar component', () => {
        expect(wrapper.findComponent(MessageBar).exists()).toBe(true);
      });
    });
  });

  describe('when the legacy ToggleSwitch component emits the click event', () => {
    beforeEach(async () => {
      configMock.public.SERVER_URL = '';
      wrapper = factory();

      wrapper.findComponent({ ref: 'legacyToggle' }).vm.$emit('click');

      await nextTick();
    });

    it('sets the correct pressed prop on the legacy ToggleSwitch component', () => {
      expect(
        wrapper.findComponent({ ref: 'legacyToggle' }).props('pressed'),
      ).toBe(true);
    });

    describe('when form is valid', () => {
      beforeEach(async () => {
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

      it('emits the submit event with the correct value', () => {
        expect(wrapper.emitted('submit')).toEqual([
          [
            {
              authMethod: 'legacy',
              password: 'password',
              server: 'https://www.test.com',
              username: 'username',
            },
          ],
        ]);
      });
    });
  });

  describe('when the SelectableBadge component emits the click event', () => {
    beforeEach(async () => {
      configMock.public.SERVER_URL = '';
      wrapper = factory();

      wrapper
        .findComponent({ ref: 'loginModeGroup' })
        .findAllComponents(SelectableBadge)[1]
        .vm.$emit('click');

      await nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct selected prop on each SelectableBadge component', () => {
      const badges = wrapper
        .findComponent({ ref: 'loginModeGroup' })
        .findAllComponents(SelectableBadge);

      expect(badges[0].props('selected')).toBe(false);
      expect(badges[1].props('selected')).toBe(true);
    });

    it('shows the apiKey InputField component', () => {
      expect(wrapper.findComponent({ ref: 'apiKey' }).exists()).toBe(true);
    });

    it('does not show the username InputField component', () => {
      expect(wrapper.findComponent({ ref: 'username' }).exists()).toBe(false);
    });

    it('does not show the password InputField component', () => {
      expect(wrapper.findComponent({ ref: 'password' }).exists()).toBe(false);
    });

    it('does not show the legacy ToggleSwitch component', () => {
      expect(wrapper.findComponent({ ref: 'legacyToggle' }).exists()).toBe(
        false,
      );
    });

    describe('when form is invalid', () => {
      beforeEach(async () => {
        wrapper
          .findComponent({ ref: 'serverUrl' })
          .vm.$emit('update:modelValue', 'https://www.test.com');
        await wrapper.trigger('submit');
      });

      it('does not emit the submit event', () => {
        expect(wrapper.emitted('submit')).toBeUndefined();
      });
    });

    describe('when form is valid', () => {
      beforeEach(async () => {
        wrapper
          .findComponent({ ref: 'serverUrl' })
          .vm.$emit('update:modelValue', 'https://www.test.com');
        wrapper
          .findComponent({ ref: 'apiKey' })
          .vm.$emit('update:modelValue', 'apiKey');
        await wrapper.trigger('submit');
      });

      it('emits the submit event with the correct value', () => {
        expect(wrapper.emitted('submit')).toEqual([
          [
            {
              apiKey: 'apiKey',
              authMethod: 'apiKey',
              server: 'https://www.test.com',
            },
          ],
        ]);
      });
    });
  });
});

import type { VueWrapper } from '@vue/test-utils';

import InputField from '@/components/Atoms/InputField.vue';
import { mount } from '@vue/test-utils';

import AddPodcastForm from './AddPodcastForm.vue';

function factory(props = {}) {
  return mount(AddPodcastForm, {
    props: {
      ...props,
    },
  });
}

describe('AddPodcastForm', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when form is invalid', () => {
    beforeEach(async () => {
      wrapper
        .findComponent(InputField)
        .vm.$emit('update:modelValue', 'test.com');
      await wrapper.trigger('submit');
    });

    it('does not emit submit event', () => {
      expect(wrapper.emitted('submit')).toBe(undefined);
    });
  });

  describe('when form is valid', () => {
    beforeEach(async () => {
      wrapper
        .findComponent(InputField)
        .vm.$emit('update:modelValue', 'https://www.test.com');
      await wrapper.trigger('submit');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits submit event with form values', () => {
      expect(wrapper.emitted('submit')).toEqual([['https://www.test.com']]);
    });
  });
});

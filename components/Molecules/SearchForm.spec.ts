import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import InputField from '@/components/Atoms/InputField.vue';

import SearchForm from './SearchForm.vue';

function factory(props = {}) {
  return mount(SearchForm, {
    props: {
      ...props,
    },
  });
}

describe('SearchForm', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
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
      wrapper.findComponent(InputField).vm.$emit('update:modelValue', 'query');
      await wrapper.trigger('submit');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits submit event with the form values', () => {
      expect(wrapper.emitted('submit')).toEqual([['query']]);
    });
  });
});

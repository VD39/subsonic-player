import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SubmitButton from '@/components/Molecules/SubmitButton.vue';
import { formattedRadioStationMock } from '@/test/fixtures';

import AddUpdateRadioStationForm from './AddUpdateRadioStationForm.vue';

function factory(props = {}) {
  return mount(AddUpdateRadioStationForm, {
    props: {
      ...props,
    },
  });
}

describe('AddUpdateRadioStationForm', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when radioStation prop is not set', () => {
    it('sets the correct SubmitButton text', () => {
      expect(wrapper.findComponent(SubmitButton).text()).toBe(
        'Add radio station',
      );
    });
  });

  describe('when radioStation prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        radioStation: formattedRadioStationMock,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct SubmitButton text', () => {
      expect(wrapper.findComponent(SubmitButton).text()).toBe(
        'Update radio station',
      );
    });
  });

  describe('when form is invalid', () => {
    beforeEach(async () => {
      wrapper
        .findComponent({ ref: 'streamUrl' })
        .vm.$emit('update:modelValue', 'test.com');
      wrapper
        .findComponent({ ref: 'homepageUrl' })
        .vm.$emit('update:modelValue', 'https://www.test.com');
      await wrapper.trigger('submit');
    });

    it('does not emit submit event', () => {
      expect(wrapper.emitted('submit')).toBe(undefined);
    });
  });

  describe('when form is valid', () => {
    beforeEach(async () => {
      wrapper = factory();
      wrapper
        .findComponent({ ref: 'name' })
        .vm.$emit('update:modelValue', 'name');
      wrapper
        .findComponent({ ref: 'streamUrl' })
        .vm.$emit('update:modelValue', 'https://www.test.com');
      await wrapper.trigger('submit');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits submit event with form values', () => {
      expect(wrapper.emitted('submit')).toEqual([
        [
          {
            homepageUrl: '',
            name: 'name',
            streamUrl: 'https://www.test.com',
          },
        ],
      ]);
    });
  });
});

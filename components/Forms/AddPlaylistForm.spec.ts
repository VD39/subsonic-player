import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import InputField from '@/components/FormFields/InputField.vue';
import AddPlaylistForm from './AddPlaylistForm.vue';

function factory(props = {}) {
  return mount(AddPlaylistForm, {
    props: {
      ...props,
    },
  });
}

describe('AddPlaylistForm', () => {
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
      wrapper
        .findComponent(InputField)
        .vm.$emit('update:modelValue', 'Playlist');
      await wrapper.trigger('submit');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits submit event with form values', () => {
      expect(wrapper.emitted('submit')).toEqual([['Playlist']]);
    });
  });
});

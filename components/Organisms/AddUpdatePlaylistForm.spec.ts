import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import InputField from '@/components/Atoms/InputField.vue';
import SubmitButton from '@/components/Molecules/SubmitButton.vue';
import { formattedPlaylistMock } from '@/test/fixtures';

import AddUpdatePlaylistForm from './AddUpdatePlaylistForm.vue';

function factory(props = {}) {
  return mount(AddUpdatePlaylistForm, {
    props: {
      ...props,
    },
  });
}

describe('AddUpdatePlaylistForm', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when playlist prop is not set', () => {
    it('sets the correct SubmitButton text', () => {
      expect(wrapper.findComponent(SubmitButton).text()).toBe('Add playlist');
    });
  });

  describe('when playlist prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        playlist: formattedPlaylistMock,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct SubmitButton text', () => {
      expect(wrapper.findComponent(SubmitButton).text()).toBe(
        'Update playlist',
      );
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
      wrapper
        .findComponent(InputField)
        .vm.$emit('update:modelValue', 'Playlist');
      await wrapper.trigger('submit');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits submit event with the form values', () => {
      expect(wrapper.emitted('submit')).toEqual([['Playlist']]);
    });
  });
});

import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SelectableOption from './SelectableOption.vue';

function factory(props = {}) {
  return mount(SelectableOption, {
    props: {
      name: 'test',
      selected: false,
      title: 'title',
      ...props,
    },
  });
}

describe('SelectableOption', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the selected prop is false', () => {
    it('sets the correct checked property on the input element', () => {
      expect(
        (wrapper.find({ ref: 'inputRef' }).element as HTMLInputElement).checked,
      ).toBe(false);
    });
  });

  describe('when the selected prop is true', () => {
    beforeEach(() => {
      wrapper = factory({
        selected: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct checked property on the input element', () => {
      expect(
        (wrapper.find({ ref: 'inputRef' }).element as HTMLInputElement).checked,
      ).toBe(true);
    });
  });

  describe('when the badge prop is not set', () => {
    it('does not show the badge element', () => {
      expect(wrapper.find({ ref: 'badge' }).exists()).toBe(false);
    });
  });

  describe('when the badge prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        badge: 'badge',
      });
    });

    it('shows the badge element', () => {
      expect(wrapper.find({ ref: 'badge' }).exists()).toBe(true);
    });
  });

  describe('when the description prop is not set', () => {
    it('does not show the description element', () => {
      expect(wrapper.find({ ref: 'descriptionEl' }).exists()).toBe(false);
    });
  });

  describe('when the description prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        description: 'description',
      });
    });

    it('shows the description element', () => {
      expect(wrapper.find({ ref: 'descriptionEl' }).exists()).toBe(true);
    });
  });

  describe('when the click is triggered on the input', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'inputRef' }).trigger('change');
    });

    it('emits the click event', () => {
      expect(wrapper.emitted('click')).toEqual([[]]);
    });
  });
});

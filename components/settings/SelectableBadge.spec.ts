import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SelectableBadge from './SelectableBadge.vue';

function factory(props = {}) {
  return mount(SelectableBadge, {
    props: {
      label: 'label',
      name: 'test',
      selected: false,
      ...props,
    },
  });
}

describe('SelectableBadge', () => {
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

  describe('when the click is triggered on the input', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'inputRef' }).trigger('change');
    });

    it('emits the click event', () => {
      expect(wrapper.emitted('click')).toEqual([[]]);
    });
  });
});

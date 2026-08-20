import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ToggleSwitch from './ToggleSwitch.vue';

function factory(props = {}) {
  return mount(ToggleSwitch, {
    props: {
      label: 'label',
      pressed: false,
      ...props,
    },
  });
}

describe('ToggleSwitch', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the pressed prop is false', () => {
    it('sets the correct checked property on the input element', () => {
      expect(
        (wrapper.find({ ref: 'inputRef' }).element as HTMLInputElement).checked,
      ).toBe(false);
    });
  });

  describe('when the pressed prop is true', () => {
    beforeEach(() => {
      wrapper = factory({
        pressed: true,
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

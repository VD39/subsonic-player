import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

import AppUpdateModal from './AppUpdateModal.vue';

function factory(props = {}) {
  return mount(AppUpdateModal, {
    props: {
      ...props,
    },
  });
}

describe('AppUpdateModal', () => {
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

  it('sets the correct icon prop on the update ButtonLink component', () => {
    expect(
      wrapper.findComponent({ ref: 'updateButtonLink' }).props('icon'),
    ).toBe(undefined);
  });

  it('sets the correct slot data on the update ButtonLink component', () => {
    expect(wrapper.findComponent({ ref: 'updateButtonLink' }).text()).toContain(
      'Update',
    );
  });

  describe('when the update ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'updateButtonLink' }).vm.$emit('click');
    });

    it('emits the update event', () => {
      expect(wrapper.emitted('update')).toEqual([[]]);
    });

    it('updates the icon prop on the update ButtonLink component', () => {
      expect(
        wrapper.findComponent({ ref: 'updateButtonLink' }).props('icon'),
      ).toBe(SpinningLoader);
    });

    it('updates the slot data on the update ButtonLink component', () => {
      expect(
        wrapper.findComponent({ ref: 'updateButtonLink' }).text(),
      ).toContain('Reloading...');
    });
  });

  describe('when the dismiss ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'dismissButtonLink' }).vm.$emit('click');
    });

    it('emits the dismiss event', () => {
      expect(wrapper.emitted('dismiss')).toEqual([[]]);
    });
  });
});

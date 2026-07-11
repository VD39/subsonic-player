import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ConfirmDialog from './ConfirmDialog.vue';

function factory(props = {}) {
  return mount(ConfirmDialog, {
    props: {
      message: 'Are you sure?',
      ...props,
    },
  });
}

describe('ConfirmDialog', () => {
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

  it('displays the message text', () => {
    expect(wrapper.text()).toContain('Are you sure?');
  });

  describe('when the confirmText prop is not set', () => {
    it('sets the correct slot data on the confirm ButtonLink component', () => {
      expect(
        wrapper.findComponent({ ref: 'confirmButtonLink' }).text(),
      ).toContain('Confirm');
    });
  });

  describe('when the confirmText prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        confirmText: 'Delete',
      });
    });

    it('sets the correct slot data on the confirm ButtonLink component', () => {
      expect(
        wrapper.findComponent({ ref: 'confirmButtonLink' }).text(),
      ).toContain('Delete');
    });
  });

  describe('when the cancel ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ ref: 'cancelButtonLink' }).trigger('click');
    });

    it('emits the cancel event', () => {
      expect(wrapper.emitted('cancel')).toEqual([[]]);
    });
  });

  describe('when the confirm ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper
        .findComponent({ ref: 'confirmButtonLink' })
        .trigger('click');
    });

    it('emits the confirm event', () => {
      expect(wrapper.emitted('confirm')).toEqual([[]]);
    });
  });
});

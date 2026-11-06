import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import SettingsGroup from './SettingsGroup.vue';

function factory(props = {}, slots = {}) {
  return mount(SettingsGroup, {
    props: {
      variant: 'list',
      ...props,
    },
    slots,
  });
}

describe('SettingsGroup', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the title and description prop are not set', () => {
    it('does not show the titleDescriptionWrapper element', () => {
      expect(wrapper.find({ ref: 'titleDescriptionWrapper' }).exists()).toBe(
        false,
      );
    });
  });

  describe('when the title prop is not set', () => {
    it('does not show the title element', () => {
      expect(wrapper.find({ ref: 'titleEl' }).exists()).toBe(false);
    });
  });

  describe('when the title prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        title: 'title',
      });
    });

    it('shows the title element', () => {
      expect(wrapper.find({ ref: 'titleEl' }).exists()).toBe(true);
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

  describe('when the variant prop is list', () => {
    it('adds the list class to the slot container element', () => {
      expect(wrapper.find({ ref: 'slotContainer' }).classes()).toContain(
        'list',
      );
    });
  });

  describe('when the variant prop is badge', () => {
    beforeEach(() => {
      wrapper = factory({
        variant: 'badge',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the badge class to the slot container element', () => {
      expect(wrapper.find({ ref: 'slotContainer' }).classes()).toContain(
        'badge',
      );
    });
  });

  describe('when the default slot is set', () => {
    beforeEach(() => {
      wrapper = factory(
        {},
        {
          default: 'Slot content',
        },
      );
    });

    it('displays the correct slot content', () => {
      expect(wrapper.text()).toContain('Slot content');
    });
  });
});

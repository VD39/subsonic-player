import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from './ButtonLink.vue';

function factory(props = {}) {
  return mount(ButtonLink, {
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('ButtonLink', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe.each([
    [undefined, 'BUTTON', 'button'],
    ['nuxt-link', 'A', undefined],
    ['a', 'A', undefined],
  ])('when is prop is %s', (is, element, type) => {
    beforeEach(() => {
      wrapper = factory({
        is,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the correct element', () => {
      expect(wrapper.element.tagName).toBe(element);
    });

    it('sets the correct type attribute', () => {
      expect(wrapper.attributes('type')).toBe(type);
    });
  });

  describe('when fullWidth prop is not set', () => {
    it('does not add the fullWidth class', () => {
      expect(wrapper.classes()).not.toContain('fullWidth');
    });
  });

  describe('when fullWidth prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        fullWidth: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the fullWidth class', () => {
      expect(wrapper.classes()).toContain('fullWidth');
    });
  });

  describe('when icon prop is not set', () => {
    it('does not show the icon component', () => {
      expect(wrapper.find({ ref: 'iconComponent' }).exists()).toBe(false);
    });
  });

  describe('when icon prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        icon: ICONS.add,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the icon component', () => {
      expect(wrapper.find({ ref: 'iconComponent' }).exists()).toBe(true);
    });

    describe('when iconPosition prop is not set', () => {
      it('does not add the alignRight class', () => {
        expect(wrapper.classes()).not.toContain('alignRight');
      });
    });

    describe('when iconPosition prop is set to right', () => {
      beforeEach(() => {
        wrapper = factory({
          icon: ICONS.add,
          iconPosition: 'right',
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the alignRight class', () => {
        expect(wrapper.classes()).toContain('alignRight');
      });
    });
  });

  describe('when disabled prop is not set', () => {
    it('does not add the disabled class', () => {
      expect(wrapper.classes()).not.toContain('disabled');
    });

    it('sets the correct disabled attribute', async () => {
      expect(wrapper.attributes('disabled')).not.toBeDefined();
    });
  });

  describe('when disabled prop is set as true', () => {
    beforeEach(() => {
      wrapper = factory({
        disabled: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('adds the disabled class', () => {
      expect(wrapper.classes()).toContain('disabled');
    });

    it('sets the correct disabled attribute', async () => {
      expect(wrapper.attributes('disabled')).toBeDefined();
    });
  });

  describe('when showText prop is not set', () => {
    it('adds the visuallyHidden class to text', () => {
      expect(wrapper.find({ ref: 'text' }).classes()).toContain(
        'visuallyHidden',
      );
    });
  });

  describe('when showText prop is set to true', () => {
    beforeEach(() => {
      wrapper = factory({
        showText: true,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not add the visuallyHidden class to text', () => {
      expect(wrapper.find({ ref: 'text' }).classes()).not.toContain(
        'visuallyHidden',
      );
    });
  });

  describe('when component is clicked', () => {
    beforeEach(() => {
      wrapper.vm.$emit('click');
    });

    it('emits the click event', () => {
      expect(wrapper.emitted('click')).toEqual([[]]);
    });
  });

  describe('when component emits a keydown.down event', () => {
    beforeEach(() => {
      wrapper.vm.$emit('keydown.down');
    });

    it('emits the keypress event', () => {
      expect(wrapper.emitted('keydown.down')).toEqual([[]]);
    });
  });
});

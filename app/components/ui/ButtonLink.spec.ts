import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from './ButtonLink.vue';

function factory(props = {}, slots = {}) {
  return mount(ButtonLink, {
    props: {
      ...props,
    },
    slots: {
      default: 'Default slot content.',
      ...slots,
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

    it('sets the correct type attribute on the button element', () => {
      expect(wrapper.attributes('type')).toBe(type);
    });
  });

  describe('when the fullWidth prop is not set', () => {
    it('does not add the fullWidth class', () => {
      expect(wrapper.classes()).not.toContain('fullWidth');
    });
  });

  describe('when the fullWidth prop is set to true', () => {
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

  describe('when the icon prop is not set', () => {
    it('does not show the icon component', () => {
      expect(wrapper.find({ ref: 'iconComponent' }).exists()).toBe(false);
    });
  });

  describe('when the icon prop is set', () => {
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

    describe('when the iconPosition prop is not set', () => {
      it('does not add the alignRight class', () => {
        expect(wrapper.classes()).not.toContain('alignRight');
      });
    });

    describe('when the iconPosition prop is set to right', () => {
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

  describe('when the icon slot is provided', () => {
    beforeEach(() => {
      wrapper = factory(
        {},
        {
          icon: '<span>Custom icon</span>',
        },
      );
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the icon component', () => {
      expect(wrapper.find({ ref: 'iconComponent' }).exists()).toBe(false);
    });

    describe('when the iconPosition prop is not set', () => {
      it('does not add the alignRight class', () => {
        expect(wrapper.classes()).not.toContain('alignRight');
      });
    });

    describe('when the iconPosition prop is set to right', () => {
      beforeEach(() => {
        wrapper = factory(
          {
            iconPosition: 'right',
          },
          {
            icon: '<span>Custom icon</span>',
          },
        );
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('adds the alignRight class', () => {
        expect(wrapper.classes()).toContain('alignRight');
      });
    });
  });

  describe('when the disabled prop is not set', () => {
    it('does not add the disabled class', () => {
      expect(wrapper.classes()).not.toContain('disabled');
    });

    it('sets the correct disabled attribute on the button element', () => {
      expect(wrapper.attributes('disabled')).not.toBeDefined();
    });
  });

  describe('when the disabled prop is set as true', () => {
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

    it('sets the correct disabled attribute on the button element', () => {
      expect(wrapper.attributes('disabled')).toBeDefined();
    });
  });

  describe('when the showText prop is not set', () => {
    it('adds the visuallyHidden class to text', () => {
      expect(wrapper.find({ ref: 'text' }).classes()).toContain(
        'visuallyHidden',
      );
    });
  });

  describe('when the showText prop is set to true', () => {
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
    const clickMock = vi.fn();

    beforeEach(async () => {
      wrapper = factory({
        onClick: clickMock,
      });

      await wrapper.trigger('click');
    });

    it('calls the click listener', () => {
      expect(clickMock).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe('when component receives a keydown event', () => {
    const keydownMock = vi.fn();

    beforeEach(async () => {
      wrapper = factory({
        onKeydown: keydownMock,
      });

      await wrapper.trigger('keydown', {
        key: 'ArrowDown',
      });
    });

    it('calls the keydown listener', () => {
      expect(keydownMock).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });
  });
});

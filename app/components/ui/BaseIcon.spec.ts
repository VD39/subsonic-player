import type { VueWrapper } from '@vue/test-utils';

import { IconHeart } from '@tabler/icons-vue';
import { mount } from '@vue/test-utils';

import SpinningLoader from '@/components/notification/SpinningLoader.vue';

import BaseIcon from './BaseIcon.vue';

function factory(props = {}) {
  return mount(BaseIcon, {
    global: {
      components: {
        [ICONS.favourite]: IconHeart,
      },
    },
    props: {
      icon: ICONS.favourite,
      ...props,
    },
  });
}

describe('BaseIcon', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the icon component', () => {
    expect(wrapper.findComponent(IconHeart).exists()).toBe(true);
  });

  describe('when the fill prop is not set', () => {
    it('sets the correct fill attribute on the icon element', () => {
      expect(wrapper.attributes('fill')).toBe('none');
    });
  });

  describe('when the fill prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        fill: 'red',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct fill attribute on the icon element', () => {
      expect(wrapper.attributes('fill')).toBe('red');
    });
  });

  describe('when the stroke prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        stroke: 'blue',
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct stroke attribute on the icon element', () => {
      expect(wrapper.attributes('stroke')).toBe('blue');
    });
  });

  describe('when the size prop is set', () => {
    beforeEach(() => {
      wrapper = factory({
        size: ICON_SIZE.large,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct width attribute on the icon element', () => {
      expect(wrapper.attributes('width')).toBe(ICON_SIZE.large.toString());
    });
  });

  describe('when the icon prop is a component', () => {
    beforeEach(() => {
      wrapper = factory({
        fill: 'red',
        icon: markRaw(SpinningLoader),
        size: ICON_SIZE.large,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the SpinningLoader component', () => {
      expect(wrapper.findComponent(SpinningLoader).exists()).toBe(true);
    });

    it('sets the correct size prop on the SpinningLoader component', () => {
      expect(wrapper.findComponent(SpinningLoader).props('size')).toBe(
        ICON_SIZE.large,
      );
    });
  });
});

import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import IconImage from './IconImage.vue';

function factory(props = {}) {
  return mount(IconImage, {
    props: {
      icon: ICONS.add,
      ...props,
    },
  });
}

describe('IconImage', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct icon', () => {
    expect(
      (wrapper.find({ ref: 'iconComponent' }).element as HTMLElement).tagName,
    ).toBe(ICONS.add.toUpperCase());
  });
});

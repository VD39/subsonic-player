import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import DefaultImage from './DefaultImage.vue';

function factory(props = {}) {
  return mount(DefaultImage, {
    props: {
      icon: 'icon',
      ...props,
    },
  });
}

describe('DefaultImage', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct element', () => {
    expect(
      (wrapper.find({ ref: 'iconComponent' }).element as HTMLElement).tagName,
    ).toBe('ICON');
  });
});

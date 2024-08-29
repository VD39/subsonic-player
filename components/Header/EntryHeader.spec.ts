import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import PreloadImage from '@/components/Image/PreloadImage.vue';
import EntryHeader from './EntryHeader.vue';

function factory(props = {}) {
  return mount(EntryHeader, {
    props: {
      images: ['image'],
      title: 'title',
      ...props,
    },
    slots: {
      default: 'Default slot',
    },
  });
}

describe('EntryHeader', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the first PreloadImage component with the correct image prop', () => {
    expect(wrapper.findComponent(PreloadImage).props('image')).toBe('image');
  });

  it('shows the slot content', () => {
    expect(wrapper.html()).toContain('Default slot');
  });

  describe('when there are three images', () => {
    beforeAll(() => {
      wrapper = factory({
        images: ['image', 'image1', 'image2'],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the correct number of PreloadImage components', () => {
      expect(wrapper.findAll('[data-test-id="image"]').length).toBe(3);
    });
  });
});

import type { VueWrapper } from '@vue/test-utils';

import PreloadImage from '@/components/Molecules/PreloadImage.vue';
import { mount } from '@vue/test-utils';

import EntryHeader from './EntryHeader.vue';

function factory(props = {}) {
  return mount(EntryHeader, {
    props: {
      images: ['image'],
      title: 'title',
      ...props,
    },
    slots: {
      default: 'Default slot content.',
    },
  });
}

describe('EntryHeader', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the first PreloadImage component with the correct image prop', () => {
    expect(wrapper.findComponent(PreloadImage).props('image')).toBe('image');
  });

  describe('when there are three images', () => {
    beforeEach(() => {
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

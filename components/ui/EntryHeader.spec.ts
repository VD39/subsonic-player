import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import PreloadImage from '@/components/media/PreloadImage.vue';
import { useRouterMock } from '@/test/useRouterMock';

import EntryHeader from './EntryHeader.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const { routerMock } = useRouterMock();

mockNuxtImport('useNuxtApp', (original) => () => ({
  ...original(),
  $router: routerMock,
}));

let onDragStartMock: ((event: DragEvent) => unknown) | undefined;

function factory(props = {}) {
  return mount(EntryHeader, {
    props: {
      images: ['image'],
      onDragStart: onDragStartMock,
      title: 'title',
      ...props,
    },
    slots: {
      actions: 'Actions slot content.',
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

  it('sets the correct image prop on the PreloadImage component', () => {
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

    it('shows the correct number of the PreloadImage component', () => {
      expect(wrapper.findAll('[data-test-id="image"]')).toHaveLength(3);
    });
  });

  describe('when the onDragStart event is not attached', () => {
    it('sets the correct draggable attribute on the figure element', () => {
      expect(wrapper.find({ ref: 'figure' }).attributes('draggable')).toBe(
        'false',
      );
    });

    describe('when a track item is dragged', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'figure' }).trigger('dragstart');
      });

      it('does not emit the dragStart event', () => {
        expect(wrapper.emitted('dragStart')).toBeUndefined();
      });
    });
  });

  describe('when the onDragStart event is attached', () => {
    beforeEach(() => {
      onDragStartMock = vi.fn();
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct draggable attribute on the figure element', () => {
      expect(wrapper.find({ ref: 'figure' }).attributes('draggable')).toBe(
        'true',
      );
    });

    describe('when a track item is dragged', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'figure' }).trigger('dragstart');
      });

      it('emits the dragStart event', () => {
        expect(wrapper.emitted('dragStart')).toEqual([[expect.any(DragEvent)]]);
      });
    });
  });
});

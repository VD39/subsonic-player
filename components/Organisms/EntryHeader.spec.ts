import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import PreloadImage from '@/components/Molecules/PreloadImage.vue';

import EntryHeader from './EntryHeader.vue';

let onDragStartMock: typeof vi.fn | undefined = undefined;

vi.mock('vue', async () => {
  const vue = await vi.importActual<typeof import('vue')>('vue');

  return {
    ...vue,
    getCurrentInstance: vi.fn(() => ({
      ...vue.getCurrentInstance(),
      vnode: {
        props: {
          onDragStart: onDragStartMock,
        },
      },
    })),
  };
});

function factory(props = {}) {
  return mount(EntryHeader, {
    props: {
      images: ['image'],
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

  describe('when the onDragStart event is not attached', () => {
    it('sets the correct draggable attribute value on figure element', () => {
      expect(wrapper.find({ ref: 'figure' }).attributes('draggable')).toBe(
        'false',
      );
    });

    describe('when a track item is dragged', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'figure' }).trigger('dragstart');
      });

      it('does not emit the dragStart event', () => {
        expect(wrapper.emitted('dragStart')).toBe(undefined);
      });
    });
  });

  describe('when the onDragStart event is attached', () => {
    beforeEach(() => {
      onDragStartMock = vi.fn();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct draggable attribute value on figure element', () => {
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

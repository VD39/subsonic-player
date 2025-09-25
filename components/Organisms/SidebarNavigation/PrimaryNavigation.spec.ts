import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import SubNavigationItem from './Items/SubNavigationItem.vue';
import PrimaryNavigation from './PrimaryNavigation.vue';

const dropMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  drop: dropMock,
}));

function factory(props = {}) {
  return mount(PrimaryNavigation, {
    props: {
      collapsed: false,
      ...props,
    },
  });
}

describe('PrimaryNavigation', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when item isDroppable is true', () => {
    it(`adds the ${DRAG_AND_DROP_CLASS_NAMES.isDroppable} class to the SubNavigationItem component`, () => {
      expect(
        wrapper.findAllComponents(SubNavigationItem)[3].classes(),
      ).toContain(DRAG_AND_DROP_CLASS_NAMES.isDroppable);
    });
  });

  describe('when item isDroppable is false', () => {
    it(`does not add the ${DRAG_AND_DROP_CLASS_NAMES.isDroppable} class to the SubNavigationItem component`, () => {
      expect(
        wrapper.findAllComponents(SubNavigationItem)[0].classes(),
      ).not.toContain(DRAG_AND_DROP_CLASS_NAMES.isDroppable);
    });
  });

  describe('when the SubNavigationItem component calls the drop action', () => {
    beforeEach(async () => {
      await wrapper.findComponent(SubNavigationItem).trigger('drop');
    });

    it('calls the drop function with the correct parameters', () => {
      expect(dropMock).toHaveBeenCalledWith(QUEUE_ID, expect.any(DragEvent));
    });
  });
});

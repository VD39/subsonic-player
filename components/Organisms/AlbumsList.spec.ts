import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';
import { gridWrapperPropsMock } from '@/test/fixtures';
import { getFormattedAlbumsMock } from '@/test/helpers';

import AlbumsList from './AlbumsList.vue';

const viewLayoutMock = ref<Layout>('gridLayout');

mockNuxtImport('useViewLayout', () => () => ({
  viewLayout: viewLayoutMock,
}));

const albums = getFormattedAlbumsMock(5);
const album = albums[0];

function factory(props = {}) {
  return mount(AlbumsList, {
    props: {
      albums: [],
      ...props,
    },
  });
}

describe('AlbumsList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when albums prop is an empty array', () => {
    it('does not show the GridWrapper component', () => {
      expect(wrapper.findComponent(GridWrapper).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when albums prop is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        albums,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the GridWrapper component', () => {
      expect(wrapper.findComponent(GridWrapper).exists()).toBe(true);
    });

    it('shows the correct number of the AlbumItem component', () => {
      expect(wrapper.findAllComponents(AlbumItem).length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe.each([
      ['gridLayout', gridWrapperPropsMock.gridView],
      ['listLayout', gridWrapperPropsMock.listView],
    ])('when viewLayout is %s', (layout, expectedProps) => {
      beforeEach(() => {
        viewLayoutMock.value = layout as Layout;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct desktop prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('desktop')).toBe(
          expectedProps.desktop,
        );
      });

      it('sets the correct mobile prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('mobile')).toBe(
          expectedProps.mobile,
        );
      });

      it('sets the correct spacing prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('spacing')).toBe(
          expectedProps.spacing,
        );
      });

      it('sets the correct tablet prop on the GridWrapper component', () => {
        expect(wrapper.findComponent(GridWrapper).props('tablet')).toBe(
          expectedProps.tablet,
        );
      });

      describe('when am album item is dragged', () => {
        beforeEach(async () => {
          await wrapper.findComponent(AlbumItem).trigger('dragstart');
        });

        it('emits the dragStart event', () => {
          expect(wrapper.emitted('dragStart')).toEqual([
            [album, expect.any(DragEvent)],
          ]);
        });
      });
    });
  });
});

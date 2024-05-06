import type { VueWrapper } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import IconButton from '@/components/Buttons/IconButton.vue';
import AddNewPlaylist from './AddNewPlaylist.vue';

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: openModalMock,
  closeModal: vi.fn(),
}));

const collapsedMock = ref(false);

mockNuxtImport('useSidebar', () => () => ({
  collapsed: collapsedMock,
}));

function factory(props = {}) {
  return mount(AddNewPlaylist, {
    props: {
      ...props,
    },
  });
}

describe('AddNewPlaylist', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when collapsed value is false', () => {
    it('sets the correct show-text prop on the IconButton component', () => {
      expect(wrapper.findComponent(IconButton).props('showText')).toBe(true);
    });
  });

  describe('when collapsed value is true', () => {
    beforeEach(() => {
      collapsedMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('sets the correct show-text prop on the IconButton component', () => {
      expect(wrapper.findComponent(IconButton).props('showText')).toBe(false);
    });
  });

  describe('when the IconButton component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent(IconButton).vm.$emit('click');
    });

    it('calls the openModal function', () => {
      expect(openModalMock).toHaveBeenCalled();
    });
  });
});

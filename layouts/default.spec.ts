import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import IconButton from '@/components/Buttons/IconButton.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import MainLoader from '@/components/Loaders/MainLoader.vue';
import DefaultLayout from './default.vue';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const userMock = vi.hoisted(() => vi.fn(() => ref<null | User>(null)));

mockNuxtImport('useUser', () => userMock);

const loadingMock = ref(false);

mockNuxtImport('useLoading', () => () => loadingMock);

function factory(props = {}) {
  return mount(DefaultLayout, {
    props: {
      ...props,
    },
    slots: {
      default: '<div></div>',
    },
    attachTo: document.body,
  });
}

describe('Default', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the style on the header element', () => {
    expect(wrapper.find('header').attributes('style')).toBe(
      'margin-left: 16rem;',
    );
  });

  it('sets the style on the main element', () => {
    expect(wrapper.find('main').attributes('style')).toBe(
      'margin-left: 16rem;',
    );
  });

  describe('when user is not defined', () => {
    it('does not show the user section', () => {
      expect(wrapper.find({ ref: 'userDetails' }).exists()).toBe(false);
    });
  });

  describe('when user is defined', () => {
    beforeEach(() => {
      userMock.mockReturnValue(
        ref({
          salt: 'salt',
          server: 'server',
          token: 'token',
          username: 'username',
        }),
      );
      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the user section', () => {
      expect(wrapper.find({ ref: 'userDetails' }).exists()).toBe(true);
    });

    describe('when DropdownMenu button is clicked', () => {
      beforeEach(async () => {
        wrapper
          .findComponent(DropdownMenu)
          .findComponent(IconButton)
          .vm.$emit('click');
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the DropdownItem components', () => {
        expect(wrapper.findAllComponents(DropdownItem).length).toBe(3);
      });

      describe('when the logout button is clicked', () => {
        beforeEach(async () => {
          wrapper.findComponent({ ref: 'logoutButton' }).vm.$emit('click');
          await wrapper.vm.$nextTick();
        });

        it('calls the navigateTo function', () => {
          expect(navigateToMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when loading is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MainLoader component', () => {
      expect(wrapper.findComponent(MainLoader).isVisible()).toBe(false);
    });

    it('shows the main content', () => {
      expect(wrapper.find({ ref: 'mainContent' }).isVisible()).toBe(true);
    });
  });

  describe('when loading is true', () => {
    beforeEach(() => {
      loadingMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the MainLoader component', () => {
      expect(wrapper.findComponent(MainLoader).isVisible()).toBe(true);
    });

    it('does not show the main content', () => {
      expect(wrapper.find({ ref: 'mainContent' }).isVisible()).toBe(false);
    });
  });
});

import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import IconButton from '@/components/Buttons/IconButton.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import MainLoader from '@/components/Loaders/MainLoader.vue';
import SearchForm from '@/components/Forms/SearchForm.vue';
import MusicPlayer from '@/components/Player/MusicPlayer.vue';
import DefaultLayout from './default.vue';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const userMock = vi.hoisted(() => vi.fn(() => ref<null | User>(null)));

mockNuxtImport('useUser', () => userMock);

const loadingMock = vi.hoisted(() => vi.fn(() => ref(false)));

mockNuxtImport('useLoading', () => loadingMock);

const logoutMock = vi.fn();

mockNuxtImport('useAuth', () => () => ({
  logout: logoutMock,
}));

const { showMediaPlayerMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(DefaultLayout, {
    props: {
      ...props,
    },
    slots: {
      default: '<div></div>',
    },
    global: {
      stubs: {
        MusicPlayer: true,
      },
    },
    attachTo: document.body,
  });
}

describe('Default', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
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

        it('calls the logoutMock function', () => {
          expect(logoutMock).toHaveBeenCalled();
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
      loadingMock.mockReturnValue(ref(true));
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

  describe('when showMediaPlayer is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MusicPlayer component', () => {
      expect(wrapper.findComponent(MusicPlayer).exists()).toBe(false);
    });
  });

  describe('when showMediaPlayer is true', () => {
    beforeEach(async () => {
      showMediaPlayerMock.value = true;
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the MusicPlayer component', () => {
      expect(wrapper.findComponent(MusicPlayer).exists()).toBe(true);
    });
  });

  describe('when SearchForm component emits search events', () => {
    beforeEach(async () => {
      wrapper.findComponent(SearchForm).vm.$emit('submit', 'query');
      await wrapper.vm.$nextTick();
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith('/search/albums/query');
    });
  });
});

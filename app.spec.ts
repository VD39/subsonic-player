import type { VueWrapper } from '@vue/test-utils';
import type { RuntimeNuxtHooks } from 'nuxt/app';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import MainLoader from '@/components/Atoms/MainLoader.vue';
import { useRouterMock } from '@/test/useRouterMock';

import App from './app.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const hookEvents = {} as Record<keyof RuntimeNuxtHooks, () => void>;

const needRefreshMock = ref(false);
const { cancelPromptMock, updateServiceWorkerMock } = vi.hoisted(() => ({
  cancelPromptMock: vi.fn(),
  updateServiceWorkerMock: vi.fn(),
}));

const { routerMock } = useRouterMock();

mockNuxtImport('useNuxtApp', (original) => () => ({
  ...original(),
  $pwa: reactive({
    cancelPrompt: cancelPromptMock,
    needRefresh: needRefreshMock,
    updateServiceWorker: updateServiceWorkerMock,
  }),
  $router: routerMock,
  hook: vi.fn().mockImplementation((event, cb) => {
    hookEvents[event as keyof RuntimeNuxtHooks] = cb;
  }),
  runWithContext: vi.fn(),
}));

mockNuxtImport('useSidebar', (original) => () => ({
  ...original(),
  width: ref(100),
}));

mockNuxtImport('useSettings', (original) => () => ({
  ...original(),
  isDarkTheme: ref(false),
}));

const { closeModalMock, openModalMock } = vi.hoisted(() => ({
  closeModalMock: vi.fn(),
  openModalMock: vi.fn(),
}));

mockNuxtImport('useModal', (original) => () => ({
  ...original(),
  closeModal: closeModalMock,
  openModal: openModalMock,
}));

mockNuxtImport('useQueue', (original) => () => ({
  ...original(),
  hasQueueTracks: ref(false),
}));

mockNuxtImport('useHead', () => () => vi.fn());

function factory() {
  return mount(App, {
    global: {
      stubs: {
        ModalWindow: true,
        NuxtLayout: {
          template: '<div><slot /></div>',
        },
        NuxtPage: true,
        NuxtPwaAssets: true,
        SnackBar: true,
      },
    },
  });
}

describe('App', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    needRefreshMock.value = false;
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when page:finish event has not emitted', () => {
    it('shows the MainLoader component', () => {
      expect(wrapper.findComponent(MainLoader).exists()).toBe(true);
    });
  });

  describe('when page:finish event is emitted', () => {
    beforeEach(() => {
      hookEvents['page:finish']();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('hides the MainLoader component', () => {
      expect(wrapper.findComponent(MainLoader).exists()).toBe(false);
    });
  });

  describe('when the $pwa needRefresh property is false', () => {
    it('does not call the openModal function', () => {
      expect(openModalMock).not.toHaveBeenCalled();
    });
  });

  describe('when the $pwa needRefresh property is true', () => {
    let handlers: Record<string, (...args: unknown[]) => Promise<void> | Ref>;

    beforeEach(async () => {
      needRefreshMock.value = true;

      await nextTick();

      handlers = openModalMock.mock.calls[0][1];
    });

    it('calls the openModal function with the correct parameters', () => {
      expect(openModalMock).toHaveBeenCalledWith(MODAL_TYPE.appUpdateModal, {
        onDismiss: expect.any(Function),
        onModalClose: expect.any(Function),
        onUpdate: expect.any(Function),
      });
    });

    describe('when the onDismiss handler is called', () => {
      beforeEach(() => {
        handlers.onDismiss();
      });

      it('calls the closeModal function', () => {
        expect(closeModalMock).toHaveBeenCalled();
      });
    });

    describe('when the onModalClose handler is called', () => {
      beforeEach(() => {
        handlers.onModalClose();
      });

      it('calls the cancelPrompt function', () => {
        expect(cancelPromptMock).toHaveBeenCalled();
      });
    });

    describe('when the onUpdate handler is called', () => {
      beforeEach(() => {
        handlers.onUpdate();
      });

      it('calls the updateServiceWorker function', () => {
        expect(updateServiceWorkerMock).toHaveBeenCalled();
      });
    });
  });
});

import type { VueWrapper } from '@vue/test-utils';
import type { RuntimeNuxtHooks } from 'nuxt/app';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import MainLoader from '@/components/Atoms/MainLoader.vue';

import App from './app.vue';

const hookEvents = {} as Record<keyof RuntimeNuxtHooks, () => void>;

const needRefreshMock = ref(false);
const cancelPromptMock = vi.fn();
const updateServiceWorkerMock = vi.fn();

mockNuxtImport('useNuxtApp', () => () => ({
  $pwa: reactive({
    cancelPrompt: cancelPromptMock,
    needRefresh: needRefreshMock,
    updateServiceWorker: updateServiceWorkerMock,
  }),
  hook: vi.fn().mockImplementation((event, cb) => {
    hookEvents[event as keyof RuntimeNuxtHooks] = cb;
  }),
  payload: {},
  runWithContext: vi.fn(),
}));

const closeModalMock = vi.fn();
const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  closeModal: closeModalMock,
  openModal: openModalMock,
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

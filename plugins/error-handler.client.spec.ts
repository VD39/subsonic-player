import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import errorHandlerPlugin from './error-handler.client';

const logErrorMock = vi.fn();

mockNuxtImport('useErrorHandler', () => () => ({
  logError: logErrorMock,
}));

let vueErrorCallback: (error: unknown) => void;

const nuxtApp = {
  hook: vi.fn((_event, cb) => {
    vueErrorCallback = cb;
  }),
} as never;

let unhandledRejectionCallback: (event: Event) => void;

const addEventListenerSpy = vi
  .spyOn(globalThis, 'addEventListener')
  .mockImplementation((event, cb) => {
    if (event === 'unhandledrejection') {
      unhandledRejectionCallback = cb as (event: Event) => void;
    }
  });

describe('error-handler plugin', () => {
  beforeEach(() => {
    errorHandlerPlugin(nuxtApp);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('registers the vue:error hook', () => {
    expect(vueErrorCallback).toBeDefined();
  });

  it('adds the unhandledrejection event listener', () => {
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'unhandledrejection',
      expect.any(Function),
    );
  });

  it('sets the globalThis.onerror handler', () => {
    expect(globalThis.onerror).toEqual(expect.any(Function));
  });

  describe('when the vue:error hook is triggered', () => {
    beforeEach(() => {
      vueErrorCallback(new Error('test error'));
    });

    it('calls the logError function with the correct parameters', () => {
      expect(logErrorMock).toHaveBeenCalledWith(
        new Error('test error'),
        'vue:error',
      );
    });
  });

  describe('when an unhandledrejection event is fired', () => {
    let preventDefaultMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      preventDefaultMock = vi.fn();

      unhandledRejectionCallback({
        preventDefault: preventDefaultMock,
        reason: new Error('rejection error'),
      } as unknown as Event);
    });

    it('calls the logError function with the correct parameters', () => {
      expect(logErrorMock).toHaveBeenCalledWith(
        new Error('rejection error'),
        'unhandledRejection',
      );
    });

    it('calls the preventDefault function on the event', () => {
      expect(preventDefaultMock).toHaveBeenCalled();
    });
  });

  describe('when the globalThis.onerror handler is triggered', () => {
    beforeEach(() => {
      (globalThis.onerror as unknown as (...args: unknown[]) => void)(
        'message',
        'source.js',
        1,
        2,
        new Error('onerror test'),
      );
    });

    it('calls the logError function with the correct parameters', () => {
      expect(logErrorMock).toHaveBeenCalledWith(
        new Error('onerror test'),
        'window.onerror',
      );
    });
  });
});

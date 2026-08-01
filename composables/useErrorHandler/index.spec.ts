import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useErrorHandler } from './index';

const addErrorSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addErrorSnack: addErrorSnackMock,
}));

const { handleError, logError } = useErrorHandler();

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('useErrorHandler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the logError function is called', () => {
    describe('when the source is set', () => {
      beforeEach(() => {
        logError(new Error('test'), 'source');
      });

      it('calls the console.error function with the correct parameters', () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[source]',
          expect.any(Error),
        );
      });

      it('calls the console.error function with the friendly error message', () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('test');
      });
    });

    describe('when the source is not set', () => {
      beforeEach(() => {
        logError(new Error('test'));
      });

      it('calls the console.error function with the correct parameters', () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      it('calls the console.error function with the friendly error message', () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('test');
      });
    });
  });

  describe('when the handleError function is called', () => {
    describe('when the error is an Error instance', () => {
      beforeEach(() => {
        handleError(new Error('404'));
      });

      it('calls the addErrorSnack function with the correct parameters', () => {
        expect(addErrorSnackMock).toHaveBeenCalledWith(
          'The requested resource was not found. Please try again later.',
        );
      });
    });

    describe('when the error is a string', () => {
      beforeEach(() => {
        handleError('Something went wrong.');
      });

      it('calls the addErrorSnack function with the correct parameters', () => {
        expect(addErrorSnackMock).toHaveBeenCalledWith('Something went wrong.');
      });
    });

    describe('when the error is an object with a message property', () => {
      beforeEach(() => {
        handleError({
          message: 'timeout',
        });
      });

      it('calls the addErrorSnack function with the correct parameters', () => {
        expect(addErrorSnackMock).toHaveBeenCalledWith(
          'A network error occurred. Please check your connection and try again.',
        );
      });
    });
  });
});

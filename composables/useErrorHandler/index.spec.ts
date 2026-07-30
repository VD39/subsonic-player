import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useErrorHandler } from './index';

const addErrorSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addErrorSnack: addErrorSnackMock,
}));

const { handleError } = useErrorHandler();

describe('useErrorHandler', () => {
  afterEach(() => {
    vi.clearAllMocks();
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

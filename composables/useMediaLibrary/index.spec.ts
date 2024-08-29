import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { DataMock } from '@/test/types';
import { useMediaLibrary } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const addSuccessSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addSuccessSnack: addSuccessSnackMock,
}));

const { startScan } = useMediaLibrary();

describe('useMediaLibrary', () => {
  describe('when the startScan function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeAll(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        startScan();
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeAll(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        startScan();
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith('Scan started.');
      });
    });
  });
});

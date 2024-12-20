import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useMediaLibrary } from './index';

const windowLocationAssignSpy = vi.spyOn(window.location, 'assign');

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
  getDownloadUrl: vi.fn((path) => path),
}));

const addSuccessSnackMock = vi.fn();

mockNuxtImport('useSnack', () => () => ({
  addSuccessSnack: addSuccessSnackMock,
}));

const { downloadMedia, startScan } = useMediaLibrary();

describe('useMediaLibrary', () => {
  describe('when the downloadMedia function is called', () => {
    beforeEach(() => {
      downloadMedia('download-id');
    });

    it('calls the window.location.assign with the correct value', () => {
      expect(windowLocationAssignSpy).toHaveBeenCalledWith('download-id');
    });
  });

  describe('when the startScan function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
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
      beforeEach(() => {
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

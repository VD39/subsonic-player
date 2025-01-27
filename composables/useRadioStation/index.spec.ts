import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useRadioStation } from './index';

const refreshMock = vi.fn();

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

const {
  addRadioStation,
  deleteRadioStation,
  getRadioStations,
  updateRadioStation,
} = useRadioStation();

describe('useRadioStation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the getPodcasts function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await getRadioStations()).toEqual([]);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: [
            {
              name: 'name',
            },
          ],
        });
      });

      it('returns the correct response', async () => {
        expect(await getRadioStations()).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the addRadioStation function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        addRadioStation({} as RadioStationParams);
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValueOnce({
          data: {
            name: 'radio-station-name',
          },
        });

        addRadioStation({
          name: 'radio-station-name',
        } as RadioStationParams);
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully added radio station radio-station-name.',
        );
      });
    });
  });

  describe('when the updateRadioStation function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        updateRadioStation({} as RadioStationParams);
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValueOnce({
          data: {
            name: 'radio-station-update-name',
          },
        });

        updateRadioStation({
          name: 'radio-station-update-name',
        } as RadioStationParams);
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully updated radio station radio-station-update-name.',
        );
      });
    });
  });

  describe('when the deleteRadioStation function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        deleteRadioStation('id', refreshMock);
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the refresh function', () => {
        expect(refreshMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValueOnce({
          data: {
            name: 'radio-station-update-name',
          },
        });

        deleteRadioStation('id', refreshMock);
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted radio station.',
        );
      });

      it('calls the refresh function', () => {
        expect(refreshMock).toHaveBeenCalled();
      });
    });
  });
});

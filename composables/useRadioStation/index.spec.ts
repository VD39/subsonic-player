import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { useRadioStation } from './index';

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
  radioStations,
  updateRadioStation,
} = useRadioStation();

describe('useRadioStation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default radioStations value', () => {
    expect(radioStations.value).toEqual([]);
  });

  describe('when the getRadioStations function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        getRadioStations();
      });

      it('sets the correct radioStations value', () => {
        expect(radioStations.value).toEqual([]);
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

        getRadioStations();
      });

      it('sets the correct radioStations value', () => {
        expect(radioStations.value).toEqual([
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

      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getRadioStations function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
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

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully added radio station radio-station-name.',
        );
      });

      it('calls the getRadioStations function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the updateRadioStation function is called', () => {
    describe('when the homepageUrl param is falsy', () => {
      beforeEach(() => {
        updateRadioStation({ homepageUrl: '' } as RadioStationParams);
      });

      it('calls the fetch function without homepageUrl key in query', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/updateInternetRadioStation',
          expect.objectContaining({
            query: {},
          }),
        );
      });
    });

    describe('when the homepageUrl param is not falsy', () => {
      beforeEach(() => {
        updateRadioStation({
          homepageUrl: 'homepageUrl',
        } as RadioStationParams);
      });

      it('calls the fetch function with homepageUrl key in query', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/updateInternetRadioStation',
          expect.objectContaining({
            query: {
              homepageUrl: 'homepageUrl',
            },
          }),
        );
      });
    });

    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        updateRadioStation({} as RadioStationParams);
      });

      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getRadioStations function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
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

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully updated radio station radio-station-update-name.',
        );
      });

      it('calls the getRadioStations function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
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

        deleteRadioStation('id');
      });

      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getRadioStations function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValueOnce({
          data: {
            name: 'radio-station-update-name',
          },
        });

        deleteRadioStation('id');
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted radio station.',
        );
      });

      it('calls the getRadioStations function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
      });
    });
  });
});

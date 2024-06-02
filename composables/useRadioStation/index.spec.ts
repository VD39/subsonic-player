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

  describe('when the getPodcasts function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        getRadioStations();
      });

      it('does not add to the radioStations value', () => {
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

      it('adds to the radioStations value', () => {
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
        radioStations.value = [];
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        addRadioStation({} as RadioStationParams);
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalledWith();
      });

      it('does not add to the radioStations value', () => {
        expect(radioStations.value).toEqual([]);
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: {
              name: 'radio-station-name',
            },
          })
          .mockResolvedValueOnce({
            data: [
              {
                name: 'radio-station-name',
              },
            ],
          });

        addRadioStation({
          name: 'radio-station-name',
        } as RadioStationParams);
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully added playlist radio-station-name.',
        );
      });

      it('adds to the radioStations value', () => {
        expect(radioStations.value).toEqual([
          {
            name: 'radio-station-name',
          },
        ]);
      });

      it('calls the fetchData function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the updateRadioStation function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        radioStations.value = [];
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        updateRadioStation({} as RadioStationParams);
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalledWith();
      });

      it('does not add to the radioStations value', () => {
        expect(radioStations.value).toEqual([]);
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: {
              name: 'radio-station-update-name',
            },
          })
          .mockResolvedValueOnce({
            data: [
              {
                name: 'radio-station-update-name',
              },
            ],
          });

        updateRadioStation({
          name: 'radio-station-update-name',
        } as RadioStationParams);
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully updated playlist radio-station-update-name.',
        );
      });

      it('adds to the radioStations value', () => {
        expect(radioStations.value).toEqual([
          {
            name: 'radio-station-update-name',
          },
        ]);
      });

      it('calls the fetchData function', () => {
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
        radioStations.value = [];
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        deleteRadioStation('id');
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalledWith();
      });

      it('does not add to the radioStations value', () => {
        expect(radioStations.value).toEqual([]);
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: {
              name: 'radio-station-update-name',
            },
          })
          .mockResolvedValueOnce({
            data: [],
          });

        deleteRadioStation('id');
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted playlist.',
        );
      });

      it('adds to the radioStations value', () => {
        expect(radioStations.value).toEqual([]);
      });

      it('calls the fetchData function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getInternetRadioStations',
          expect.any(Object),
        );
      });
    });
  });
});

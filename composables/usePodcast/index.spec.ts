import type { DataMock } from '@/test/types';

import { usePodcastPodcastValueMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { usePodcast } from './index';

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
  addPodcast,
  deletePodcast,
  deletePodcastEpisode,
  downloadPodcastEpisode,
  getNewestPodcasts,
  getPodcasts,
  sortPodcasts,
} = usePodcast();

describe('usePodcast', () => {
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
        expect(await getPodcasts()).toEqual([]);
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
        expect(await getPodcasts()).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the addPodcast function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        addPodcast('url');
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

        addPodcast('url');
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully added podcast.',
        );
      });
    });
  });

  describe('when the deletePodcast function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        deletePodcast('id', refreshMock);
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      describe('when refresh function is passed', () => {
        it('does not call the refresh function', () => {
          expect(refreshMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        deletePodcast('id', refreshMock);
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted podcast.',
        );
      });

      describe('when refresh function is passed', () => {
        it('calls the refresh function', () => {
          expect(refreshMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the deletePodcastEpisode function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        deletePodcastEpisode('id');
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

        deletePodcastEpisode('id');
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted podcast episode from server.',
        );
      });
    });
  });

  describe('when the downloadPodcastEpisode function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        downloadPodcastEpisode('id');
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

        downloadPodcastEpisode('id');
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Download has begun on the server.',
        );
      });
    });
  });

  describe('when the getNewestPodcasts function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await getNewestPodcasts()).toEqual([]);
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
        expect(await getNewestPodcasts()).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the sortPodcasts function is called', () => {
    describe(`when sortBy is ${ROUTE_PODCASTS_SORT_BY_PARAMS.Recent}`, () => {
      it('returns the correct response', () => {
        expect(
          sortPodcasts(
            usePodcastPodcastValueMock,
            ROUTE_PODCASTS_SORT_BY_PARAMS.Recent,
          ),
        ).toEqual([
          {
            lastUpdated: new Date(2000, 0, 10).toString(),
            name: 'H',
          },
          {
            lastUpdated: new Date(2000, 0, 5).toString(),
            name: 'Z',
          },
          {
            lastUpdated: new Date(2000, 0, 1).toString(),
            name: 'A',
          },
        ]);
      });
    });

    describe(`when sortBy is ${ROUTE_PODCASTS_SORT_BY_PARAMS['A-Z']}`, () => {
      it('returns the correct response', () => {
        expect(
          sortPodcasts(
            usePodcastPodcastValueMock,
            ROUTE_PODCASTS_SORT_BY_PARAMS['A-Z'],
          ),
        ).toEqual([
          {
            lastUpdated: new Date(2000, 0, 1).toString(),
            name: 'A',
          },
          {
            lastUpdated: new Date(2000, 0, 10).toString(),
            name: 'H',
          },
          {
            lastUpdated: new Date(2000, 0, 5).toString(),
            name: 'Z',
          },
        ]);
      });
    });
  });
});

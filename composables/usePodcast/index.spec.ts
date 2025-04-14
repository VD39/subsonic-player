import type { DataMock } from '@/test/types';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { usePodcast } from './index';

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
  getNewestPodcastEpisodes,
  getPodcast,
  getPodcasts,
  podcasts,
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

        getPodcasts();
      });

      it('sets the correct podcasts value', () => {
        expect(podcasts.value).toEqual([]);
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

        getPodcasts();
      });

      it('sets the correct podcasts value', () => {
        expect(podcasts.value).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the getPodcast function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await getPodcast('id')).toEqual(null);
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
        expect(await getPodcast('id')).toEqual({
          name: 'name',
        });
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

      it('does not call the getPodcasts function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPodcasts',
          expect.any(Object),
        );
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

      it('calls the getPodcasts function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPodcasts',
          expect.any(Object),
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

        deletePodcast('id');
      });

      it('does not call the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getPodcasts function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPodcasts',
          expect.any(Object),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        deletePodcast('id');
      });

      it('calls the addSuccessSnackMock function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted podcast.',
        );
      });

      it('calls the getPodcasts function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPodcasts',
          expect.any(Object),
        );
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

  describe('when the getNewestPodcastEpisodes function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });
      });

      it('returns the correct response', async () => {
        expect(await getNewestPodcastEpisodes()).toEqual([]);
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
        expect(await getNewestPodcastEpisodes()).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });
});

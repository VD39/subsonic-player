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
  getPodcast,
  getPodcastsAndNewestPodcastEpisodes,
  newestPodcastEpisodes,
  podcasts,
} = usePodcast();

describe('usePodcast', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default podcasts value', () => {
    expect(podcasts.value).toEqual([]);
  });

  it('sets the default newestPodcastEpisodes value', () => {
    expect(newestPodcastEpisodes.value).toEqual([]);
  });

  describe('when the getPodcastsAndNewestPodcastEpisodes function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: null,
          })
          .mockResolvedValueOnce({
            data: null,
          });

        getPodcastsAndNewestPodcastEpisodes();
      });

      it('sets the correct podcasts value', () => {
        expect(podcasts.value).toEqual([]);
      });

      it('sets the correct newestPodcastEpisodes value', () => {
        expect(newestPodcastEpisodes.value).toEqual([]);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(() => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: [
              {
                name: 'name',
              },
            ],
          })
          .mockResolvedValueOnce({
            data: [
              {
                name: 'name1',
              },
            ],
          });

        getPodcastsAndNewestPodcastEpisodes();
      });

      it('sets the correct podcasts value', () => {
        expect(podcasts.value).toEqual([
          {
            name: 'name',
          },
        ]);
      });

      it('sets the correct newestPodcastEpisodes value', () => {
        expect(newestPodcastEpisodes.value).toEqual([
          {
            name: 'name1',
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
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await addPodcast('url');
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

      it('does not call the getNewestPodcasts function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getNewestPodcasts',
          expect.any(Object),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        await addPodcast('url');
      });

      it('calls the addSuccessSnack function', () => {
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

      it('calls the getNewestPodcasts function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getNewestPodcasts',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the deletePodcast function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await deletePodcast('id');
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

      it('does not call the getNewestPodcasts function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getNewestPodcasts',
          expect.any(Object),
        );
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        await deletePodcast('id');
      });

      it('calls the addSuccessSnack function', () => {
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

      it('calls the getNewestPodcasts function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getNewestPodcasts',
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

      it('calls the addSuccessSnack function', () => {
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

      it('calls the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Download has begun on the server.',
        );
      });
    });
  });
});

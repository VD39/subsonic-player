import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { usePodcast } from './index';

vi.useFakeTimers();

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
  podcast,
  podcasts,
  resetPodcasts,
} = usePodcast();

describe('usePodcast', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default podcasts value', () => {
    expect(podcasts.value).toEqual([]);
  });

  it('sets the default podcast value', () => {
    expect(podcast.value).toEqual({});
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
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await getPodcast('id');
      });

      it('sets the correct podcast value', () => {
        expect(podcast.value).toEqual({
          id: null,
        });
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: [
            {
              name: 'name',
            },
          ],
        });

        await getPodcast('id');
      });

      it('sets the correct podcast value', () => {
        expect(podcast.value).toEqual({
          id: {
            name: 'name',
          },
        });
      });
    });

    describe('when getPodcast is called again with a different id', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: [
            {
              name: 'name1',
            },
          ],
        });

        await getPodcast('id1');
      });

      it('sets the correct podcast value', () => {
        expect(podcast.value).toEqual({
          id: {
            name: 'name',
          },
          id1: {
            name: 'name1',
          },
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

      it('does not call the addSuccessSnack function', () => {
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

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully added podcast.',
        );
      });

      it('calls the getPodcasts function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPodcasts',
          expect.any(Object),
        );
      });

      it('calls the getNewestPodcasts function with the correct parameters', () => {
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

      it('does not call the addSuccessSnack function', () => {
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

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted podcast.',
        );
      });

      it('calls the getPodcasts function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getPodcasts',
          expect.any(Object),
        );
      });

      it('calls the getNewestPodcasts function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith(
          '/getNewestPodcasts',
          expect.any(Object),
        );
      });
    });
  });

  describe('when the deletePodcastEpisode function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await deletePodcastEpisode({
          id: 'id',
          podcastId: 'podcastId',
        } as PodcastEpisode);

        vi.runAllTimers();
      });

      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getPodcast function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPodcasts',
          expect.any(Object),
        );
      });

      it('does not call the getNewestPodcastEpisodes function', () => {
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

        await deletePodcastEpisode({
          id: 'id',
          podcastId: 'podcastId',
        } as PodcastEpisode);

        vi.runAllTimers();
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted podcast episode from server. Podcast will update automatically.',
        );
      });

      describe('when 15 seconds passes', () => {
        it('calls the getPodcast function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/getPodcasts',
            expect.any(Object),
          );
        });

        it('calls the getNewestPodcastEpisodes function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/getNewestPodcasts',
            expect.any(Object),
          );
        });
      });
    });
  });

  describe('when the downloadPodcastEpisode function is called', () => {
    describe('when fetchData response returns null', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        downloadPodcastEpisode({
          id: 'id',
          podcastId: 'podcastId',
        } as PodcastEpisode);

        vi.runAllTimers();
      });

      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });

      it('does not call the getPodcast function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getPodcasts',
          expect.any(Object),
        );
      });

      it('does not call the getNewestPodcastEpisodes function', () => {
        expect(fetchDataMock).not.toHaveBeenCalledWith(
          '/getNewestPodcasts',
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

        downloadPodcastEpisode({
          id: 'id',
          podcastId: 'podcastId',
        } as PodcastEpisode);

        vi.runAllTimers();
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Download has begun on the server. Podcast will update automatically.',
        );
      });

      describe('when 15 seconds passes', () => {
        it('calls the getPodcast function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/getPodcasts',
            expect.any(Object),
          );
        });

        it('calls the getNewestPodcastEpisodes function with the correct parameters', () => {
          expect(fetchDataMock).toHaveBeenCalledWith(
            '/getNewestPodcasts',
            expect.any(Object),
          );
        });
      });
    });
  });

  describe('when the resetPodcasts function is called', () => {
    beforeEach(() => {
      resetPodcasts();
    });

    it('sets the podcast value to the default value', () => {
      expect(podcast.value).toEqual({});
    });

    it('sets the podcasts value to the default value', () => {
      expect(podcasts.value).toEqual([]);
    });

    it('sets the newestPodcastEpisodes value to the default value', () => {
      expect(newestPodcastEpisodes.value).toEqual([]);
    });
  });
});

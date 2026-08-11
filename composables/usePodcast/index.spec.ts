import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { usePodcast } from './index';

const runTaskOnScheduleMock = vi.hoisted(() => vi.fn());

mockNuxtImport('runTaskOnSchedule', () => runTaskOnScheduleMock);

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: null,
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
}));

const addSuccessSnackMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useSnack', (original) => () => ({
  ...original(),
  addSuccessSnack: addSuccessSnackMock,
}));

describe('usePodcast', () => {
  let composable: ReturnType<typeof usePodcast>;

  beforeAll(() => {
    composable = usePodcast();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default podcasts value', () => {
    expect(composable.podcasts.value).toEqual([]);
  });

  it('sets the default podcast value', () => {
    expect(composable.podcast.value).toEqual({});
  });

  it('sets the default newestPodcastEpisodes value', () => {
    expect(composable.newestPodcastEpisodes.value).toEqual([]);
  });

  describe('when the getPodcastsAndNewestPodcastEpisodes function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(async () => {
        fetchDataMock
          .mockResolvedValueOnce({
            data: null,
          })
          .mockResolvedValueOnce({
            data: null,
          });

        await composable.getPodcastsAndNewestPodcastEpisodes();
      });

      it('sets the correct podcasts value', () => {
        expect(composable.podcasts.value).toEqual([]);
      });

      it('sets the correct newestPodcastEpisodes value', () => {
        expect(composable.newestPodcastEpisodes.value).toEqual([]);
      });
    });

    describe('when fetchData response returns an array', () => {
      beforeEach(async () => {
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

        await composable.getPodcastsAndNewestPodcastEpisodes();
      });

      it('sets the correct podcasts value', () => {
        expect(composable.podcasts.value).toEqual([
          {
            name: 'name',
          },
        ]);
      });

      it('sets the correct newestPodcastEpisodes value', () => {
        expect(composable.newestPodcastEpisodes.value).toEqual([
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

        await composable.getPodcast('id');
      });

      it('sets the correct podcast value', () => {
        expect(composable.podcast.value).toEqual({
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

        await composable.getPodcast('id');
      });

      it('sets the correct podcast value', () => {
        expect(composable.podcast.value).toEqual({
          id: {
            name: 'name',
          },
        });
      });
    });

    describe('when the getPodcast function is called again with a different id', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: [
            {
              name: 'name1',
            },
          ],
        });

        await composable.getPodcast('id1');
      });

      it('sets the correct podcast value', () => {
        expect(composable.podcast.value).toEqual({
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
    beforeEach(async () => {
      fetchDataMock.mockResolvedValue({
        data: null,
      });

      await composable.addPodcast('url');
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

    describe('when fetchData response returns null', () => {
      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        await composable.addPodcast('url');
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully added podcast.',
        );
      });
    });
  });

  describe('when the deletePodcast function is called', () => {
    beforeEach(async () => {
      fetchDataMock.mockResolvedValue({
        data: null,
      });

      await composable.deletePodcast('id');
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

    describe('when fetchData response returns null', () => {
      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        await composable.deletePodcast('id');
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Successfully deleted podcast.',
        );
      });
    });
  });

  describe('when the deletePodcastEpisode function is called', () => {
    beforeEach(async () => {
      fetchDataMock.mockResolvedValue({
        data: null,
      });

      await composable.deletePodcastEpisode({
        id: 'id',
        podcastId: 'podcastId',
      } as PodcastEpisode);
    });

    describe('when fetchData response returns null', () => {
      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        await composable.deletePodcastEpisode({
          id: 'id',
          podcastId: 'podcastId',
        } as PodcastEpisode);
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Podcast episode deleted from the server. Please allow a moment for any updates to appear.',
        );
      });
    });

    describe('when podcastId is defined', () => {
      it('calls the runTaskOnSchedule function with the correct parameters', () => {
        expect(runTaskOnScheduleMock).toHaveBeenCalledWith(
          'refreshPodcast-podcastId',
          [0, 5, 10, 15],
          expect.any(Function),
        );
      });
    });

    describe('when podcastId is not defined', () => {
      beforeEach(async () => {
        vi.clearAllMocks();
        fetchDataMock.mockClear();
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await composable.deletePodcastEpisode({
          id: 'id',
        } as PodcastEpisode);
      });

      it('does not call the runTaskOnSchedule function', () => {
        expect(runTaskOnScheduleMock).not.toHaveBeenCalled();
      });
    });

    describe('when the deletePodcastEpisode function is called again before the milestones pass', () => {
      beforeEach(async () => {
        fetchDataMock.mockClear();
        runTaskOnScheduleMock.mockClear();
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await composable.deletePodcastEpisode({
          id: 'id',
          podcastId: 'podcastId',
        } as PodcastEpisode);

        await composable.deletePodcastEpisode({
          id: 'id1',
          podcastId: 'podcastId',
        } as PodcastEpisode);
      });

      it('calls the runTaskOnSchedule function for each deletePodcastEpisode call', () => {
        expect(runTaskOnScheduleMock).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('when the downloadPodcastEpisode function is called', () => {
    beforeEach(async () => {
      fetchDataMock.mockResolvedValue({
        data: null,
      });

      await composable.downloadPodcastEpisode({
        id: 'id',
        podcastId: 'podcastId',
      } as PodcastEpisode);
    });

    describe('when fetchData response returns null', () => {
      it('does not call the addSuccessSnack function', () => {
        expect(addSuccessSnackMock).not.toHaveBeenCalled();
      });
    });

    describe('when fetchData response returns a value', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: {
            name: 'name',
          },
        });

        await composable.downloadPodcastEpisode({
          id: 'id',
          podcastId: 'podcastId',
        } as PodcastEpisode);
      });

      it('calls the addSuccessSnack function with the correct parameters', () => {
        expect(addSuccessSnackMock).toHaveBeenCalledWith(
          'Download has begun on the server. Podcast will update automatically.',
        );
      });
    });

    describe('when podcastId is defined', () => {
      it('calls the runTaskOnSchedule function with the correct parameters', () => {
        expect(runTaskOnScheduleMock).toHaveBeenCalledWith(
          'refreshPodcast-podcastId',
          [0, 5, 10, 15],
          expect.any(Function),
        );
      });
    });

    describe('when podcastId is not defined', () => {
      beforeEach(async () => {
        vi.clearAllMocks();
        fetchDataMock.mockClear();
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await composable.downloadPodcastEpisode({
          id: 'id',
        } as PodcastEpisode);
      });

      it('does not call the runTaskOnSchedule function', () => {
        expect(runTaskOnScheduleMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the resetPodcasts function is called', () => {
    beforeEach(() => {
      composable.resetPodcasts();
    });

    it('sets the podcast value to the default value', () => {
      expect(composable.podcast.value).toEqual({});
    });

    it('sets the podcasts value to the default value', () => {
      expect(composable.podcasts.value).toEqual([]);
    });

    it('sets the newestPodcastEpisodes value to the default value', () => {
      expect(composable.newestPodcastEpisodes.value).toEqual([]);
    });
  });
});

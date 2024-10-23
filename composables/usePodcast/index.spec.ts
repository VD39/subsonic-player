import type { DataMock } from '@/test/types';

import { usePodcastPodcastValueMock } from '@/test/fixtures';
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
  getNewestPodcasts,
  getPodcast,
  getPodcasts,
  latestPodcasts,
  podcast,
  podcastEpisodes,
  podcasts,
  sortPodcasts,
} = usePodcast();

describe('usePodcast', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default podcast value', () => {
    expect(podcast.value).toEqual(undefined);
  });

  it('sets the default podcasts value', () => {
    expect(podcasts.value).toEqual([]);
  });

  it('sets the default latestPodcasts value', () => {
    expect(latestPodcasts.value).toEqual([]);
  });

  describe('when the getPodcasts function is called', () => {
    describe('when fetchData response returns non array value', () => {
      beforeEach(() => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        getPodcasts();
      });

      it('does not add to the podcasts value', () => {
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

      it('adds to the podcasts value', () => {
        expect(podcasts.value).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the getPodcast function is called', () => {
    describe('when podcasts value is an empty array', () => {
      beforeEach(() => {
        podcasts.value = [];
        getPodcast('id');
      });

      it('calls the fetchData function', () => {
        expect(fetchDataMock).toHaveBeenCalled();
      });

      it('sets the correct podcast value', () => {
        expect(podcast.value).toEqual(undefined);
      });

      it('sets the correct podcastEpisodes value', () => {
        expect(podcastEpisodes.value).toEqual([]);
      });
    });

    describe('when podcasts value is not an empty array', () => {
      beforeEach(() => {
        podcasts.value = [
          {
            episodes: [{}],
            id: 'id',
          } as unknown as Podcast,
        ];

        getPodcast('id');
      });

      it('does not call the fetchData function', () => {
        expect(fetchDataMock).not.toHaveBeenCalled();
      });

      describe('when id is not found in podcasts value', () => {
        beforeEach(() => {
          getPodcast('no-found-id');
        });

        it('sets the correct podcast value', () => {
          expect(podcast.value).toEqual(undefined);
        });

        it('sets the correct podcastEpisodes value', () => {
          expect(podcastEpisodes.value).toEqual([]);
        });
      });

      describe('when id found in podcasts value', () => {
        beforeEach(() => {
          getPodcast('id');
        });

        it('sets the correct podcast value', () => {
          expect(podcast.value).toEqual({
            episodes: [{}],
            id: 'id',
          });
        });

        it('sets the correct podcastEpisodes value', () => {
          expect(podcastEpisodes.value).toEqual([{}]);
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
        expect(fetchDataMock).toHaveBeenCalledWith('/getPodcasts', {
          params: {
            noLoading: true,
          },
          transform: expect.any(Function),
        });
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
        expect(fetchDataMock).toHaveBeenCalledWith('/getPodcasts', {
          params: {
            noLoading: true,
          },
          transform: expect.any(Function),
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
          'Successfully deleted podcast episode.',
        );
      });

      it('calls the getPodcasts function', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/getPodcasts', {
          params: {
            noLoading: true,
          },
          transform: expect.any(Function),
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

        getNewestPodcasts();
      });

      it('does not add to the latestPodcasts value', () => {
        expect(latestPodcasts.value).toEqual([]);
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

        getNewestPodcasts();
      });

      it('adds to the latestPodcasts value', () => {
        expect(latestPodcasts.value).toEqual([
          {
            name: 'name',
          },
        ]);
      });
    });
  });

  describe('when the sortPodcasts function is called', () => {
    beforeEach(() => {
      podcasts.value = usePodcastPodcastValueMock;
    });

    describe('when sortBy is recent', () => {
      beforeEach(() => {
        sortPodcasts(ROUTE_PODCASTS_SORT_BY_PARAMS.Recent);
      });

      it('sets the correct podcasts value', () => {
        expect(podcasts.value).toEqual([
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

    describe('when sortBy is a-z', () => {
      beforeEach(() => {
        sortPodcasts(ROUTE_PODCASTS_SORT_BY_PARAMS['A-Z']);
      });

      it('sets the correct podcasts value', () => {
        expect(podcasts.value).toEqual([
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

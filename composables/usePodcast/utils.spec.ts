import { usePodcastPodcastValueMock } from '@/test/fixtures';
import { getFormattedPodcastEpisodesMock } from '@/test/helpers';

import {
  sortPodcastEpisodes,
  sortPodcastsByDate,
  sortPodcastsByName,
} from './utils';

describe('sortPodcastEpisodes', () => {
  describe.each([
    [ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded, 2],
    [ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded'], 3],
    [ROUTE_PODCAST_SORT_BY_PARAMS.All, 5],
  ])('when status is %s', (status, total) => {
    it('returns the correct sorted values', () => {
      expect(
        sortPodcastEpisodes(
          [
            ...getFormattedPodcastEpisodesMock(2, {
              downloaded: true,
            }),
            ...getFormattedPodcastEpisodesMock(3, {
              downloaded: false,
            }),
          ],
          status,
        ).length,
      ).toBe(total);
    });
  });
});

describe('sortPodcastsByDate', () => {
  it('sets the correct podcasts value', () => {
    expect(sortPodcastsByDate(usePodcastPodcastValueMock)).toEqual([
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

describe('sortPodcastsByName', () => {
  it('sets the correct podcasts value', () => {
    expect(sortPodcastsByName(usePodcastPodcastValueMock)).toEqual([
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

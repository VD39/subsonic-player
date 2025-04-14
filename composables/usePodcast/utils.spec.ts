import { usePodcastPodcastValueMock } from '@/test/fixtures';

import { sortPodcastsByName } from './utils';

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

import {
  getFormattedAlbumsMock,
  getFormattedArtistsMock,
  getFormattedTracksMock,
} from '@/test/helpers';

import {
  toAlbumSuggestion,
  toArtistSuggestion,
  toTrackSuggestion,
} from './utils';

const album = getFormattedAlbumsMock()[0];
const artist = getFormattedArtistsMock()[0];
const track = getFormattedTracksMock()[0];

describe('toAlbumSuggestion', () => {
  it('returns the correct response', () => {
    expect(toAlbumSuggestion(album)).toEqual({
      artists: album.artists,
      icon: ICONS.album,
      id: `album-${album.id}`,
      name: album.name,
      route: {
        name: ROUTE_NAMES.album,
        params: {
          [ROUTE_PARAM_KEYS.album.id]: album.id,
        },
      },
      type: 'album',
    });
  });
});

describe('toArtistSuggestion', () => {
  it('returns the correct response', () => {
    expect(toArtistSuggestion(artist)).toEqual({
      artists: [],
      icon: ICONS.artist,
      id: `artist-${artist.id}`,
      name: artist.name,
      route: {
        name: ROUTE_NAMES.artist,
        params: {
          [ROUTE_PARAM_KEYS.artist.id]: artist.id,
        },
      },
      type: 'artist',
    });
  });
});

describe('toTrackSuggestion', () => {
  it('returns the correct response', () => {
    expect(toTrackSuggestion(track, 'query')).toEqual({
      artists: track.artists,
      icon: ICONS.track,
      id: `track-${track.id}`,
      name: track.name,
      route: {
        name: ROUTE_NAMES.search,
        params: {
          [ROUTE_PARAM_KEYS.search.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Tracks,
          [ROUTE_PARAM_KEYS.search.query]: 'query',
        },
      },
      track,
      type: 'track',
    });
  });
});

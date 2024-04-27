import { playlistMock, songMock } from '@/test/fixtures';
import { formatPlaylist, formatSong } from './index';

describe('formatPlaylist', () => {
  describe('when values are all set', () => {
    it('returns correct values', () => {
      expect(formatPlaylist(playlistMock)).toEqual({
        changed: '2024',
        comment: '',
        created: '2024',
        duration: 1,
        entry: undefined,
        id: 'id',
        image: undefined,
        images: ['coverArt'],
        isReadOnly: false,
        name: 'name',
        owner: 'owner',
        public: true,
        songCount: 1,
        songs: [
          {
            album: 'album',
            albumArtists: null,
            artist: 'artist',
            artists: [
              {
                id: 'id',
                name: 'name',
              },
              {
                id: 'id1',
                name: 'name1',
              },
            ],
            bitRate: 1,
            contentType: 'contentType',
            coverArt: 'coverArt',
            created: '2023',
            discNumber: 1,
            displayAlbumArtist: '',
            displayArtist: '',
            duration: 1,
            favourite: false,
            genres: [],
            id: 'id',
            image: 'coverArt',
            isDir: false,
            isVideo: false,
            musicBrainzId: '',
            parent: 'parent',
            path: 'path',
            replayGain: null,
            size: 1,
            streamId: 'id',
            suffix: 'suffix',
            title: 'title',
            track: 1,
            type: 'type',
            year: 2024,
          },
        ],
      });
    });
  });

  describe('when name is not defined', () => {
    it('returns correct values', () => {
      expect(
        formatPlaylist({
          ...playlistMock,
          name: '',
        }),
      ).toEqual(
        expect.objectContaining({
          name: '(Unnamed)',
        }),
      );
    });
  });

  describe('when entry is not defined', () => {
    it('returns correct values', () => {
      expect(
        formatPlaylist({
          ...playlistMock,
          entry: undefined,
        }),
      ).toEqual(
        expect.objectContaining({
          songs: [],
        }),
      );
    });
  });
});

describe('formatSong', () => {
  it('returns correct values', () => {
    expect(formatSong(songMock)).toEqual({
      album: 'album',
      albumArtists: null,
      artist: 'artist',
      artists: [
        {
          id: 'id',
          name: 'name',
        },
        {
          id: 'id1',
          name: 'name1',
        },
      ],
      bitRate: 1,
      contentType: 'contentType',
      coverArt: 'coverArt',
      created: '2023',
      discNumber: 1,
      displayAlbumArtist: '',
      displayArtist: '',
      duration: 1,
      favourite: false,
      genres: [],
      id: 'id',
      image: 'coverArt',
      isDir: false,
      isVideo: false,
      musicBrainzId: '',
      parent: 'parent',
      path: 'path',
      replayGain: null,
      size: 1,
      streamId: 'id',
      suffix: 'suffix',
      title: 'title',
      track: 1,
      type: 'type',
      year: 2024,
    });
  });
});

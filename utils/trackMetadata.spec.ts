import {
  getFormattedPodcastEpisodesMock,
  getFormattedTracksMock,
} from '@/test/helpers';

import { getTrackDisplayMetadata } from './trackMetadata';

const track = getFormattedTracksMock()[0];
const podcastEpisode = getFormattedPodcastEpisodesMock()[0];

describe('getTrackDisplayMetadata', () => {
  describe(`when track is a ${MEDIA_TYPE.podcastEpisode}`, () => {
    it('returns the correct response', () => {
      expect(getTrackDisplayMetadata(podcastEpisode)).toEqual({
        album: podcastEpisode.podcastName,
        artist: podcastEpisode.author,
        title: podcastEpisode.name,
      });
    });
  });

  describe(`when track is a ${MEDIA_TYPE.track}`, () => {
    it('returns the correct response', () => {
      expect(getTrackDisplayMetadata(track)).toEqual({
        album: track.album,
        artist: 'name & name1',
        title: track.name,
      });
    });
  });

  describe('when track is an unknown type', () => {
    it('returns the correct response', () => {
      expect(
        getTrackDisplayMetadata({
          ...track,
          type: 'unknown',
        } as MixedTrack),
      ).toEqual({
        album: '',
        artist: '',
        title: track.name,
      });
    });
  });
});

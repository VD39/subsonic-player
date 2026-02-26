import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { getFormattedRadioStationMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import headPlugin from './head';

const radioStation = getFormattedRadioStationMock()[0];

const { currentTrackMock, hasCurrentTrackMock, isPlayingMock } =
  useAudioPlayerMock();

let useHeadCallback: (typeof useHead)['arguments'][0];

mockNuxtImport('useHead', () =>
  vi.fn((cb) => {
    useHeadCallback = cb;
  }),
);

describe('head plugin', () => {
  beforeEach(() => {
    headPlugin(undefined as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the useHead function is called', () => {
    it('returns the correct response', () => {
      expect(useHeadCallback()).toEqual({
        htmlAttrs: {
          lang: 'en',
        },
        link: [
          {
            color: '#6313bc',
            href: '/favicon.svg',
            rel: 'mask-icon',
          },
        ],
        meta: [
          {
            content:
              'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover',
            name: 'viewport',
          },
          {
            content: '#6313bc',
            name: 'theme-color',
          },
          {
            content:
              'A responsive, modern web-based client designed for Subsonic music servers.',
            name: 'description',
          },
          {
            content: 'yes',
            name: 'mobile-web-app-capable',
          },
          {
            content: 'black-translucent',
            name: 'apple-mobile-web-app-status-bar-style',
          },
          {
            content: 'Music App',
            name: 'apple-mobile-web-app-title',
          },
          {
            content: 'telephone=no',
            name: 'format-detection',
          },
        ],
        titleTemplate: expect.any(Function),
      });
    });

    describe('titleTemplate', () => {
      describe('when the isPlaying value is false', () => {
        describe('when titleChunk is not set', () => {
          it('returns the correct response', () => {
            expect(useHeadCallback().titleTemplate()).toBe('Music App');
          });
        });

        describe('when titleChunk is set', () => {
          describe('when there are multiple title chunks', () => {
            it('returns the correct response', () => {
              expect(
                useHeadCallback().titleTemplate(
                  'Title Chunk 1 - Title Chunk 2',
                ),
              ).toBe('Title Chunk 1 - Title Chunk 2 - Music App');
            });
          });

          describe('when there is a single title chunk', () => {
            it('returns the correct response', () => {
              expect(useHeadCallback().titleTemplate('Title Chunk')).toBe(
                'Title Chunk - Music App',
              );
            });
          });
        });
      });

      describe('when the hasCurrentTrack value is false', () => {
        beforeEach(() => {
          hasCurrentTrackMock.value = false;
        });

        it('returns the correct response', () => {
          expect(useHeadCallback().titleTemplate('Title Chunk')).toBe(
            'Title Chunk - Music App',
          );
        });
      });

      describe('when the isPlaying and hasCurrentTrack values are true', () => {
        beforeEach(() => {
          hasCurrentTrackMock.value = true;
          isPlayingMock.value = true;
        });

        describe('when the current track has an artist', () => {
          it('returns the correct response', () => {
            expect(useHeadCallback().titleTemplate('Title Chunk')).toBe(
              'Queue-Track-0-Name - Name & Name1 - Music App',
            );
          });
        });

        describe('when the current track does not have an artist', () => {
          beforeEach(() => {
            currentTrackMock.value = radioStation;
          });

          it('returns the correct response', () => {
            expect(useHeadCallback().titleTemplate('Title Chunk')).toBe(
              'Radio-Station-0 - Music App',
            );
          });
        });
      });
    });
  });
});

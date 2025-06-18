import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { getFormattedQueueTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import { useDragAndDrop } from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const documentEvents: any = {};

const documentAddEventListenerSpy = vi
  .spyOn(document, 'addEventListener')
  .mockImplementation((event, cb) => {
    documentEvents[event] = cb;
  });
const documentRemoveEventListenerSpy = vi.spyOn(
  document,
  'removeEventListener',
);
const htmlAddEventListenerSpy = vi
  .spyOn(HTMLElement.prototype, 'addEventListener')
  .mockImplementation((event, cb) => {
    documentEvents[event] = cb;
  });
const htmlRemoveEventListenerSpy = vi.spyOn(
  HTMLElement.prototype,
  'removeEventListener',
);
const appendChildSpy = vi.spyOn(document.body, 'appendChild');
const createElementSpy = vi.spyOn(document, 'createElement');
const jsonParseSpy = vi.spyOn(JSON, 'parse');
const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
const querySelectorSpy = vi.spyOn(HTMLElement.prototype, 'querySelector');
const closestSpy = vi.spyOn(HTMLElement.prototype, 'closest');
const containsSpy = vi
  .spyOn(HTMLElement.prototype, 'contains')
  .mockReturnValue(false);

const addClassMock = vi.fn();
const containsClassMock = vi.fn();
const removeClassMock = vi.fn();

Object.defineProperty(HTMLElement.prototype, 'classList', {
  get() {
    return {
      add: addClassMock,
      contains: containsClassMock,
      remove: removeClassMock,
    };
  },
});

HTMLElement.prototype.getBoundingClientRect = () =>
  ({
    left: 50,
    top: 20,
  }) as DOMRect;

const getDataMock = vi.fn();
const setDataMock = vi.fn();

function createOnDragStartDragEvent(
  hasDataTransfer = true,
  querySelectorValue: HTMLImageElement | null = document.createElement('img'),
) {
  querySelectorSpy.mockReturnValue(querySelectorValue);

  const dataTransfer = {
    dataTransfer: {
      setData: setDataMock,
      setDragImage: vi.fn(),
    },
  };

  return {
    currentTarget: document.createElement('span'),
    ...(hasDataTransfer ? dataTransfer : undefined),
  } as unknown as DragEvent;
}

function createOnDropDragEvent(
  isDroppable = true,
  dataReturned: null | string = null,
) {
  containsClassMock.mockReturnValue(isDroppable);

  return {
    currentTarget: document.createElement('span'),
    dataTransfer: {
      getData: getDataMock.mockReturnValue(dataReturned),
    },
    preventDefault: vi.fn(),
  } as unknown as DragEvent;
}

const getAlbumMock = vi.fn();

mockNuxtImport('useAlbum', () => () => ({
  getAlbum: getAlbumMock,
}));

const addToPlaylistMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addToPlaylist: addToPlaylistMock,
}));

const getPodcastMock = vi.fn();

mockNuxtImport('usePodcast', () => () => ({
  getPodcast: getPodcastMock,
}));

const { addTrackToQueueMock } = useAudioPlayerMock();

const mediaMock = getFormattedQueueTracksMock()[0];

vi.useFakeTimers();

const { onDragStart, onDrop } = useDragAndDrop();

describe('useDragAndDrop', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when onDrop function is called', () => {
    beforeEach(() => {
      onDrop('drop-id', createOnDropDragEvent(false));
    });

    it('calls the target.classList.remove function', () => {
      expect(removeClassMock).toHaveBeenCalledWith(
        DRAG_AND_DROP_CLASS_NAMES.validDropZone,
      );
    });

    describe(`when element does not have a ${DRAG_AND_DROP_CLASS_NAMES.isDroppable} class`, () => {
      it('does not call then event.dataTransfer.getData function', () => {
        expect(getDataMock).not.toHaveBeenCalled();
      });
    });

    describe(`when element does have a ${DRAG_AND_DROP_CLASS_NAMES.isDroppable} class`, () => {
      describe('when event.dataTransfer.getData does not return any data', () => {
        beforeEach(() => {
          onDrop('drop-id', createOnDropDragEvent());
        });

        it('does not call then JSON.parse function', () => {
          expect(jsonParseSpy).not.toHaveBeenCalled();
        });
      });

      describe('when event.dataTransfer.getData does return data', () => {
        describe('when dataTransfer data return is not valid', () => {
          beforeEach(() => {
            onDrop(
              'drop-id',
              createOnDropDragEvent(
                true,
                JSON.stringify({
                  id: 'id',
                }),
              ),
            );
          });

          it('does not call then addTrackToQueue function', () => {
            expect(addTrackToQueueMock).not.toHaveBeenCalled();
          });

          it('does not call then addToPlaylist function', () => {
            expect(addToPlaylistMock).not.toHaveBeenCalled();
          });
        });

        describe('when dataTransfer data return is valid', () => {
          describe.each([
            [
              QUEUE_ID,
              {
                album: 2,
                playlist: 3,
                podcast: 2,
                podcastEpisodeTracks: 1,
              },
              {
                album: 0,
                playlist: 0,
                podcast: 0,
                podcastEpisodeTracks: 0,
              },
            ],
            [
              'drop-id',
              {
                album: 0,
                playlist: 0,
                podcast: 0,
                podcastEpisodeTracks: 0,
              },
              {
                album: 2,
                playlist: 3,
                podcast: 2,
                podcastEpisodeTracks: 1,
              },
            ],
          ])(
            'with dropId %s',
            (dropId, addTrackToQueueTimes, addToPlaylistTimes) => {
              describe(`when media type is ${MEDIA_TYPE.album}`, () => {
                describe('when tracks is not an empty array', () => {
                  beforeEach(() => {
                    onDrop(
                      dropId,
                      createOnDropDragEvent(
                        true,
                        JSON.stringify({
                          id: 'id',
                          tracks: [{}, {}],
                          type: MEDIA_TYPE.album,
                        }),
                      ),
                    );
                  });

                  it('calls the target.classList.add function', () => {
                    expect(addClassMock).toHaveBeenCalledWith(
                      DRAG_AND_DROP_CLASS_NAMES.droppedInZone,
                    );
                  });

                  it('does not call getAlbum function', () => {
                    expect(getAlbumMock).not.toHaveBeenCalled();
                  });

                  it(`${addTrackToQueueTimes.album > 0 ? 'calls' : 'does not call'} the addTrackToQueue function`, () => {
                    expect(addTrackToQueueMock).toHaveBeenCalledTimes(
                      addTrackToQueueTimes.album,
                    );
                  });

                  it(`${addToPlaylistTimes.album > 0 ? 'calls' : 'does not call'} the addToPlaylist function`, () => {
                    expect(addToPlaylistMock).toHaveBeenCalledTimes(
                      addToPlaylistTimes.album,
                    );
                  });

                  it('calls the target.classList.remove function', () => {
                    expect(removeClassMock).toHaveBeenCalledWith(
                      DRAG_AND_DROP_CLASS_NAMES.droppedInZone,
                    );
                  });
                });

                describe('when tracks is an empty array', () => {
                  describe('and getAlbum returns null', () => {
                    beforeEach(() => {
                      getAlbumMock.mockResolvedValue(null);

                      onDrop(
                        dropId,
                        createOnDropDragEvent(
                          true,
                          JSON.stringify({
                            id: 'id',
                            tracks: [],
                            type: MEDIA_TYPE.album,
                          }),
                        ),
                      );
                    });

                    it('calls getAlbum function', () => {
                      expect(getAlbumMock).toHaveBeenCalled();
                    });

                    it('does not call addTrackToQueue function', () => {
                      expect(addTrackToQueueMock).not.toHaveBeenCalled();
                    });

                    it('does not call addToPlaylist function', () => {
                      expect(addToPlaylistMock).not.toHaveBeenCalled();
                    });
                  });

                  describe('and getAlbum returns data', () => {
                    beforeEach(() => {
                      getAlbumMock.mockResolvedValue({
                        id: 'id',
                        tracks: [{}, {}],
                        type: MEDIA_TYPE.album,
                      });

                      onDrop(
                        dropId,
                        createOnDropDragEvent(
                          true,
                          JSON.stringify({
                            id: 'id',
                            tracks: [],
                            type: MEDIA_TYPE.album,
                          }),
                        ),
                      );
                    });

                    it('calls getAlbum function', () => {
                      expect(getAlbumMock).toHaveBeenCalled();
                    });

                    it(`${addTrackToQueueTimes.album > 0 ? 'calls' : 'does not call'} the addTrackToQueue function`, () => {
                      expect(addTrackToQueueMock).toHaveBeenCalledTimes(
                        addTrackToQueueTimes.album,
                      );
                    });

                    it(`${addToPlaylistTimes.album > 0 ? 'calls' : 'does not call'} the addToPlaylist function`, () => {
                      expect(addToPlaylistMock).toHaveBeenCalledTimes(
                        addToPlaylistTimes.album,
                      );
                    });
                  });
                });
              });

              describe(`when media type is ${MEDIA_TYPE.playlist}`, () => {
                describe('when tracks is not an empty array', () => {
                  beforeEach(() => {
                    onDrop(
                      dropId,
                      createOnDropDragEvent(
                        true,
                        JSON.stringify({
                          id: 'id',
                          tracks: [{}, {}, {}],
                          type: MEDIA_TYPE.playlist,
                        }),
                      ),
                    );
                  });

                  it('does not call then getAlbum function', () => {
                    expect(getAlbumMock).not.toHaveBeenCalled();
                  });

                  it(`${addTrackToQueueTimes.playlist > 0 ? 'calls' : 'does not call'} the addTrackToQueue function`, () => {
                    expect(addTrackToQueueMock).toHaveBeenCalledTimes(
                      addTrackToQueueTimes.playlist,
                    );
                  });

                  it(`${addToPlaylistTimes.playlist > 0 ? 'calls' : 'does not call'} the addToPlaylist function`, () => {
                    expect(addToPlaylistMock).toHaveBeenCalledTimes(
                      addToPlaylistTimes.playlist,
                    );
                  });
                });

                describe('when tracks is an empty array', () => {
                  beforeEach(() => {
                    onDrop(
                      dropId,
                      createOnDropDragEvent(
                        true,
                        JSON.stringify({
                          id: 'id',
                          tracks: [],
                          type: MEDIA_TYPE.playlist,
                        }),
                      ),
                    );
                  });

                  it('does not call then addTrackToQueue function', () => {
                    expect(addTrackToQueueMock).not.toHaveBeenCalled();
                  });

                  it('does not call then addToPlaylist function', () => {
                    expect(addToPlaylistMock).not.toHaveBeenCalled();
                  });
                });
              });

              describe(`when media type is ${MEDIA_TYPE.podcast}`, () => {
                beforeEach(() => {
                  getPodcastMock.mockResolvedValue(null);

                  onDrop(
                    dropId,
                    createOnDropDragEvent(
                      true,
                      JSON.stringify({
                        id: 'id',
                        type: MEDIA_TYPE.podcast,
                      }),
                    ),
                  );
                });

                it('calls then getPodcast function', () => {
                  expect(getPodcastMock).toHaveBeenCalled();
                });

                describe('when getPodcast does not return data', () => {
                  it('does not call then addTrackToQueue function', () => {
                    expect(addTrackToQueueMock).not.toHaveBeenCalled();
                  });

                  it('does not call then addToPlaylist function', () => {
                    expect(addToPlaylistMock).not.toHaveBeenCalled();
                  });
                });

                describe('when getPodcast does return data', () => {
                  beforeEach(() => {
                    getPodcastMock.mockResolvedValue({
                      episodes: {
                        downloaded: [{}, {}],
                      },
                      id: 'id',
                      type: MEDIA_TYPE.podcast,
                    });

                    onDrop(
                      dropId,
                      createOnDropDragEvent(
                        true,
                        JSON.stringify({
                          id: 'id',
                          type: MEDIA_TYPE.podcast,
                        }),
                      ),
                    );
                  });

                  it(`${addTrackToQueueTimes.podcast > 0 ? 'calls' : 'does not call'} the addTrackToQueue function`, () => {
                    expect(addTrackToQueueMock).toHaveBeenCalledTimes(
                      addTrackToQueueTimes.podcast,
                    );
                  });

                  it(`${addToPlaylistTimes.podcast > 0 ? 'calls' : 'does not call'} the addToPlaylist function`, () => {
                    expect(addToPlaylistMock).toHaveBeenCalledTimes(
                      addToPlaylistTimes.podcast,
                    );
                  });
                });
              });

              describe.each([[MEDIA_TYPE.podcastEpisode], [MEDIA_TYPE.track]])(
                'with media type %s',
                (mediaType) => {
                  beforeEach(() => {
                    onDrop(
                      dropId,
                      createOnDropDragEvent(
                        true,
                        JSON.stringify({
                          id: 'id',
                          type: mediaType,
                        }),
                      ),
                    );
                  });

                  it(`${addTrackToQueueTimes.podcastEpisodeTracks > 0 ? 'calls' : 'does not call'} the addTrackToQueue function`, () => {
                    expect(addTrackToQueueMock).toHaveBeenCalledTimes(
                      addTrackToQueueTimes.podcastEpisodeTracks,
                    );
                  });

                  it(`${addToPlaylistTimes.podcastEpisodeTracks > 0 ? 'calls' : 'does not call'} the addToPlaylist function`, () => {
                    expect(addToPlaylistMock).toHaveBeenCalledTimes(
                      addToPlaylistTimes.podcastEpisodeTracks,
                    );
                  });
                },
              );

              describe(`when media type is ${MEDIA_TYPE.radioStation}`, () => {
                beforeEach(() => {
                  onDrop(
                    'drop-id',
                    createOnDropDragEvent(
                      true,
                      JSON.stringify({
                        id: 'id',
                        type: MEDIA_TYPE.radioStation,
                      }),
                    ),
                  );
                });

                it('does not call then addTrackToQueue function', () => {
                  expect(addTrackToQueueMock).not.toHaveBeenCalled();
                });

                it('does not call then addToPlaylist function', () => {
                  expect(addToPlaylistMock).not.toHaveBeenCalled();
                });
              });
            },
          );

          describe('when onDrop is called multiple times', () => {
            beforeEach(() => {
              vi.clearAllMocks();

              onDrop(
                'drop-id',
                createOnDropDragEvent(
                  true,
                  JSON.stringify({
                    id: 'id',
                    tracks: [{}, {}],
                    type: MEDIA_TYPE.album,
                  }),
                ),
              );

              onDrop(
                'drop-id',
                createOnDropDragEvent(
                  true,
                  JSON.stringify({
                    id: 'id',
                    tracks: [{}, {}],
                    type: MEDIA_TYPE.album,
                  }),
                ),
              );

              onDrop(
                'drop-id',
                createOnDropDragEvent(
                  true,
                  JSON.stringify({
                    id: 'id',
                    tracks: [{}, {}],
                    type: MEDIA_TYPE.album,
                  }),
                ),
              );
            });

            it('calls the target.classList.add 6 times', () => {
              expect(addClassMock).toHaveBeenCalledTimes(6);
            });

            it('calls the target.classList.remove 3 times', () => {
              const removeCalls = removeClassMock.mock.calls.filter(
                (args) => args[0] === DRAG_AND_DROP_CLASS_NAMES.droppedInZone,
              ).length;

              expect(removeCalls).toBe(3);
            });
          });
        });
      });
    });
  });

  describe('when onDragStart function is called', () => {
    describe('when dataTransfer is not defined', () => {
      beforeEach(() => {
        onDragStart(mediaMock, createOnDragStartDragEvent(false));
      });

      it('does not call the querySelector function', () => {
        expect(querySelectorSpy).not.toHaveBeenCalled();
      });
    });

    describe('when media is not valid', () => {
      beforeEach(() => {
        onDragStart({} as never, createOnDragStartDragEvent());
      });

      it('does not call the querySelector function', () => {
        expect(querySelectorSpy).not.toHaveBeenCalled();
      });
    });

    describe('when dataTransfer is defined and media is valid', () => {
      beforeEach(() => {
        onDragStart(mediaMock, createOnDragStartDragEvent(true, null));
      });

      it('calls the querySelector function', () => {
        expect(querySelectorSpy).toHaveBeenCalled();
      });

      describe('when querySelector does not return a value', () => {
        it('does not call the document.createElement function', () => {
          expect(createElementSpy).not.toHaveBeenCalledWith('div');
        });
      });

      describe('when querySelector does return a value', () => {
        beforeEach(() => {
          onDragStart(mediaMock, createOnDragStartDragEvent(true));
        });

        it('calls the clonedEl.classList.add function', () => {
          expect(addClassMock).toHaveBeenCalledWith(
            DRAG_AND_DROP_CLASS_NAMES.clonedElement,
          );
        });

        it('calls the document.body.appendChild function with correct values', () => {
          const appendedElement = appendChildSpy.mock
            .calls[0][0] as HTMLElement;

          expect(appendedElement.style.height).toBe('45px');
          expect(appendedElement.style.transform).toBe('translate(50px, 20px)');
          expect(appendedElement.style.transition).toBe(
            'transform 300ms cubic-bezier(0.18, 0.89, 0.32, 1)',
          );
          expect(appendedElement.style.width).toBe('45px');
        });

        it('calls the document.createElement function', () => {
          expect(createElementSpy).toHaveBeenCalledWith('div');
        });

        it('calls the event.dataTransfer.setData function with correct parameters', () => {
          expect(setDataMock).toHaveBeenCalledWith(
            DATA_TRANSFER_MEDIA_ID,
            JSON.stringify(mediaMock),
          );
        });

        it('adds the dragover event listener function', () => {
          expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
            'dragover',
            expect.any(Function),
          );
        });

        it('adds the dragenter event listener function', () => {
          expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
            'dragenter',
            expect.any(Function),
          );
        });

        it('adds the dragend event listener function', () => {
          expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
            'dragend',
            expect.any(Function),
          );
        });
      });
    });
  });

  describe('when event listeners are attached', () => {
    describe('when dragover event is called', () => {
      beforeEach(() => {
        documentEvents.dragover({
          clientX: 20,
          clientY: 10,
          preventDefault: vi.fn(),
        });
      });

      it('does not call the cancelAnimationFrame function', () => {
        expect(cancelAnimationFrameSpy).not.toHaveBeenCalled();
      });

      it('calls the requestAnimationFrame function', () => {
        expect(requestAnimationFrameSpy).toHaveBeenCalled();
      });

      describe('when dragover event is called again', () => {
        beforeEach(() => {
          documentEvents.dragover({
            clientX: 20,
            clientY: 10,
            preventDefault: vi.fn(),
          });
        });

        afterEach(() => {
          vi.advanceTimersByTime(TRANSFORM_SPEED);
        });

        it('calls the cancelAnimationFrame function', () => {
          expect(cancelAnimationFrameSpy).toHaveBeenCalled();
        });

        it('calls the requestAnimationFrame function again', () => {
          expect(requestAnimationFrameSpy).toHaveBeenCalled();
        });
      });
    });

    describe('when dragenter event is called', () => {
      describe('when closest does not return a value', () => {
        beforeEach(() => {
          closestSpy.mockReturnValue(null);

          documentEvents.dragenter({
            preventDefault: vi.fn(),
            target: document.createElement('span'),
          });
        });

        it('does not call the element.addEventListener function', () => {
          expect(htmlAddEventListenerSpy).not.toHaveBeenCalled();
        });
      });

      describe('when closest does return a value', () => {
        beforeEach(() => {
          closestSpy.mockReturnValue(document.createElement('span'));

          documentEvents.dragenter({
            preventDefault: vi.fn(),
            target: document.createElement('span'),
          });
        });

        it('calls the element.classList.add function', () => {
          expect(addClassMock).toHaveBeenCalledWith(
            DRAG_AND_DROP_CLASS_NAMES.validDropZone,
          );
        });

        it('calls the element.addEventListener function', () => {
          expect(htmlAddEventListenerSpy).toHaveBeenCalledWith(
            'dragleave',
            expect.any(Function),
          );
        });
      });

      describe('when dragleave event is called', () => {
        describe('when event.relatedTarget is defined', () => {
          describe('when element contains the relatedTarget', () => {
            beforeEach(() => {
              containsSpy.mockReturnValueOnce(true);

              documentEvents.dragleave({
                currentTarget: document.createElement('span'),
                preventDefault: vi.fn(),
                relatedTarget: document.createElement('span'),
              });
            });

            it('does not call the element.removeEventListener function', () => {
              expect(htmlRemoveEventListenerSpy).not.toHaveBeenCalled();
            });
          });

          describe('when does not element contains the relatedTarget', () => {
            beforeEach(() => {
              documentEvents.dragleave({
                currentTarget: document.createElement('span'),
                preventDefault: vi.fn(),
                relatedTarget: document.createElement('span'),
              });
            });

            it('calls the element.removeEventListener function', () => {
              expect(htmlRemoveEventListenerSpy).toHaveBeenCalledWith(
                'dragleave',
                expect.any(Function),
              );
            });
          });
        });

        describe('when event.relatedTarget is not defined', () => {
          beforeEach(() => {
            documentEvents.dragleave({
              currentTarget: document.createElement('span'),
              preventDefault: vi.fn(),
            });
          });

          it('calls the element.removeEventListener function', () => {
            expect(htmlRemoveEventListenerSpy).toHaveBeenCalledWith(
              'dragleave',
              expect.any(Function),
            );
          });
        });
      });
    });

    describe('when dragend event is called', () => {
      beforeEach(() => {
        documentEvents.dragend();
      });

      afterAll(() => {
        vi.advanceTimersByTime(TRANSFORM_SPEED);
      });

      it('removes the dragover event listener function', () => {
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
          'dragover',
          expect.any(Function),
        );
      });

      it('removes the dragenter event listener function', () => {
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
          'dragenter',
          expect.any(Function),
        );
      });

      it('removes the dragend event listener function', () => {
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
          'dragend',
          expect.any(Function),
        );
      });

      describe('when animationFrameId is not defined', () => {
        it('does not call the cancelAnimationFrame function', () => {
          expect(cancelAnimationFrameSpy).not.toHaveBeenCalled();
        });
      });

      describe('when animationFrameId is defined', () => {
        beforeEach(() => {
          documentEvents.dragover({
            clientX: 20,
            clientY: 10,
            preventDefault: vi.fn(),
          });
          documentEvents.dragend();
        });

        it('calls the cancelAnimationFrame function', () => {
          expect(cancelAnimationFrameSpy).toHaveBeenCalled();
        });
      });
    });
  });
});

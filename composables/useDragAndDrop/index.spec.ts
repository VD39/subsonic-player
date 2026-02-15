import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { classListMock } from '@/test/classListMock';
import {
  documentEventListenerMock,
  htmlEventListenerMock,
} from '@/test/eventListenersMock';
import { getFormattedQueueTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import { useDragAndDrop } from './index';

vi.useFakeTimers();

const appendChildSpy = vi.spyOn(document.body, 'appendChild');
const createElementSpy = vi.spyOn(document, 'createElement');
const jsonParseSpy = vi.spyOn(JSON, 'parse');
const requestAnimationFrameSpy = vi.spyOn(globalThis, 'requestAnimationFrame');
const cancelAnimationFrameSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
const querySelectorSpy = vi.spyOn(HTMLElement.prototype, 'querySelector');
const closestSpy = vi.spyOn(HTMLElement.prototype, 'closest');
const containsSpy = vi
  .spyOn(HTMLElement.prototype, 'contains')
  .mockReturnValue(false);

HTMLElement.prototype.getBoundingClientRect = () =>
  ({
    left: 50,
    top: 20,
  }) as DOMRect;

const getDataMock = vi.fn();
const setDataMock = vi.fn();

function createDragStartDragEvent(
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

const {
  documentAddEventListenerSpy,
  documentEvents,
  documentRemoveEventListenerSpy,
} = documentEventListenerMock();
const { htmlAddEventListenerSpy, htmlEvents, htmlRemoveEventListenerSpy } =
  htmlEventListenerMock();
const { addClassMock, containsClassMock, removeClassMock } = classListMock();

function createDropDragEvent(
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

const getMediaTracksMock = vi.fn();

mockNuxtImport('useMediaTracks', () => () => ({
  getMediaTracks: getMediaTracksMock,
}));

const addToPlaylistMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addToPlaylist: addToPlaylistMock,
}));

const { addTracksToQueueMock } = useAudioPlayerMock();

const mediaMock = getFormattedQueueTracksMock()[0];

const { dragStart, drop } = useDragAndDrop();

describe('useDragAndDrop', () => {
  describe('when the drop function is called', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    beforeEach(() => {
      drop('drop-id', createDropDragEvent(false));
    });

    it('calls the target.classList.remove function', () => {
      expect(removeClassMock).toHaveBeenCalledWith(
        DRAG_AND_DROP_CLASS_NAMES.validDropZone,
      );
    });

    describe(`when element does not have a ${DRAG_AND_DROP_CLASS_NAMES.isDroppable} class`, () => {
      it('does not call the event.dataTransfer.getData function', () => {
        expect(getDataMock).not.toHaveBeenCalled();
      });
    });

    describe(`when element does have a ${DRAG_AND_DROP_CLASS_NAMES.isDroppable} class`, () => {
      describe('when event.dataTransfer.getData does not return any data', () => {
        beforeEach(() => {
          drop('drop-id', createDropDragEvent());
        });

        it('does not call the JSON.parse function', () => {
          expect(jsonParseSpy).not.toHaveBeenCalled();
        });
      });

      describe('when event.dataTransfer.getData does return data', () => {
        describe('when dataTransfer data return is not valid', () => {
          beforeEach(() => {
            drop(
              'drop-id',
              createDropDragEvent(
                true,
                JSON.stringify({
                  id: 'id',
                }),
              ),
            );
          });

          it('does not call the addTracksToQueue function', () => {
            expect(addTracksToQueueMock).not.toHaveBeenCalled();
          });

          it('does not call the addToPlaylist function', () => {
            expect(addToPlaylistMock).not.toHaveBeenCalled();
          });
        });

        describe('when dataTransfer data return is valid', () => {
          describe.each([
            [
              QUEUE_ID,
              {
                addToPlaylist: 0,
                addTracksToQueue: 1,
              },
            ],
            [
              'drop-id',
              {
                addToPlaylist: 2,
                addTracksToQueue: 0,
              },
            ],
          ])('when dropId is %s', (dropId, expectedCalls) => {
            describe('when getMediaTracks returns tracks', () => {
              beforeEach(() => {
                getMediaTracksMock.mockResolvedValue([{}, {}]);

                drop(
                  dropId,
                  createDropDragEvent(
                    true,
                    JSON.stringify({
                      id: 'id',
                      type: MEDIA_TYPE.track,
                    }),
                  ),
                );
              });

              it('calls the getMediaTracks function', () => {
                expect(getMediaTracksMock).toHaveBeenCalled();
              });

              it(`${expectedCalls.addTracksToQueue > 0 ? 'calls' : 'does not call'} the addTracksToQueue function`, () => {
                expect(addTracksToQueueMock).toHaveBeenCalledTimes(
                  expectedCalls.addTracksToQueue,
                );
              });

              it(`${expectedCalls.addToPlaylist > 0 ? 'calls' : 'does not call'} the addToPlaylist function`, () => {
                expect(addToPlaylistMock).toHaveBeenCalledTimes(
                  expectedCalls.addToPlaylist,
                );
              });
            });

            describe('when getMediaTracks returns an empty array', () => {
              beforeEach(() => {
                getMediaTracksMock.mockResolvedValue([]);

                drop(
                  dropId,
                  createDropDragEvent(
                    true,
                    JSON.stringify({
                      id: 'id',
                      type: MEDIA_TYPE.track,
                    }),
                  ),
                );
              });

              it('calls the getMediaTracks function', () => {
                expect(getMediaTracksMock).toHaveBeenCalled();
              });

              it('does not call the addTracksToQueue function', () => {
                expect(addTracksToQueueMock).not.toHaveBeenCalled();
              });

              it('does not call the addToPlaylist function', () => {
                expect(addToPlaylistMock).not.toHaveBeenCalled();
              });
            });
          });

          describe('when drop is called multiple times', () => {
            beforeEach(() => {
              getMediaTracksMock.mockResolvedValue([{}, {}]);

              drop(
                'drop-id',
                createDropDragEvent(
                  true,
                  JSON.stringify({
                    id: 'id',
                    type: MEDIA_TYPE.album,
                  }),
                ),
              );

              drop(
                'drop-id',
                createDropDragEvent(
                  true,
                  JSON.stringify({
                    id: 'id',
                    type: MEDIA_TYPE.album,
                  }),
                ),
              );

              drop(
                'drop-id',
                createDropDragEvent(
                  true,
                  JSON.stringify({
                    id: 'id',
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

  describe('when the dragStart function is called', () => {
    describe('when dataTransfer is not defined', () => {
      beforeEach(() => {
        const { dragStart } = useDragAndDrop();
        dragStart(mediaMock, createDragStartDragEvent(false));
      });

      it('does not call the querySelector function', () => {
        expect(querySelectorSpy).not.toHaveBeenCalled();
      });
    });

    describe('when media is not valid', () => {
      beforeEach(() => {
        const { dragStart } = useDragAndDrop();
        dragStart({} as never, createDragStartDragEvent());
      });

      it('does not call the querySelector function', () => {
        expect(querySelectorSpy).not.toHaveBeenCalled();
      });
    });

    describe('when dataTransfer is defined and media is valid', () => {
      beforeEach(() => {
        const { dragStart } = useDragAndDrop();
        dragStart(mediaMock, createDragStartDragEvent(true, null));
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
          const { dragStart } = useDragAndDrop();
          dragStart(mediaMock, createDragStartDragEvent(true));
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

        it('calls the event.dataTransfer.setData function with the correct parameters', () => {
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

    describe('when the dragStart function is called multiple times', () => {
      beforeEach(() => {
        const { dragStart } = useDragAndDrop();
        dragStart(mediaMock, createDragStartDragEvent(false));
        vi.clearAllMocks();
        dragStart(mediaMock, createDragStartDragEvent(false));
      });

      it('does not call the clonedEl.classList.add function', () => {
        expect(addClassMock).not.toHaveBeenCalledWith(
          DRAG_AND_DROP_CLASS_NAMES.clonedElement,
        );
      });

      it('does not call the document.createElement function', () => {
        expect(createElementSpy).not.toHaveBeenCalledWith('div');
      });

      it('does not add the dragover event listener function', () => {
        expect(documentAddEventListenerSpy).not.toHaveBeenCalledWith(
          'dragover',
          expect.any(Function),
        );
      });

      it('does not add the dragenter event listener function', () => {
        expect(documentAddEventListenerSpy).not.toHaveBeenCalledWith(
          'dragenter',
          expect.any(Function),
        );
      });

      it('does not add the dragend event listener function', () => {
        expect(documentAddEventListenerSpy).not.toHaveBeenCalledWith(
          'dragend',
          expect.any(Function),
        );
      });
    });
  });

  describe('when event listeners are attached', () => {
    describe('when the dragover event is called', () => {
      afterEach(() => {
        vi.clearAllMocks();
      });

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

      describe('when the dragover event is called again', () => {
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

    describe('when the dragenter event is called', () => {
      afterEach(() => {
        vi.clearAllMocks();
      });

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

      describe('when the dragleave event is called', () => {
        describe('when event.relatedTarget is defined', () => {
          describe('when element contains the relatedTarget', () => {
            beforeEach(() => {
              containsSpy.mockReturnValueOnce(true);

              htmlEvents.dragleave({
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
              htmlEvents.dragleave({
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
            htmlEvents.dragleave({
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

    describe('when the dragend event is called', () => {
      beforeEach(async () => {
        await documentEvents.dragend();
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
          dragStart(mediaMock, createDragStartDragEvent(true));
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

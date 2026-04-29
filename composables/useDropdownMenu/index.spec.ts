import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { STATE_NAMES } from '@/constants/state';
import { abortControllerMock } from '@/test/abortControllerMock';
import {
  documentEventListenerMock,
  windowEventListenerMock,
} from '@/test/eventListenersMock';
import { refElementMock } from '@/test/refElementMock';
import { withSetup } from '@/test/withSetup';

import { useDropdownMenu } from './index';

const lockScrollMock = vi.fn();
const unlockScrollMock = vi.fn();

mockNuxtImport('useScrollLock', () => () => ({
  lockScroll: lockScrollMock,
  unlockScroll: unlockScrollMock,
}));

const activeMenuId = useState(STATE_NAMES.dropdownActiveMenuId);
const setActiveMenuIdMock = vi.fn((id: string) => {
  activeMenuId.value = id;
});
const clearActiveMenuIdMock = vi.fn(() => {
  activeMenuId.value = null;
});

mockNuxtImport('useDropdownMenuState', () => () => ({
  activeMenuId,
  clearActiveMenuId: clearActiveMenuIdMock,
  setActiveMenuId: setActiveMenuIdMock,
}));

const { documentAddEventListenerSpy, documentEvents } =
  documentEventListenerMock();
const { windowAddEventListenerSpy, windowEvents } = windowEventListenerMock();
const { abortControllerConstructorMock, abortMock, signalMock } =
  abortControllerMock();

const dropdownMenuRef = refElementMock();
const dropdownListRef = refElementMock();

describe('useDropdownMenu', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof useDropdownMenu>>>;

  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    result = withSetup(() =>
      useDropdownMenu({
        dropdownListRef: dropdownListRef.refMock,
        dropdownMenuRef: dropdownMenuRef.refMock,
      }),
    );
  });

  describe('when the openDropdownMenu function is called', () => {
    beforeEach(async () => {
      await result.composable.openDropdownMenu();
    });

    it('sets isOpen to true', () => {
      expect(result.composable.isOpen.value).toBe(true);
    });

    it('calls the setActiveMenuId function', () => {
      expect(setActiveMenuIdMock).toHaveBeenCalled();
    });

    it('calls the lockScroll function', () => {
      expect(lockScrollMock).toHaveBeenCalled();
    });

    it('creates an AbortController for event listener cleanup', () => {
      expect(abortControllerConstructorMock).toHaveBeenCalled();
    });

    it('adds the keydown event listener function', () => {
      expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
        {
          signal: signalMock,
        },
      );
    });

    it('adds the click event listener function', () => {
      expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        {
          signal: signalMock,
        },
      );
    });

    it('adds the contextmenu event listener function', () => {
      expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
        'contextmenu',
        expect.any(Function),
        {
          signal: signalMock,
        },
      );
    });

    describe('when the dropdown list element is not available', () => {
      beforeEach(async () => {
        result = withSetup(() =>
          useDropdownMenu({
            dropdownListRef: ref(null),
            dropdownMenuRef: dropdownMenuRef.refMock,
          }),
        );

        await result.composable.openDropdownMenu();
      });

      it('does not set the menuStyle value', () => {
        expect(result.composable.menuStyle.value).toEqual({});
      });
    });

    describe('when the dropdown menu element is not available', () => {
      beforeEach(async () => {
        result = withSetup(() =>
          useDropdownMenu({
            dropdownListRef: dropdownListRef.refMock,
            dropdownMenuRef: ref(null),
          }),
        );

        await result.composable.openDropdownMenu();
      });

      it('does not set the menuStyle value', () => {
        expect(result.composable.menuStyle.value).toEqual({});
      });
    });

    describe('when the event is not defined', () => {
      describe('when the menu fits within the viewport', () => {
        beforeEach(async () => {
          await result.composable.openDropdownMenu();
        });

        it('positions the menu at the expected coordinates', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '35px',
            top: '50px',
          });
        });
      });

      describe('when the menu overflows the bottom edge of the viewport', () => {
        describe('when there is enough space to open above the trigger', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 50,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 500,
            });

            await result.composable.openDropdownMenu();
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '35px',
              top: '90px',
            });
          });
        });

        describe('when there is not enough space to open above the trigger', () => {
          beforeEach(async () => {
            dropdownMenuRef.getBoundingClientRectMock.mockReturnValueOnce({
              bottom: 100,
              height: 100,
              left: 35,
              right: 89,
              top: 10,
              width: 54,
            } as unknown as DOMRect);

            await result.composable.openDropdownMenu();
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '35px',
              top: '0px',
            });
          });
        });
      });

      describe('when the menu overflows the right edge of the viewport', () => {
        describe('when there is enough space to align to the right edge of the trigger', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 500,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 50,
            });

            await result.composable.openDropdownMenu();
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '135px',
              top: '50px',
            });
          });
        });

        describe('when there is not enough space to align to the right edge of the trigger', () => {
          beforeEach(async () => {
            dropdownMenuRef.getBoundingClientRectMock.mockReturnValueOnce({
              bottom: 50,
              height: 10,
              left: 35,
              right: 39,
              top: 100,
              width: 54,
            } as unknown as DOMRect);

            await result.composable.openDropdownMenu();
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '0px',
              top: '50px',
            });
          });
        });
      });

      describe('when the menu overflows both the bottom and right edges of the viewport', () => {
        beforeEach(async () => {
          Object.defineProperty(globalThis, 'innerHeight', {
            configurable: true,
            value: 50,
          });

          Object.defineProperty(globalThis, 'innerWidth', {
            configurable: true,
            value: 50,
          });

          await result.composable.openDropdownMenu();
        });

        it('positions the menu at the expected coordinates', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '135px',
            top: '90px',
          });
        });
      });
    });

    describe('when event is a touch event', () => {
      describe('when the touch has active touch points', () => {
        describe('when the menu fits within the viewport', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 500,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 500,
            });

            await result.composable.openDropdownMenu({
              touches: [
                {
                  clientX: 50,
                  clientY: 50,
                } as Touch,
              ],
            } as unknown as TouchEvent);
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '50px',
              top: '50px',
            });
          });
        });

        describe('when the menu overflows the bottom edge of the viewport', () => {
          describe('when there is enough space to open above the pointer', () => {
            beforeEach(async () => {
              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 100,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 200,
              });

              await result.composable.openDropdownMenu({
                touches: [
                  {
                    clientX: 100,
                    clientY: 100,
                  } as Touch,
                ],
              } as unknown as TouchEvent);
            });

            it('positions the menu at the expected coordinates', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '100px',
                top: '90px',
              });
            });
          });

          describe('when there is not enough space to open above the pointer', () => {
            beforeEach(async () => {
              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 50,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 200,
              });

              dropdownListRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 50,
                height: 100,
                left: 35,
                right: 189,
                top: 100,
                width: 54,
              } as unknown as DOMRect);

              await result.composable.openDropdownMenu({
                touches: [
                  {
                    clientX: 100,
                    clientY: 100,
                  } as Touch,
                ],
              } as unknown as TouchEvent);
            });

            it('positions the menu at the expected coordinates', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '100px',
                top: '0px',
              });
            });
          });
        });

        describe('when the menu overflows the right edge of the viewport', () => {
          describe('when there is enough space to open left of the pointer', () => {
            beforeEach(async () => {
              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 500,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 500,
              });

              await result.composable.openDropdownMenu({
                touches: [
                  {
                    clientX: 450,
                    clientY: 100,
                  } as Touch,
                ],
              } as unknown as TouchEvent);
            });

            it('positions the menu at the expected coordinates', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '396px',
                top: '100px',
              });
            });
          });

          describe('when there is not enough space to open left of the pointer', () => {
            beforeEach(async () => {
              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 500,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 50,
              });

              dropdownListRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 50,
                height: 10,
                left: 35,
                right: 189,
                top: 100,
                width: 54,
              } as unknown as DOMRect);

              await result.composable.openDropdownMenu({
                touches: [
                  {
                    clientX: 45,
                    clientY: 100,
                  } as Touch,
                ],
              } as unknown as TouchEvent);
            });

            it('positions the menu at the expected coordinates', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '0px',
                top: '100px',
              });
            });
          });
        });

        describe('when the menu overflows both the bottom and right edges of the viewport', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 500,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 500,
            });

            await result.composable.openDropdownMenu({
              touches: [
                {
                  clientX: 500,
                  clientY: 500,
                } as Touch,
              ],
            } as unknown as TouchEvent);
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '446px',
              top: '490px',
            });
          });
        });
      });

      describe('when the touch uses changedTouches as fallback', () => {
        describe('when the menu fits within the viewport', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 500,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 500,
            });

            await result.composable.openDropdownMenu({
              changedTouches: [
                {
                  clientX: 50,
                  clientY: 50,
                } as Touch,
              ],
              touches: [],
            } as unknown as TouchEvent);
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '50px',
              top: '50px',
            });
          });
        });

        describe('when the menu overflows the bottom edge of the viewport', () => {
          describe('when there is enough space to open above the pointer', () => {
            beforeEach(async () => {
              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 100,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 200,
              });

              await result.composable.openDropdownMenu({
                changedTouches: [
                  {
                    clientX: 100,
                    clientY: 100,
                  } as Touch,
                ],
                touches: [],
              } as unknown as TouchEvent);
            });

            it('positions the menu at the expected coordinates', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '100px',
                top: '90px',
              });
            });
          });

          describe('when there is not enough space to open above the pointer', () => {
            beforeEach(async () => {
              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 50,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 200,
              });

              dropdownListRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 50,
                height: 100,
                left: 35,
                right: 189,
                top: 100,
                width: 54,
              } as unknown as DOMRect);

              await result.composable.openDropdownMenu({
                changedTouches: [
                  {
                    clientX: 100,
                    clientY: 100,
                  } as Touch,
                ],
                touches: [],
              } as unknown as TouchEvent);
            });

            it('positions the menu at the expected coordinates', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '100px',
                top: '0px',
              });
            });
          });
        });

        describe('when the menu overflows the right edge of the viewport', () => {
          describe('when there is enough space to open left of the pointer', () => {
            beforeEach(async () => {
              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 500,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 500,
              });

              await result.composable.openDropdownMenu({
                changedTouches: [
                  {
                    clientX: 450,
                    clientY: 100,
                  } as Touch,
                ],
                touches: [],
              } as unknown as TouchEvent);
            });

            it('positions the menu at the expected coordinates', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '396px',
                top: '100px',
              });
            });
          });

          describe('when there is not enough space to open left of the pointer', () => {
            beforeEach(async () => {
              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 500,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 50,
              });

              dropdownListRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 50,
                height: 10,
                left: 35,
                right: 189,
                top: 100,
                width: 54,
              } as unknown as DOMRect);

              await result.composable.openDropdownMenu({
                changedTouches: [
                  {
                    clientX: 45,
                    clientY: 100,
                  } as Touch,
                ],
                touches: [],
              } as unknown as TouchEvent);
            });

            it('positions the menu at the expected coordinates', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '0px',
                top: '100px',
              });
            });
          });
        });

        describe('when the menu overflows both the bottom and right edges of the viewport', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 500,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 500,
            });

            await result.composable.openDropdownMenu({
              changedTouches: [
                {
                  clientX: 500,
                  clientY: 500,
                } as Touch,
              ],
              touches: [],
            } as unknown as TouchEvent);
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '446px',
              top: '490px',
            });
          });
        });
      });

      describe('when the touch event has no coordinates', () => {
        beforeEach(async () => {
          await result.composable.openDropdownMenu({
            changedTouches: [],
            touches: [],
          } as unknown as TouchEvent);
        });

        it('falls back to positioning the menu relative to the trigger', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '35px',
            top: '50px',
          });
        });
      });
    });

    describe('when event is a mouse event', () => {
      describe('when the menu fits within the viewport', () => {
        beforeEach(async () => {
          Object.defineProperty(globalThis, 'innerHeight', {
            configurable: true,
            value: 500,
          });

          Object.defineProperty(globalThis, 'innerWidth', {
            configurable: true,
            value: 500,
          });

          await result.composable.openDropdownMenu(
            new MouseEvent('click', {
              clientX: 50,
              clientY: 50,
            }),
          );
        });

        it('positions the menu at the expected coordinates', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '50px',
            top: '50px',
          });
        });
      });

      describe('when the menu overflows the bottom edge of the viewport', () => {
        describe('when there is enough space to open above the pointer', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 100,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 200,
            });

            await result.composable.openDropdownMenu(
              new MouseEvent('click', {
                clientX: 100,
                clientY: 100,
              }),
            );
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '100px',
              top: '90px',
            });
          });
        });

        describe('when there is not enough space to open above the pointer', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 50,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 200,
            });

            dropdownListRef.getBoundingClientRectMock.mockReturnValueOnce({
              bottom: 50,
              height: 100,
              left: 35,
              right: 189,
              top: 100,
              width: 54,
            } as unknown as DOMRect);

            await result.composable.openDropdownMenu(
              new MouseEvent('click', {
                clientX: 100,
                clientY: 100,
              }),
            );
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '100px',
              top: '0px',
            });
          });
        });
      });

      describe('when the menu overflows the right edge of the viewport', () => {
        describe('when there is enough space to open left of the pointer', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 500,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 500,
            });

            await result.composable.openDropdownMenu(
              new MouseEvent('click', {
                clientX: 450,
                clientY: 100,
              }),
            );
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '396px',
              top: '100px',
            });
          });
        });

        describe('when there is not enough space to open left of the pointer', () => {
          beforeEach(async () => {
            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 500,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 50,
            });

            dropdownListRef.getBoundingClientRectMock.mockReturnValueOnce({
              bottom: 50,
              height: 10,
              left: 35,
              right: 189,
              top: 100,
              width: 54,
            } as unknown as DOMRect);

            await result.composable.openDropdownMenu(
              new MouseEvent('click', {
                clientX: 45,
                clientY: 100,
              }),
            );
          });

          it('positions the menu at the expected coordinates', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '0px',
              top: '100px',
            });
          });
        });
      });

      describe('when the menu overflows both the bottom and right edges of the viewport', () => {
        beforeEach(async () => {
          Object.defineProperty(globalThis, 'innerHeight', {
            configurable: true,
            value: 500,
          });

          Object.defineProperty(globalThis, 'innerWidth', {
            configurable: true,
            value: 500,
          });

          await result.composable.openDropdownMenu(
            new MouseEvent('click', {
              clientX: 500,
              clientY: 500,
            }),
          );
        });

        it('positions the menu at the expected coordinates', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '446px',
            top: '490px',
          });
        });
      });
    });

    describe('when the click event is called', () => {
      describe('when the dropdown menu element is not available', () => {
        beforeEach(async () => {
          result = withSetup(() =>
            useDropdownMenu({
              dropdownListRef: dropdownListRef.refMock,
              dropdownMenuRef: ref(null),
            }),
          );

          await result.composable.openDropdownMenu();
          vi.clearAllMocks();

          windowEvents.click(new MouseEvent('click'));
        });

        it('does not call the closeDropdownMenu function', () => {
          expect(abortMock).not.toHaveBeenCalled();
        });
      });

      describe('when the dropdown list element is not available', () => {
        beforeEach(async () => {
          result = withSetup(() =>
            useDropdownMenu({
              dropdownListRef: ref(null),
              dropdownMenuRef: dropdownMenuRef.refMock,
            }),
          );

          await result.composable.openDropdownMenu();
          vi.clearAllMocks();

          windowEvents.click(new MouseEvent('click'));
        });

        it('does not call the closeDropdownMenu function', () => {
          expect(abortMock).not.toHaveBeenCalled();
        });
      });

      describe('when the click is outside the dropdown menu and dropdown list', () => {
        beforeEach(() => {
          windowEvents.click(new MouseEvent('click'));
        });

        // Full coverage is in "when the closeDropdownMenu function is called" test.
        it('calls the closeDropdownMenu function', () => {
          expect(abortMock).toHaveBeenCalled();
        });
      });

      describe('when the click is inside the dropdown list', () => {
        beforeEach(() => {
          dropdownListRef.containsMock.mockReturnValue(true);
          windowEvents.click(new MouseEvent('click'));
        });

        // Full coverage is in "when the closeDropdownMenu function is called" test.
        it('calls the closeDropdownMenu function', () => {
          expect(abortMock).toHaveBeenCalled();
        });
      });

      describe('when the click is inside the dropdown menu but not the dropdown list', () => {
        beforeEach(() => {
          dropdownMenuRef.containsMock.mockReturnValue(true);
          dropdownListRef.containsMock.mockReturnValue(false);

          windowEvents.click(new MouseEvent('click'));
        });

        // Full coverage is in "when the closeDropdownMenu function is called" test.
        it('does not call the closeDropdownMenu function', () => {
          expect(abortMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the keydown event is called', () => {
      beforeEach(() => {
        documentEvents.keydown({ key: 'Escape' });
      });

      // Full coverage is in "when the closeDropdownMenu function is called" test.
      it('calls the closeDropdownMenu function', () => {
        expect(abortMock).toHaveBeenCalled();
      });
    });

    describe('when the contextmenu event is called', () => {
      beforeEach(() => {
        windowEvents.contextmenu();
      });

      // Full coverage is in "when the closeDropdownMenu function is called" test.
      it('calls the closeDropdownMenu function', () => {
        expect(abortMock).toHaveBeenCalled();
      });
    });

    describe('when the resize event is called', () => {
      beforeEach(() => {
        windowEvents.resize();
      });

      // Full coverage is in "when the closeDropdownMenu function is called" test.
      it('calls the closeDropdownMenu function', () => {
        expect(abortMock).toHaveBeenCalled();
      });
    });

    describe('when the keydown event is called and the key is not Escape', () => {
      beforeEach(() => {
        documentEvents.keydown({ key: 'Enter' });
      });

      it('does not call the closeDropdownMenu function', () => {
        expect(abortMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the closeDropdownMenu function is called', () => {
    describe('when activeMenuId does not equal menuId', () => {
      beforeEach(async () => {
        await result.composable.openDropdownMenu();

        // Simulate another dropdown becoming active.
        activeMenuId.value = 'different-menu-id';

        vi.clearAllMocks();

        result.composable.closeDropdownMenu();
      });

      it('sets isOpen to false', () => {
        expect(result.composable.isOpen.value).toBe(false);
      });

      it('does not reset the menuStyle values', () => {
        expect(result.composable.menuStyle.value).toEqual({
          left: '35px',
          top: '50px',
        });
      });

      it('does not call the abort function', () => {
        expect(abortMock).not.toHaveBeenCalled();
      });

      it('does not call the unlockScroll function', () => {
        expect(unlockScrollMock).not.toHaveBeenCalled();
      });

      it('does not call the clearActiveMenuId function', () => {
        expect(clearActiveMenuIdMock).not.toHaveBeenCalled();
      });
    });

    describe('when activeMenuId equals menuId', () => {
      beforeEach(async () => {
        await result.composable.openDropdownMenu();
        result.composable.closeDropdownMenu();
      });

      it('sets isOpen to false', () => {
        expect(result.composable.isOpen.value).toBe(false);
      });

      it('resets the menuStyle values', () => {
        expect(result.composable.menuStyle.value).toEqual({});
      });

      it('calls the abort function', () => {
        expect(abortMock).toHaveBeenCalled();
      });

      it('calls the unlockScroll function', () => {
        expect(unlockScrollMock).toHaveBeenCalled();
      });

      it('calls the clearActiveMenuId function', () => {
        expect(clearActiveMenuIdMock).toHaveBeenCalled();
      });
    });
  });

  describe('when component is unmounted', () => {
    beforeEach(async () => {
      await result.composable.openDropdownMenu();
      result.app.unmount();
    });

    // Full coverage is in "when the closeDropdownMenu function is called" test.
    it('calls the abort function', () => {
      expect(abortMock).toHaveBeenCalled();
    });
  });
});

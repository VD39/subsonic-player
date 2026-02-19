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

const { documentAddEventListenerSpy, documentEvents } =
  documentEventListenerMock();
const { windowAddEventListenerSpy, windowEvents } = windowEventListenerMock();
const { abortControllerConstructorMock, abortMock, signalMock } =
  abortControllerMock();

const dropdownMenuRef = refElementMock();
const dropdownListRef = refElementMock();

const activeMenuId = useState(STATE_NAMES.dropdownActiveMenuId);

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

    it('calls the lockScroll function', () => {
      expect(lockScrollMock).toHaveBeenCalled();
    });

    it('adds the abort event listener functions', () => {
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

    describe('when no event is not defined', () => {
      describe('when top + height is less than globalThis.innerHeight and bottom + width is less than globalThis.innerWidth', () => {
        beforeEach(async () => {
          await result.composable.openDropdownMenu();
        });

        it('sets the menuStyle values with the correct values', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '35px',
            top: '50px',
          });
        });
      });

      describe('when top + height is greater than globalThis.innerHeight', () => {
        describe('when dropdownTop - height is greater than 0', () => {
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

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '35px',
              top: '90px',
            });
          });
        });

        describe('when dropdownTop - height is less than 0', () => {
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

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '35px',
              top: '0px',
            });
          });
        });
      });

      describe('when left + width is greater than globalThis.innerWidth', () => {
        describe('when dropdownRight - width is greater than 0', () => {
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

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '135px',
              top: '50px',
            });
          });
        });

        describe('when dropdownRight - width is less than 0', () => {
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

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '0px',
              top: '50px',
            });
          });
        });
      });

      describe('when top + height is greater than globalThis.innerHeight and left + width is greater than globalThis.innerWidth', () => {
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

        it('sets the menuStyle values with the correct values', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '135px',
            top: '90px',
          });
        });
      });
    });

    describe('when event is a touch event', () => {
      describe('when touches is not an empty array', () => {
        describe('when top + height is less than globalThis.innerHeight and bottom + width is less than globalThis.innerWidth', () => {
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

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '50px',
              top: '50px',
            });
          });
        });

        describe('when top + height is greater than globalThis.innerHeight', () => {
          describe('when touch.clientY - height is greater than 0', () => {
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

            it('sets the menuStyle values with the correct values', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '100px',
                top: '90px',
              });
            });
          });

          describe('when touch.clientY - height is less than 0', () => {
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

            it('sets the menuStyle values with the correct values', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '100px',
                top: '0px',
              });
            });
          });
        });

        describe('when left + width is greater than globalThis.innerWidth', () => {
          describe('when touch.clientX - width is greater than 0', () => {
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

            it('sets the menuStyle values with the correct values', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '396px',
                top: '100px',
              });
            });
          });

          describe('when touch.clientX - width is less than 0', () => {
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

            it('sets the menuStyle values with the correct values', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '0px',
                top: '100px',
              });
            });
          });
        });

        describe('when top + height is greater than globalThis.innerHeight and left + width is greater than globalThis.innerWidth', () => {
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

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '446px',
              top: '490px',
            });
          });
        });
      });

      describe('when touches is an empty array and changedTouches is not an empty array', () => {
        describe('when top + height is less than globalThis.innerHeight and bottom + width is less than globalThis.innerWidth', () => {
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

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '50px',
              top: '50px',
            });
          });
        });

        describe('when top + height is greater than globalThis.innerHeight', () => {
          describe('when touch.clientY - height is greater than 0', () => {
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

            it('sets the menuStyle values with the correct values', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '100px',
                top: '90px',
              });
            });
          });

          describe('when touch.clientY - height is less than 0', () => {
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

            it('sets the menuStyle values with the correct values', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '100px',
                top: '0px',
              });
            });
          });
        });

        describe('when left + width is greater than globalThis.innerWidth', () => {
          describe('when touch.clientX - width is greater than 0', () => {
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

            it('sets the menuStyle values with the correct values', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '396px',
                top: '100px',
              });
            });
          });

          describe('when touch.clientX - width is less than 0', () => {
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

            it('sets the menuStyle values with the correct values', () => {
              expect(result.composable.menuStyle.value).toEqual({
                left: '0px',
                top: '100px',
              });
            });
          });
        });

        describe('when top + height is greater than globalThis.innerHeight and left + width is greater than globalThis.innerWidth', () => {
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

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '446px',
              top: '490px',
            });
          });
        });
      });

      describe('when touches and changedTouches are empty arrays', () => {
        beforeEach(async () => {
          await result.composable.openDropdownMenu({
            changedTouches: [],
            touches: [],
          } as unknown as TouchEvent);
        });

        it('sets the menuStyle values to an empty object', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '35px',
            top: '50px',
          });
        });
      });
    });

    describe('when event is a mouse event', () => {
      describe('when top + height is less than globalThis.innerHeight and bottom + width is less than globalThis.innerWidth', () => {
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
            clientX: 50,
            clientY: 50,
          } as unknown as MouseEvent);
        });

        it('sets the menuStyle values with the correct values', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '50px',
            top: '50px',
          });
        });
      });

      describe('when top + height is greater than globalThis.innerHeight', () => {
        describe('when touch.clientY - height is greater than 0', () => {
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
              clientX: 100,
              clientY: 100,
            } as unknown as MouseEvent);
          });

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '100px',
              top: '90px',
            });
          });
        });

        describe('when touch.clientY - height is less than 0', () => {
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
              clientX: 100,
              clientY: 100,
            } as unknown as MouseEvent);
          });

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '100px',
              top: '0px',
            });
          });
        });
      });

      describe('when left + width is greater than globalThis.innerWidth', () => {
        describe('when touch.clientX - width is greater than 0', () => {
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
              clientX: 450,
              clientY: 100,
            } as unknown as MouseEvent);
          });

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '396px',
              top: '100px',
            });
          });
        });

        describe('when touch.clientX - width is less than 0', () => {
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
              clientX: 45,
              clientY: 100,
            } as unknown as MouseEvent);
          });

          it('sets the menuStyle values with the correct values', () => {
            expect(result.composable.menuStyle.value).toEqual({
              left: '0px',
              top: '100px',
            });
          });
        });
      });

      describe('when top + height is greater than globalThis.innerHeight and left + width is greater than globalThis.innerWidth', () => {
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
            clientX: 500,
            clientY: 500,
          } as unknown as MouseEvent);
        });

        it('sets the menuStyle values with the correct values', () => {
          expect(result.composable.menuStyle.value).toEqual({
            left: '446px',
            top: '490px',
          });
        });
      });
    });

    describe('when event is not a mouse or touch event', () => {
      beforeEach(async () => {
        await result.composable.openDropdownMenu({} as unknown as MouseEvent);
      });

      it('sets the menuStyle values to an empty object', () => {
        expect(result.composable.menuStyle.value).toEqual({
          left: '35px',
          top: '50px',
        });
      });
    });

    describe('when the click event is called', () => {
      describe('when the click is outside the dropdown menu and dropdown list', () => {
        beforeEach(() => {
          windowEvents.click({} as MouseEvent);
        });

        // Full coverage is in "when the closeDropdownMenu function is called" test.
        it('calls the closeDropdownMenu function', () => {
          expect(abortMock).toHaveBeenCalled();
        });
      });

      describe('when the click is inside the dropdown list', () => {
        beforeEach(() => {
          dropdownListRef.containsMock.mockReturnValue(true);
          windowEvents.click({} as MouseEvent);
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

          windowEvents.click({} as MouseEvent);
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
        windowEvents.contextmenu({} as MouseEvent);
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

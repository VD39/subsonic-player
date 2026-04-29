import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { abortControllerMock } from '@/test/abortControllerMock';
import { refElementMock } from '@/test/refElementMock';
import { withSetup } from '@/test/withSetup';

import { useDropdownSubmenu } from './submenu';

const matchesMock = ref(false);

Object.defineProperty(globalThis, 'matchMedia', {
  value: vi.fn(() => ({
    matches: matchesMock.value,
  })),
  writable: true,
});

const openEventCount = ref(0);

mockNuxtImport('useDropdownMenuState', () => () => ({
  openEventCount,
}));

const { abortControllerConstructorMock, abortMock, signalMock } =
  abortControllerMock();

const dropdownSubListRef = refElementMock();
const dropdownSubmenuRef = refElementMock();

describe('useDropdownSubmenu', () => {
  let result: ReturnType<
    typeof withSetup<ReturnType<typeof useDropdownSubmenu>>
  >;

  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    openEventCount.value = 0;
    matchesMock.value = true;

    result = withSetup(() =>
      useDropdownSubmenu({
        dropdownSubListRef: dropdownSubListRef.refMock,
        dropdownSubmenuRef: dropdownSubmenuRef.refMock,
      }),
    );
  });

  it('sets the default isOpen value', () => {
    expect(result.composable.isOpen.value).toBe(false);
  });

  it('sets the default openedLeft value', () => {
    expect(result.composable.openedLeft.value).toBe(false);
  });

  it('sets the default submenuStyle value', () => {
    expect(result.composable.submenuStyle.value).toEqual({});
  });

  describe('when the openSubmenu function is called', () => {
    describe('when the isHoverDevice value is true', () => {
      beforeEach(() => {
        result = withSetup(() =>
          useDropdownSubmenu({
            dropdownSubListRef: dropdownSubListRef.refMock,
            dropdownSubmenuRef: dropdownSubmenuRef.refMock,
          }),
        );
      });

      it('sets the correct isHoverDevice value', () => {
        expect(result.composable.isHoverDevice.value).toBe(true);
      });

      describe('when the submenu list element is not available', () => {
        beforeEach(async () => {
          result = withSetup(() =>
            useDropdownSubmenu({
              dropdownSubListRef: ref(null),
              dropdownSubmenuRef: dropdownSubmenuRef.refMock,
            }),
          );

          await result.composable.openSubmenu();
        });

        it('does not set the submenuStyle value', () => {
          expect(result.composable.submenuStyle.value).toEqual({});
        });
      });

      describe('when the submenu trigger element is not available', () => {
        beforeEach(async () => {
          result = withSetup(() =>
            useDropdownSubmenu({
              dropdownSubListRef: dropdownSubListRef.refMock,
              dropdownSubmenuRef: ref(null),
            }),
          );

          await result.composable.openSubmenu();
        });

        it('does not set the submenuStyle value', () => {
          expect(result.composable.submenuStyle.value).toEqual({});
        });
      });

      describe('when both submenu elements are available', () => {
        describe('when the submenu fits within the viewport on both axes', () => {
          beforeEach(async () => {
            dropdownSubmenuRef.getBoundingClientRectMock.mockReturnValueOnce({
              bottom: 100,
              height: 50,
              left: 35,
              right: 89,
              top: 50,
              width: 54,
            } as unknown as DOMRect);

            dropdownSubListRef.getBoundingClientRectMock.mockReturnValueOnce({
              bottom: 200,
              height: 100,
              left: 0,
              right: 150,
              top: 0,
              width: 150,
            } as unknown as DOMRect);

            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 500,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 500,
            });

            await result.composable.openSubmenu();
          });

          it('positions the submenu at the expected coordinates', () => {
            expect(result.composable.submenuStyle.value).toEqual({
              left: '89px',
              top: '50px',
            });
          });

          it('sets openedLeft to false', () => {
            expect(result.composable.openedLeft.value).toBe(false);
          });
        });

        describe('when the submenu overflows the right edge of the viewport', () => {
          describe('when there is enough space to open to the left', () => {
            beforeEach(async () => {
              dropdownSubmenuRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 100,
                height: 50,
                left: 200,
                right: 254,
                top: 50,
                width: 54,
              } as unknown as DOMRect);

              dropdownSubListRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 200,
                height: 100,
                left: 0,
                right: 150,
                top: 0,
                width: 150,
              } as unknown as DOMRect);

              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 500,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 300,
              });

              await result.composable.openSubmenu();
            });

            it('positions the submenu at the expected coordinates', () => {
              expect(result.composable.submenuStyle.value).toEqual({
                left: '50px',
                top: '50px',
              });
            });

            it('sets openedLeft to true', () => {
              expect(result.composable.openedLeft.value).toBe(true);
            });
          });

          describe('when there is not enough space to open to the left', () => {
            beforeEach(async () => {
              dropdownSubmenuRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 100,
                height: 50,
                left: 35,
                right: 89,
                top: 50,
                width: 54,
              } as unknown as DOMRect);

              dropdownSubListRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 200,
                height: 100,
                left: 0,
                right: 150,
                top: 0,
                width: 150,
              } as unknown as DOMRect);

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 100,
              });

              await result.composable.openSubmenu();
            });

            it('positions the submenu at the expected coordinates', () => {
              expect(result.composable.submenuStyle.value).toEqual({
                left: '0px',
                top: '50px',
              });
            });

            it('sets openedLeft to true', () => {
              expect(result.composable.openedLeft.value).toBe(true);
            });
          });
        });

        describe('when the submenu overflows the bottom edge of the viewport', () => {
          describe('when the viewport is tall enough to contain the submenu', () => {
            beforeEach(async () => {
              dropdownSubmenuRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 100,
                height: 50,
                left: 35,
                right: 89,
                top: 400,
                width: 54,
              } as unknown as DOMRect);

              dropdownSubListRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 200,
                height: 150,
                left: 0,
                right: 150,
                top: 0,
                width: 150,
              } as unknown as DOMRect);

              Object.defineProperty(globalThis, 'innerHeight', {
                configurable: true,
                value: 450,
              });

              Object.defineProperty(globalThis, 'innerWidth', {
                configurable: true,
                value: 500,
              });

              await result.composable.openSubmenu();
            });

            it('positions the submenu at the expected coordinates', () => {
              expect(result.composable.submenuStyle.value).toEqual({
                left: '89px',
                top: '300px',
              });
            });
          });

          describe('when the submenu is taller than the viewport', () => {
            beforeEach(async () => {
              dropdownSubmenuRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 100,
                height: 50,
                left: 35,
                right: 89,
                top: 500,
                width: 54,
              } as unknown as DOMRect);

              dropdownSubListRef.getBoundingClientRectMock.mockReturnValueOnce({
                bottom: 200,
                height: 600,
                left: 0,
                right: 150,
                top: 0,
                width: 150,
              } as unknown as DOMRect);

              await result.composable.openSubmenu();
            });

            it('positions the submenu at the expected coordinates', () => {
              expect(result.composable.submenuStyle.value).toEqual({
                left: '89px',
                top: '0px',
              });
            });
          });
        });

        describe('when the submenu overflows both the right and bottom edges of the viewport', () => {
          beforeEach(async () => {
            dropdownSubmenuRef.getBoundingClientRectMock.mockReturnValueOnce({
              bottom: 100,
              height: 50,
              left: 200,
              right: 254,
              top: 400,
              width: 54,
            } as unknown as DOMRect);

            dropdownSubListRef.getBoundingClientRectMock.mockReturnValueOnce({
              bottom: 200,
              height: 150,
              left: 0,
              right: 150,
              top: 0,
              width: 150,
            } as unknown as DOMRect);

            Object.defineProperty(globalThis, 'innerHeight', {
              configurable: true,
              value: 450,
            });

            Object.defineProperty(globalThis, 'innerWidth', {
              configurable: true,
              value: 300,
            });

            await result.composable.openSubmenu();
          });

          it('positions the submenu at the expected coordinates', () => {
            expect(result.composable.submenuStyle.value).toEqual({
              left: '50px',
              top: '300px',
            });
          });

          it('sets openedLeft to true', () => {
            expect(result.composable.openedLeft.value).toBe(true);
          });
        });

        describe('when the submenu has no parent list element', () => {
          beforeEach(async () => {
            result = withSetup(() =>
              useDropdownSubmenu({
                dropdownSubListRef: dropdownSubListRef.refMock,
                dropdownSubmenuRef: ref({
                  ...dropdownSubmenuRef.refMock.value,
                  parentElement: undefined,
                }) as unknown as Ref<HTMLElement | null>,
              }),
            );

            await result.composable.openSubmenu();
          });

          it('does not call the AbortController constructor', () => {
            expect(abortControllerConstructorMock).not.toHaveBeenCalled();
          });

          it('does not call the addEventListener function on the parentElement', () => {
            expect(
              dropdownSubmenuRef.parentAddEventListenerMock,
            ).not.toHaveBeenCalled();
          });
        });

        describe('when the submenu has a parent list element', () => {
          beforeEach(async () => {
            await result.composable.openSubmenu();
          });

          it('calls the AbortController constructor', () => {
            expect(abortControllerConstructorMock).toHaveBeenCalled();
          });

          it('calls the addEventListener function on the parentElement', () => {
            expect(
              dropdownSubmenuRef.parentAddEventListenerMock,
            ).toHaveBeenCalledWith(
              'mouseover',
              expect.any(Function),
              expect.objectContaining({
                signal: signalMock,
              }),
            );
          });
        });

        describe('when a mouseover event fires on the parent list', () => {
          describe('when the mouse moves to a sibling menu item', () => {
            beforeEach(async () => {
              dropdownSubmenuRef.containsMock.mockReturnValue(false);

              await result.composable.openSubmenu();

              dropdownSubmenuRef.refMockElementEvent.mouseover({
                target: document.body,
              });
            });

            it('sets the isOpen value to false', () => {
              expect(result.composable.isOpen.value).toBe(false);
            });

            it('sets the openedLeft value to false', () => {
              expect(result.composable.openedLeft.value).toBe(false);
            });

            it('resets the submenuStyle value', () => {
              expect(result.composable.submenuStyle.value).toEqual({});
            });

            describe('when event listeners were registered', () => {
              it('calls the abort function', () => {
                expect(abortMock).toHaveBeenCalled();
              });
            });

            describe('when no event listeners were registered', () => {
              beforeEach(() => {
                vi.clearAllMocks();

                dropdownSubmenuRef.refMockElementEvent.mouseover({
                  target: document.body,
                });
              });

              it('does not call the abort function', () => {
                expect(abortMock).not.toHaveBeenCalled();
              });
            });
          });

          describe('when the mouse stays within the submenu', () => {
            beforeEach(async () => {
              dropdownSubmenuRef.containsMock.mockReturnValue(true);

              await result.composable.openSubmenu();

              dropdownSubmenuRef.refMockElementEvent.mouseover({
                target: dropdownSubmenuRef.refMock,
              } as unknown as MouseEvent);
            });

            it('does not call the abort function', () => {
              expect(abortMock).not.toHaveBeenCalled();
            });

            it('does not set the isOpen value', () => {
              expect(result.composable.isOpen.value).toBe(true);
            });

            it('does not reset the submenuStyle value', () => {
              expect(result.composable.submenuStyle.value).toEqual({
                left: '189px',
                top: '100px',
              });
            });
          });
        });
      });
    });

    describe('when the isHoverDevice value is false', () => {
      beforeEach(async () => {
        matchesMock.value = false;

        result = withSetup(() =>
          useDropdownSubmenu({
            dropdownSubListRef: dropdownSubListRef.refMock,
            dropdownSubmenuRef: dropdownSubmenuRef.refMock,
          }),
        );

        await result.composable.openSubmenu();
      });

      it('sets the correct isHoverDevice value', () => {
        expect(result.composable.isHoverDevice.value).toBe(false);
      });

      it('does not set the isOpen value', () => {
        expect(result.composable.isOpen.value).toBe(false);
      });

      it('does not set the submenuStyle value', () => {
        expect(result.composable.submenuStyle.value).toEqual({});
      });
    });
  });

  describe('when the toggleInline function is called', () => {
    describe('when the isHoverDevice value is true', () => {
      beforeEach(() => {
        result.composable.toggleInline(new MouseEvent('click'));
      });

      it('does not toggle the isOpen value', () => {
        expect(result.composable.isOpen.value).toBe(false);
      });
    });

    describe('when the isHoverDevice value is false', () => {
      beforeEach(() => {
        matchesMock.value = false;

        result = withSetup(() =>
          useDropdownSubmenu({
            dropdownSubListRef: dropdownSubListRef.refMock,
            dropdownSubmenuRef: dropdownSubmenuRef.refMock,
          }),
        );

        result.composable.toggleInline(new MouseEvent('click'));
      });

      it('toggles the isOpen value', () => {
        expect(result.composable.isOpen.value).toBe(true);
      });
    });
  });

  describe('when the openEventCount value changes', () => {
    beforeEach(async () => {
      await result.composable.openSubmenu();
      openEventCount.value++;
      await nextTick();
    });

    it('sets the correct isOpen value', () => {
      expect(result.composable.isOpen.value).toBe(false);
    });

    it('sets the openedLeft value to false', () => {
      expect(result.composable.openedLeft.value).toBe(false);
    });

    it('resets the submenuStyle value', () => {
      expect(result.composable.submenuStyle.value).toEqual({});
    });

    describe('when event listeners were registered', () => {
      it('calls the abort function', () => {
        expect(abortMock).toHaveBeenCalled();
      });
    });

    describe('when no event listeners were registered', () => {
      beforeEach(async () => {
        vi.clearAllMocks();

        result = withSetup(() =>
          useDropdownSubmenu({
            dropdownSubListRef: dropdownSubListRef.refMock,
            dropdownSubmenuRef: ref(null) as unknown as Ref<HTMLElement | null>,
          }),
        );

        await result.composable.openSubmenu();
        openEventCount.value++;
        await nextTick();
      });

      it('does not call the abort function', () => {
        expect(abortMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the closeSubmenu function is called', () => {
    beforeEach(async () => {
      await result.composable.openSubmenu();
      result.composable.closeSubmenu();
    });

    it('sets the isOpen value to false', () => {
      expect(result.composable.isOpen.value).toBe(false);
    });

    it('sets the openedLeft value to false', () => {
      expect(result.composable.openedLeft.value).toBe(false);
    });

    it('resets the submenuStyle value', () => {
      expect(result.composable.submenuStyle.value).toEqual({});
    });

    describe('when event listeners were registered', () => {
      it('calls the abort function', () => {
        expect(abortMock).toHaveBeenCalled();
      });
    });

    describe('when no event listeners were registered', () => {
      beforeEach(() => {
        vi.clearAllMocks();
        result.composable.closeSubmenu();
      });

      it('does not call the abort function', () => {
        expect(abortMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the component unmounts', () => {
    beforeEach(async () => {
      await result.composable.openSubmenu();
      result.app.unmount();
    });

    it('sets the isOpen value to false', () => {
      expect(result.composable.isOpen.value).toBe(false);
    });

    it('sets the openedLeft value to false', () => {
      expect(result.composable.openedLeft.value).toBe(false);
    });

    it('resets the submenuStyle value', () => {
      expect(result.composable.submenuStyle.value).toEqual({});
    });

    describe('when event listeners were registered', () => {
      it('calls the abort function', () => {
        expect(abortMock).toHaveBeenCalled();
      });
    });

    describe('when no event listeners were registered', () => {
      beforeEach(() => {
        vi.clearAllMocks();
        result.app.unmount();
      });

      it('does not call the abort function', () => {
        expect(abortMock).not.toHaveBeenCalled();
      });
    });
  });
});

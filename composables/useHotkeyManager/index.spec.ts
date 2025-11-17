import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { withSetup } from '@/test/withSetup';

import { useHotkeyManager } from './index';

const {
  fastForwardTrackMock,
  hasCurrentTrackMock,
  isPodcastEpisodeMock,
  isTrackMock,
  playNextTrackMock,
  playPreviousTrackMock,
  rewindTrackMock,
  setCurrentTimeMock,
  setPlaybackRateWithIncrementMock,
  setRepeatMock,
  setVolumeWithIncrementMock,
  toggleMuteMock,
  togglePlayMock,
  toggleShuffleMock,
} = useAudioPlayerMock();

const toggleFavouriteMock = vi.fn();

mockNuxtImport('useFavourite', () => () => ({
  toggleFavourite: toggleFavouriteMock,
}));

const addPlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addPlaylistModal: addPlaylistModalMock,
}));

const toggleQueuePlayerMock = vi.fn();

mockNuxtImport('useQueue', () => () => ({
  toggleQueuePlayer: toggleQueuePlayerMock,
}));

const addPodcastModalMock = vi.fn();

mockNuxtImport('usePodcast', () => () => ({
  addPodcastModal: addPodcastModalMock,
}));

const addRadioStationModalMock = vi.fn();

mockNuxtImport('useRadioStation', () => () => ({
  addRadioStationModal: addRadioStationModalMock,
}));

const modalMock = ref<ModalProps>({
  component: null,
});

mockNuxtImport('useModal', () => () => ({
  modal: modalMock,
}));

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
Object.defineProperty(document, 'visibilityState', {
  value: 'hidden',
  writable: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const windowEvents: any = {};

const windowAddEventListenerSpy = vi
  .spyOn(globalThis, 'addEventListener')
  .mockImplementation((event, cb) => {
    windowEvents[event] = cb;
  });
const windowRemoveEventListenerSpy = vi.spyOn(
  globalThis,
  'removeEventListener',
);

const focusMock = vi.fn();
const clickMock = vi.fn();
const blurMock = vi.fn();

const getElementByIdSpy = vi.spyOn(document, 'getElementById');

const ALL_MOCKS = {
  addPlaylistModal: addPlaylistModalMock,
  addPodcastModal: addPodcastModalMock,
  addRadioStationModal: addRadioStationModalMock,
  fastForwardTrack: fastForwardTrackMock,
  playNextTrack: playNextTrackMock,
  playPreviousTrack: playPreviousTrackMock,
  rewindTrack: rewindTrackMock,
  setCurrentTime: setCurrentTimeMock,
  setPlaybackRateWithIncrement: setPlaybackRateWithIncrementMock,
  setRepeat: setRepeatMock,
  setVolumeWithIncrement: setVolumeWithIncrementMock,
  toggleFavourite: toggleFavouriteMock,
  toggleMute: toggleMuteMock,
  togglePlay: togglePlayMock,
  toggleQueuePlayer: toggleQueuePlayerMock,
  toggleShuffle: toggleShuffleMock,
};

describe('useHotkeyManager', () => {
  let result: ReturnType<typeof withSetup<ReturnType<typeof useHotkeyManager>>>;

  function setEvents(keys: string[]) {
    beforeAll(() => {
      for (const key of keys) {
        documentEvents.keydown({
          key,
          preventDefault: vi.fn(),
        });
      }
    });

    afterAll(() => {
      for (const key of keys) {
        documentEvents.keyup({ key });
      }

      vi.clearAllMocks();
    });
  }

  function expectGetElementByIdMock(
    exceptId?: (typeof HOTKEY_ELEMENT_IDS)[keyof typeof HOTKEY_ELEMENT_IDS],
  ) {
    const { searchInput, ...ids } = HOTKEY_ELEMENT_IDS;

    for (const id of Object.values(ids)) {
      if (exceptId === id) {
        it(`calls the document.getElementById function with ${id}`, () => {
          expect(getElementByIdSpy).toHaveBeenCalledWith(id);
        });
      } else {
        it(`does not call the document.getElementById function with ${id}`, () => {
          expect(getElementByIdSpy).not.toHaveBeenCalledWith(id);
        });
      }
    }
  }

  function expectClickElementByIdMock(
    keys: string[],
    exceptId?: (typeof HOTKEY_ELEMENT_IDS)[keyof typeof HOTKEY_ELEMENT_IDS],
  ) {
    const activeElementFocusMock = vi.fn();

    expectGetElementByIdMock(exceptId);

    describe('when document.activeElement returns null', () => {
      beforeAll(() => {
        Object.defineProperty(document, 'activeElement', {
          value: null,
          writable: true,
        });
      });

      setEvents(keys);

      it('does not call the focus function', () => {
        expect(activeElementFocusMock).not.toHaveBeenCalled();
      });
    });

    describe('when document.activeElement returns focus value', () => {
      beforeAll(() => {
        Object.defineProperty(document, 'activeElement', {
          value: {
            focus: activeElementFocusMock,
            preventDefault: vi.fn(),
          },
          writable: true,
        });
      });

      setEvents(keys);

      it('calls the focus function', () => {
        expect(activeElementFocusMock).toHaveBeenCalled();
      });
    });

    describe('when document.getElementById returns null', () => {
      beforeAll(() => {
        getElementByIdSpy
          .mockReturnValueOnce({
            contains: vi.fn(() => false),
            focus: focusMock,
          } as never)
          .mockReturnValue(null);
      });

      setEvents(keys);

      it('does not call the blur function', () => {
        expect(blurMock).not.toHaveBeenCalled();
      });

      it('does not call the click function', () => {
        expect(clickMock).not.toHaveBeenCalled();
      });

      it('does not call the focus function', () => {
        expect(focusMock).not.toHaveBeenCalled();
      });
    });

    describe('when document.getElementById does not return null', () => {
      beforeAll(() => {
        getElementByIdSpy
          .mockReturnValueOnce({
            contains: vi.fn(() => false),
          } as never)
          .mockReturnValue({
            blur: blurMock,
            click: clickMock,
            contains: vi.fn(() => false),
            focus: focusMock,
          } as never);
      });

      setEvents(keys);

      it('calls the blur function', () => {
        expect(blurMock).toHaveBeenCalled();
      });

      it('calls the click function', () => {
        expect(clickMock).toHaveBeenCalled();
      });

      it('calls the focus function', () => {
        expect(focusMock).toHaveBeenCalled();
      });
    });
  }

  function expectMockToBeOrNotToBeCalled(
    exceptFunctionName?: keyof typeof ALL_MOCKS,
    exceptFunctionArg?: number | string | unknown[],
  ) {
    for (const [name, mock] of Object.entries(ALL_MOCKS)) {
      if (exceptFunctionName === name) {
        it(`calls the ${name} function`, () => {
          if (exceptFunctionArg) {
            expect(mock).toHaveBeenCalledWith(exceptFunctionArg);
          } else {
            expect(mock).toHaveBeenCalled();
          }
        });
      } else {
        it(`does not call the ${name} function`, () => {
          expect(mock).not.toHaveBeenCalled();
        });
      }
    }
  }

  beforeAll(() => {
    result = withSetup(useHotkeyManager);
  });

  it('sets the default isHotkeyListOpened value', () => {
    expect(result.composable.isHotkeyListOpened.value).toEqual(false);
  });

  it('adds the blur event listener function', () => {
    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      'blur',
      expect.any(Function),
    );
  });

  it('adds the keydown event listener function', () => {
    expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
      true,
    );
  });

  it('adds the keyup event listener function', () => {
    expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
      'keyup',
      expect.any(Function),
      true,
    );
  });

  it('adds the visibilitychange event listener function', () => {
    expect(documentAddEventListenerSpy).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    );
  });

  describe('when focus is in the search input', () => {
    beforeAll(() => {
      getElementByIdSpy.mockReturnValue({
        contains: vi.fn(() => true),
      } as never);
    });

    setEvents(['Shift', 'P']);

    expectMockToBeOrNotToBeCalled();
    expectGetElementByIdMock();
  });

  describe('when modal is showing', () => {
    beforeAll(() => {
      modalMock.value.component = {};
    });

    setEvents(['Shift', 'P']);

    expectMockToBeOrNotToBeCalled();
    expectGetElementByIdMock();
  });

  describe('when focus is not in the search input and modal is not showing', () => {
    beforeAll(() => {
      getElementByIdSpy
        .mockReturnValueOnce({
          contains: vi.fn(() => false),
        } as never)
        .mockReturnValue({
          blur: blurMock,
          click: clickMock,
          contains: vi.fn(() => false),
          focus: focusMock,
        } as never);

      modalMock.value.component = null;
    });

    describe('when H key is pressed', () => {
      setEvents(['H']);

      it('sets the correct isHotkeyListOpened value', () => {
        expect(result.composable.isHotkeyListOpened.value).toBe(true);
      });

      expectMockToBeOrNotToBeCalled();
      expectGetElementByIdMock();

      describe('when the same key is pressed again', () => {
        setEvents(['H']);

        it('sets the correct isHotkeyListOpened value', () => {
          expect(result.composable.isHotkeyListOpened.value).toBe(false);
        });
      });
    });

    describe('when / key is pressed', () => {
      describe('when element is not found', () => {
        beforeAll(() => {
          getElementByIdSpy.mockReturnValue(null);
        });

        setEvents(['/']);

        it('does not call the focus function', () => {
          expect(focusMock).not.toHaveBeenCalled();
        });

        expectMockToBeOrNotToBeCalled();
      });

      describe('when element is found', () => {
        beforeAll(() => {
          getElementByIdSpy
            .mockReturnValueOnce({
              contains: vi.fn(() => false),
              focus: focusMock,
            } as never)
            .mockReturnValue({
              blur: blurMock,
              click: clickMock,
              contains: vi.fn(() => false),
              focus: focusMock,
            } as never);
        });

        setEvents(['/']);

        it('calls the focus function', () => {
          expect(focusMock).toHaveBeenCalled();
        });

        expectMockToBeOrNotToBeCalled();
      });
    });

    describe.each([
      [['Alt', 'E'], 'addPodcastModal'],
      [['Alt', 'P'], 'addPlaylistModal'],
      [['Alt', 'R'], 'addRadioStationModal'],
    ])('when %s key is pressed', (keys, exceptFunctionName) => {
      setEvents(keys);

      expectGetElementByIdMock();
      expectMockToBeOrNotToBeCalled(
        exceptFunctionName as keyof typeof ALL_MOCKS,
      );
    });

    describe.each([
      [['Shift', 'R'], HOTKEY_ELEMENT_IDS.refreshDataButton],
      [['Shift', 'Enter'], HOTKEY_ELEMENT_IDS.playAllButton],
      [['Shift', 'S'], HOTKEY_ELEMENT_IDS.shuffleAllButton],
    ])('when %s key is pressed', (keys, exceptId) => {
      setEvents(keys);

      expectClickElementByIdMock(keys, exceptId);
      expectMockToBeOrNotToBeCalled();
    });

    describe('when L key is pressed', () => {
      describe('when hasCurrentTrack value is false', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = false;
        });

        setEvents(['L']);

        expectGetElementByIdMock();
        expectMockToBeOrNotToBeCalled();
      });

      describe('when hasCurrentTrack value is true', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = true;
        });

        describe('when isTrack value is false', () => {
          beforeAll(() => {
            isTrackMock.value = false;
          });

          setEvents(['L']);

          expectGetElementByIdMock();
          expectMockToBeOrNotToBeCalled();
        });

        describe('when isTrack value is true', () => {
          beforeAll(() => {
            isTrackMock.value = true;
          });

          setEvents(['L']);

          expectGetElementByIdMock();
          expectMockToBeOrNotToBeCalled('toggleFavourite');
        });
      });
    });

    describe.each([
      [['Alt', 'ArrowDown'], -1],
      [['Alt', 'ArrowUp'], 1],
    ])('when %s key is pressed', (keys, arg) => {
      describe('when hasCurrentTrack value is false', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = false;
        });

        setEvents(keys);

        expectGetElementByIdMock();
        expectMockToBeOrNotToBeCalled();
      });

      describe('when hasCurrentTrack value is true', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = true;
        });

        describe('when isPodcastEpisode value is false', () => {
          beforeAll(() => {
            isPodcastEpisodeMock.value = false;
          });

          setEvents(keys);

          expectGetElementByIdMock();
          expectMockToBeOrNotToBeCalled();
        });

        describe('when isPodcastEpisode value is true', () => {
          beforeAll(() => {
            isPodcastEpisodeMock.value = true;
          });

          setEvents(keys);

          expectGetElementByIdMock();
          expectMockToBeOrNotToBeCalled('setPlaybackRateWithIncrement', arg);
        });
      });
    });

    describe.each([
      [['Shift', 'ArrowDown'], 'setVolumeWithIncrement', -0.01],
      [['Shift', 'ArrowLeft'], 'rewindTrack'],
      [['Shift', 'ArrowRight'], 'fastForwardTrack'],
      [['Shift', 'ArrowUp'], 'setVolumeWithIncrement', 0.01],
      [['Control', 'ArrowLeft'], 'playPreviousTrack'],
      [['Control', 'ArrowRight'], 'playNextTrack'],
      [['Shift', 'P'], 'toggleQueuePlayer'],
      [[' '], 'togglePlay'],
      [['M'], 'toggleMute'],
      [['R'], 'setRepeat'],
      [['S'], 'toggleShuffle'],
    ])('when %s key is pressed', (keys, event, arg = undefined) => {
      describe('when hasCurrentTrack value is false', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = false;
        });

        setEvents(keys);

        expectMockToBeOrNotToBeCalled();
        expectGetElementByIdMock();
      });

      describe('when hasCurrentTrack value is true', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = true;
        });

        setEvents(keys);

        expectMockToBeOrNotToBeCalled(event as keyof typeof ALL_MOCKS, arg);
        expectGetElementByIdMock();
      });
    });

    describe.each([
      [['0'], 0],
      [['1'], 12],
      [['2'], 24],
      [['3'], 36],
      [['4'], 48],
      [['5'], 60],
      [['6'], 72],
      [['7'], 84],
      [['8'], 96],
      [['9'], 108],
    ])('when %s key is pressed', (keys, time) => {
      describe('when hasCurrentTrack value is false', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = false;
        });

        setEvents(keys);

        expectMockToBeOrNotToBeCalled();
        expectGetElementByIdMock();
      });

      describe('when hasCurrentTrack value is true', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = true;
        });

        setEvents(keys);

        expectMockToBeOrNotToBeCalled('setCurrentTime', time);
        expectGetElementByIdMock();
      });
    });

    describe('when a mapping that is not defined is pressed', () => {
      describe('when hasCurrentTrack value is false', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = false;
        });

        setEvents(['Shift', 'ArrowDown', 'P']);

        expectMockToBeOrNotToBeCalled();
        expectGetElementByIdMock();
      });

      describe('when hasCurrentTrack value is true', () => {
        beforeAll(() => {
          hasCurrentTrackMock.value = true;
        });

        setEvents(['Shift', 'E', 'P']);

        expectMockToBeOrNotToBeCalled();
        expectGetElementByIdMock();
      });
    });
  });

  describe('when composable unmounts', () => {
    beforeAll(() => {
      windowEvents.blur();
      documentEvents.visibilitychange();

      result.app.unmount();
    });

    it('removes the blur event listener function', () => {
      expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
        'blur',
        expect.any(Function),
      );
    });

    it('removes the keydown event listener function', () => {
      expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
        true,
      );
    });

    it('removes the keyup event listener function', () => {
      expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
        'keyup',
        expect.any(Function),
        true,
      );
    });

    it('removes the visibilitychange event listener function', () => {
      expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function),
      );
    });
  });
});

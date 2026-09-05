export function useKeyboardShortcuts() {
  const {
    cycleRepeat,
    fastForwardTrack,
    playNextTrack,
    playPreviousTrack,
    rewindTrack,
    seekTo,
    setPlaybackRateWithIncrement,
    setVolumeWithIncrement,
    toggleMute,
    togglePlay,
    toggleShuffle,
  } = useAudioPlayer();
  const { modal } = useModal();
  const {
    currentTrack,
    hasCurrentTrack,
    isPodcastEpisode,
    isRadioStation,
    isTrack,
    toggleQueuePlayer,
  } = useQueue();
  const { addPodcastModal } = usePodcast();
  const { addPlaylistModal } = usePlaylist();
  const { toggleFavourite } = useFavourite();
  const { addRadioStationModal } = useRadioStation();
  const { cycleLayout, toggleTheme } = useSettings();
  const { lockScroll, unlockScroll } = useScrollLock('keyboardShortcuts');

  const pressedKeys = ref(new Set<string>());
  const abortController = ref<AbortController | null>(null);

  const isShortcutListOpened = useState(
    STATE_KEYS.shortcutListOpened,
    () => false,
  );

  function clickElementById(id: string) {
    const previousActiveElement = document.activeElement;

    const buttonToClick = document.getElementById(id);

    buttonToClick?.focus();
    buttonToClick?.click();
    buttonToClick?.blur();

    (previousActiveElement as HTMLElement)?.focus();
  }

  function isKeysMatchingPressedKeys(mappedKeys: string[]) {
    const joinedMappedKeys = joinKeys(mappedKeys);
    const joinedPressedKeys = joinKeys(pressedKeys.value);

    return joinedMappedKeys === joinedPressedKeys;
  }

  function joinKeys(keys: Set<string> | string[]) {
    return [...keys]
      .map((k) => normaliseKey(k))
      .sort((a, b) => a.localeCompare(b))
      .join('+');
  }

  // Convert key to be the same as key in KEYBOARD_SHORTCUTS mapping.
  function normaliseKey(eventKey: string) {
    const key = eventKey.trim().toLowerCase();

    switch (key) {
      case '':
        return 'space';
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        return '0...9';
      case 'arrowdown':
        return '↓';
      case 'arrowleft':
        return '←';
      case 'arrowright':
        return '→';
      case 'arrowup':
        return '↑';
      case 'control':
        return 'ctrl';
      default:
        return key;
    }
  }

  function onKeydown(event: KeyboardEvent) {
    // Ignore all key events if focus is on an interactive element or a modal is visible.
    if (isInteractiveElement(event.target) || modal.value.component) {
      return;
    }

    pressedKeys.value.add(event.key);

    for (const category in KEYBOARD_SHORTCUTS) {
      const mappings = KEYBOARD_SHORTCUTS[category];

      for (const mapping of mappings) {
        if (isKeysMatchingPressedKeys(mapping.keys)) {
          event.preventDefault();
          mapping.action?.(event);
          break;
        }
      }
    }
  }

  function callOnlyWhenPodcastEpisode(fn: () => Promise<void> | void) {
    if (!isPodcastEpisode.value) {
      return;
    }

    callOnlyWithCurrentTrack(fn);
  }

  async function callOnlyWithCurrentTrack(fn: () => Promise<void> | void) {
    if (!hasCurrentTrack.value) {
      return;
    }

    await fn();
  }

  // Clear all keys when window loses focus.
  function onBlur() {
    pressedKeys.value.clear();
  }

  function onKeyup(event: KeyboardEvent) {
    pressedKeys.value.delete(event.key);
  }

  // Clear all keys when tab becomes hidden (e.g. print dialog opened).
  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      pressedKeys.value.clear();
    }
  }

  function seekByPercentKey(key: string) {
    if (isRadioStation.value) {
      return;
    }

    const time = (currentTrack.value.duration * (Number(key) * 10)) / 100;
    seekTo(time);
  }

  function toggleShortcutList() {
    isShortcutListOpened.value = !isShortcutListOpened.value;

    if (isShortcutListOpened.value) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }

  onMounted(() => {
    abortController.value = new AbortController();
    const { signal } = abortController.value;

    globalThis.addEventListener('blur', onBlur, {
      signal,
    });
    document.addEventListener('keydown', onKeydown, {
      capture: true,
      signal,
    });
    document.addEventListener('keyup', onKeyup, {
      capture: true,
      signal,
    });
    document.addEventListener('visibilitychange', onVisibilityChange, {
      signal,
    });
  });

  onUnmounted(() => {
    abortController.value?.abort();
  });

  const KEYBOARD_SHORTCUTS: KeyboardShortcutMapping = {
    Global: [
      {
        action: () => {
          document
            .getElementById(KEYBOARD_SHORTCUT_ELEMENT_IDS.searchInput)
            ?.focus();
        },
        description: 'Initiate search functionality.',
        helpText: "Press '/' key to initiate search functionality.",
        keys: ['/'],
      },
      {
        action: toggleShortcutList,
        description: 'Display all keyboard shortcuts.',
        helpText: "Press 'H' key to display all keyboard shortcuts.",
        keys: ['H'],
      },
      {
        action: addPlaylistModal,
        description: 'Add a new playlist.',
        helpText: "Press 'Alt' and 'P' keys together to add a new playlist.",
        keys: ['Alt', 'P'],
      },
      {
        action: addRadioStationModal,
        description: 'Add a new radio station.',
        helpText:
          "Press 'Alt' and 'R' keys together to add a new radio station.",
        keys: ['Alt', 'R'],
      },
      {
        action: addPodcastModal,
        description: 'Add a new podcast.',
        helpText: "Press 'Alt' and 'E' keys together to add a new podcast.",
        keys: ['Alt', 'E'],
      },
      {
        action: cycleLayout,
        description: 'Change the layout of the album/artist view.',
        helpText:
          "Press 'Shift' and 'L' keys together to change the layout of the album/artist view.",
        keys: ['Shift', 'L'],
      },
      {
        action: toggleTheme,
        description: 'Toggle dark/light mode.',
        helpText:
          "Press 'Shift' and 'T' keys together to toggle dark/light mode.",
        keys: ['Shift', 'T'],
      },
      {
        action: () => {
          clickElementById(KEYBOARD_SHORTCUT_ELEMENT_IDS.refreshDataButton);
        },
        description: 'Refresh the data.',
        helpText: "Press 'Shift' and 'R' keys together to refresh the data.",
        keys: ['Shift', 'R'],
      },
      {
        action: () => {
          clickElementById(KEYBOARD_SHORTCUT_ELEMENT_IDS.playAllButton);
        },
        description: 'Play all tracks displayed on the current page.',
        helpText:
          "Press 'Shift' and 'Enter' keys together to play all tracks on the current page.",
        keys: ['Shift', 'Enter'],
      },
      {
        action: () => {
          clickElementById(KEYBOARD_SHORTCUT_ELEMENT_IDS.shuffleAllButton);
        },
        description: 'Shuffle all tracks on the current page and play.',
        helpText:
          "Press 'Shift' and 'S' keys together to shuffle all tracks on the current page and play.",
        keys: ['Shift', 'S'],
      },
    ],
    Music: [
      {
        action: () => {
          callOnlyWithCurrentTrack(() => {
            toggleQueuePlayer();
          });
        },
        description: 'Open the music player interface.',
        helpText:
          "Press 'Shift' and 'P' keys together to open the music player interface.",
        keys: ['Shift', 'P'],
      },
      {
        action: (event: KeyboardEvent) => {
          callOnlyWithCurrentTrack(() => {
            seekByPercentKey(event.key);
          });
        },
        description: 'Seek to a specific position within the track.',
        helpText:
          'Press any number key from 0 to 9 to seek to a specific position within the track.',
        keys: ['0...9'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(async () => {
            await togglePlay();
          });
        },
        description: 'Toggle play or pause for the current track.',
        helpText:
          "Press 'Space' key to toggle play or pause for the current track.",
        keys: ['Space'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(() => {
            toggleShuffle();
          });
        },
        description: 'Enable or disable shuffle playback mode.',
        helpText: "Press 'S' key to enable or disable shuffle playback mode.",
        keys: ['S'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(() => {
            cycleRepeat();
          });
        },
        description: 'Enable or disable repeat playback mode.',
        helpText: "Press 'R' key to enable or disable repeat playback mode.",
        keys: ['R'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(() => {
            fastForwardTrack();
          });
        },
        description: 'Seek forward.',
        helpText:
          "Press 'Shift' and Right Arrow keys together to seek forward.",
        keys: ['Shift', '→'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(() => {
            rewindTrack();
          });
        },
        description: 'Seek back.',
        helpText: "Press 'Shift' and Left Arrow keys together to seek back.",
        keys: ['Shift', '←'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(async () => {
            await playPreviousTrack();
          });
        },
        description: 'Play the previous track.',
        helpText:
          "Press 'Ctrl' and Left Arrow keys together to play the previous track.",
        keys: ['Ctrl', '←'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(async () => {
            await playNextTrack();
          });
        },
        description: 'Play the next track.',
        helpText:
          "Press 'Ctrl' and Right Arrow keys together to play the next track.",
        keys: ['Ctrl', '→'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(() => {
            toggleMute();
          });
        },
        description: 'Mute or unmute the volume.',
        helpText: "Press 'M' key to mute or unmute the volume.",
        keys: ['M'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(() => {
            setVolumeWithIncrement(0.01);
          });
        },
        description: 'Increase the volume level.',
        helpText:
          "Press 'Shift' and Up Arrow keys together to increase the volume level.",
        keys: ['Shift', '↑'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(() => {
            setVolumeWithIncrement(-0.01);
          });
        },
        description: 'Decrease the volume level.',
        helpText:
          "Press 'Shift' and Down Arrow keys together to decrease the volume level.",
        keys: ['Shift', '↓'],
      },
      {
        action: () => {
          callOnlyWithCurrentTrack(() => {
            if (isTrack.value) {
              toggleFavourite(
                currentTrack.value,
                (currentTrack.value as Track).favourite,
              );
            }
          });
        },
        description: 'Add the current track to your favourites.',
        helpText: "Press 'L' key to add the current track to your favourites.",
        keys: ['L'],
      },
    ],
    Podcasts: [
      {
        action: () => {
          callOnlyWhenPodcastEpisode(() => {
            setPlaybackRateWithIncrement(+1);
          });
        },
        description: 'Increase the podcast playback speed.',
        helpText:
          "Press 'Alt' and Up Arrow keys together to increase podcast playback speed.",
        keys: ['Alt', '↑'],
      },
      {
        action: () => {
          callOnlyWhenPodcastEpisode(() => {
            setPlaybackRateWithIncrement(-1);
          });
        },
        description: 'Decrease the podcast playback speed.',
        helpText:
          "Press 'Alt' and Down Arrow keys together to decrease podcast playback speed.",
        keys: ['Alt', '↓'],
      },
    ],
  };

  return {
    isShortcutListOpened,
    KEYBOARD_SHORTCUTS,
  };
}

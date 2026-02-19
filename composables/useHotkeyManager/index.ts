export function useHotkeyManager() {
  const {
    currentTrack,
    fastForwardTrack,
    hasCurrentTrack,
    isPodcastEpisode,
    isTrack,
    playNextTrack,
    playPreviousTrack,
    rewindTrack,
    setCurrentTime,
    setPlaybackRateWithIncrement,
    setRepeat,
    setVolumeWithIncrement,
    toggleMute,
    togglePlay,
    toggleShuffle,
  } = useAudioPlayer();
  const { modal } = useModal();
  const { toggleQueuePlayer } = useQueue();
  const { addPodcastModal } = usePodcast();
  const { addPlaylistModal } = usePlaylist();
  const { toggleFavourite } = useFavourite();
  const { addRadioStationModal } = useRadioStation();

  const pressedKeys = ref(new Set<string>());
  const abortController = ref<AbortController | null>(null);

  const isHotkeyListOpened = useState(
    STATE_NAMES.hotKeyListOpened,
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

  // Convert key to be the same as key in HOTKEYS_MAPPINGS.
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

  async function onKeydown(event: KeyboardEvent) {
    const searchInput = document.getElementById(HOTKEY_ELEMENT_IDS.searchInput);

    // Ignore all key events if focus is on search input or if a modal is visible.
    if (searchInput?.contains(event.target as Node) || modal.value.component) {
      return;
    }

    pressedKeys.value.add(event.key);

    for (const category in HOTKEYS_MAPPINGS) {
      const mappings = HOTKEYS_MAPPINGS[category];

      for (const mapping of mappings) {
        if (isKeysMatchingPressedKeys(mapping.keys)) {
          event.preventDefault();
          mapping.action?.(event);
          break;
        }
      }
    }
  }

  async function callOnlyWhenPodcastEpisode(fn: () => Promise<void> | void) {
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

  function setCurrentTimeForKey(key: string) {
    const time = (currentTrack.value.duration * (Number(key) * 10)) / 100;
    setCurrentTime(time);
  }

  function toggleHotkeyList() {
    isHotkeyListOpened.value = !isHotkeyListOpened.value;
  }

  onMounted(() => {
    abortController.value = new AbortController();
    const { signal } = abortController.value;

    globalThis.addEventListener('blur', onBlur, { signal });
    document.addEventListener('keydown', onKeydown, { capture: true, signal });
    document.addEventListener('keyup', onKeyup, { capture: true, signal });
    document.addEventListener('visibilitychange', onVisibilityChange, {
      signal,
    });
  });

  onUnmounted(() => {
    abortController.value?.abort();
  });

  const HOTKEYS_MAPPINGS: HotkeysMapping = {
    Global: [
      {
        action: () => {
          document.getElementById(HOTKEY_ELEMENT_IDS.searchInput)?.focus();
        },
        description: 'Initiate search functionality.',
        helpText: "Press '/' key to initiate search functionality.",
        keys: ['/'],
      },
      {
        action: toggleHotkeyList,
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
        action: () => {
          clickElementById(HOTKEY_ELEMENT_IDS.viewLayoutButton);
        },
        description: 'Change the layout of the album/artist view.',
        helpText:
          "Press 'Shift' and 'L' keys together to change the layout of the album/artist view.",
        keys: ['Shift', 'L'],
      },
      {
        action: () => {
          clickElementById(HOTKEY_ELEMENT_IDS.refreshDataButton);
        },
        description: 'Refresh the data.',
        helpText: "Press 'Shift' and 'R' keys together to refresh the data.",
        keys: ['Shift', 'R'],
      },
      {
        action: () => {
          clickElementById(HOTKEY_ELEMENT_IDS.playAllButton);
        },
        description: 'Play all tracks displayed on the current page.',
        helpText:
          "Press 'Shift' and 'Enter' keys together to play all tracks on the current page.",
        keys: ['Shift', 'Enter'],
      },
      {
        action: () => {
          clickElementById(HOTKEY_ELEMENT_IDS.shuffleAllButton);
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
            setCurrentTimeForKey(event.key);
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
            setRepeat();
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
          callOnlyWithCurrentTrack(async () => {
            if (isTrack.value) {
              await toggleFavourite(
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
    HOTKEYS_MAPPINGS,
    isHotkeyListOpened,
  };
}

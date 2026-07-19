import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import AboutApp from '@/components/Molecules/AboutApp.vue';
import SelectableBadge from '@/components/Molecules/Settings/SelectableBadge.vue';
import SelectableOption from '@/components/Molecules/Settings/SelectableOption.vue';
import { appInformationMock, serverInformationMock } from '@/test/fixtures';

import SettingsPage from './settings.vue';

const fetchInformationMock = vi.fn();
const aboutInformationMock = ref<AboutInformation | null>(null);

mockNuxtImport('useServerInfo', () => () => ({
  aboutInformation: aboutInformationMock,
  fetchInformation: fetchInformationMock,
}));

const crossfadeEnabledMock = ref(false);
const crossfadeDurationMock = ref(3);
const deletePodcastOnEndMock = ref(false);
const resetSettingsMock = vi.fn();
const scrobbleEnabledMock = ref(true);
const setCrossfadeDurationMock = vi.fn();
const setStreamBitrateMock = vi.fn();
const setThemeModeMock = vi.fn();
const setViewLayoutMock = vi.fn();
const showPodcastsMock = ref(true);
const showRadioStationsMock = ref(true);
const streamBitrateMock = ref(BITRATE_OPTIONS[3].value);
const themePreferenceMock = ref(THEME_OPTIONS[2].value);
const toggleCrossfadeMock = vi.fn();
const toggleDeletePodcastOnEndMock = vi.fn();
const toggleScrobbleMock = vi.fn();
const toggleShowPodcastsMock = vi.fn();
const toggleShowRadioStationsMock = vi.fn();
const viewLayoutMock = ref<Layout>(LAYOUT_OPTIONS[0].value);

mockNuxtImport('useSettings', () => () => ({
  crossfadeDuration: crossfadeDurationMock,
  crossfadeEnabled: crossfadeEnabledMock,
  deletePodcastOnEnd: deletePodcastOnEndMock,
  replayGainMode: replayGainModeMock,
  resetSettings: resetSettingsMock,
  scrobbleEnabled: scrobbleEnabledMock,
  setCrossfadeDuration: setCrossfadeDurationMock,
  setStreamBitrate: setStreamBitrateMock,
  setThemeMode: setThemeModeMock,
  setViewLayout: setViewLayoutMock,
  showPodcasts: showPodcastsMock,
  showRadioStations: showRadioStationsMock,
  streamBitrate: streamBitrateMock,
  themePreference: themePreferenceMock,
  toggleCrossfade: toggleCrossfadeMock,
  toggleDeletePodcastOnEnd: toggleDeletePodcastOnEndMock,
  toggleScrobble: toggleScrobbleMock,
  toggleShowPodcasts: toggleShowPodcastsMock,
  toggleShowRadioStations: toggleShowRadioStationsMock,
  viewLayout: viewLayoutMock,
}));

const replayGainModeMock = ref<ReplayGainMode>('off');
const setReplayGainModeMock = vi.fn();

mockNuxtImport('useAudioPlayer', () => () => ({
  setReplayGainMode: setReplayGainModeMock,
}));

const cacheEstimateMock = ref('');
const clearAllAppStorageMock = vi.fn();
const clearPwaCachesMock = vi.fn();
const fetchCacheEstimateMock = vi.fn();

mockNuxtImport('useMaintenance', () => () => ({
  cacheEstimate: cacheEstimateMock,
  clearAllAppStorage: clearAllAppStorageMock,
  clearPwaCaches: clearPwaCachesMock,
  fetchCacheEstimate: fetchCacheEstimateMock,
}));

const closeModalMock = vi.fn();
const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  closeModal: closeModalMock,
  openModal: openModalMock,
}));

function factory(props = {}) {
  return mount(SettingsPage, {
    props: {
      ...props,
    },
  });
}

describe('settings', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('calls the fetchInformation function', () => {
    expect(fetchInformationMock).toHaveBeenCalled();
  });

  it('calls the fetchCacheEstimate function', () => {
    expect(fetchCacheEstimateMock).toHaveBeenCalled();
  });

  describe('inside the theme group', () => {
    it('shows the correct number of SelectableBadge component', () => {
      expect(
        wrapper
          .findComponent({ ref: 'themeGroup' })
          .findAllComponents(SelectableBadge),
      ).toHaveLength(THEME_OPTIONS.length);
    });

    it('sets the correct selected prop on each SelectableBadge component', () => {
      const badges = wrapper
        .findComponent({ ref: 'themeGroup' })
        .findAllComponents(SelectableBadge);

      expect(badges[0].props('selected')).toBe(false);
      expect(badges[1].props('selected')).toBe(false);
      expect(badges[2].props('selected')).toBe(true);
    });

    describe('when the SelectableBadge component emits the click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ ref: 'themeGroup' })
          .findAllComponents(SelectableBadge)[0]
          .vm.$emit('click');
      });

      it('calls the setThemeMode function', () => {
        expect(setThemeModeMock).toHaveBeenCalledWith(THEME_OPTIONS[0].value);
      });
    });
  });

  describe('inside the layout group', () => {
    it('shows the correct number of SelectableOption component', () => {
      expect(
        wrapper
          .findComponent({ ref: 'layoutGroup' })
          .findAllComponents(SelectableOption),
      ).toHaveLength(LAYOUT_OPTIONS.length);
    });

    it('sets the correct selected prop on each SelectableOption component', () => {
      const options = wrapper
        .findComponent({ ref: 'layoutGroup' })
        .findAllComponents(SelectableOption);

      expect(options[0].props('selected')).toBe(true);
      expect(options[1].props('selected')).toBe(false);
    });

    describe('when the SelectableOption component emits the click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ ref: 'layoutGroup' })
          .findAllComponents(SelectableOption)[1]
          .vm.$emit('click');
      });

      it('calls the setViewLayout function', () => {
        expect(setViewLayoutMock).toHaveBeenCalledWith(LAYOUT_OPTIONS[1].value);
      });
    });
  });

  describe('inside the streaming group', () => {
    it('shows the correct number of SelectableOption component', () => {
      expect(
        wrapper
          .findComponent({ ref: 'streamingGroup' })
          .findAllComponents(SelectableOption),
      ).toHaveLength(BITRATE_OPTIONS.length);
    });

    it('sets the correct selected prop on each SelectableOption component', () => {
      const options = wrapper
        .findComponent({ ref: 'streamingGroup' })
        .findAllComponents(SelectableOption);

      expect(options[0].props('selected')).toBe(false);
      expect(options[1].props('selected')).toBe(false);
      expect(options[2].props('selected')).toBe(false);
      expect(options[3].props('selected')).toBe(true);
      expect(options[4].props('selected')).toBe(false);
    });

    describe('when the SelectableOption component emits the click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ ref: 'streamingGroup' })
          .findAllComponents(SelectableOption)[2]
          .vm.$emit('click');
      });

      it('calls the setStreamBitrate function', () => {
        expect(setStreamBitrateMock).toHaveBeenCalledWith(
          BITRATE_OPTIONS[2].value,
        );
      });
    });
  });

  describe('inside the replayGain group', () => {
    it('shows the correct number of SelectableBadge components', () => {
      expect(
        wrapper
          .findComponent({ ref: 'replayGainGroup' })
          .findAllComponents(SelectableBadge),
      ).toHaveLength(REPLAY_GAIN_OPTIONS.length);
    });

    it('sets the correct selected prop on each SelectableBadge component', () => {
      const badges = wrapper
        .findComponent({ ref: 'replayGainGroup' })
        .findAllComponents(SelectableBadge);

      expect(badges[0].props('selected')).toBe(true);
      expect(badges[1].props('selected')).toBe(false);
      expect(badges[2].props('selected')).toBe(false);
    });

    describe('when the SelectableBadge component emits the click event', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ ref: 'replayGainGroup' })
          .findAllComponents(SelectableBadge)[1]
          .vm.$emit('click');
      });

      it('calls the setReplayGainMode function', () => {
        expect(setReplayGainModeMock).toHaveBeenCalledWith(
          REPLAY_GAIN_OPTIONS[1].value,
        );
      });
    });
  });

  describe('inside the crossfade group', () => {
    describe('when the crossfadeEnabled value is set to false', () => {
      beforeEach(() => {
        crossfadeEnabledMock.value = false;
      });

      it('adds the disabled class to the crossfade wrapper element', () => {
        expect(wrapper.find({ ref: 'crossfadeWrapper' }).classes()).toContain(
          'disabled',
        );
      });
    });

    describe('when the crossfadeEnabled value is set to true', () => {
      beforeEach(() => {
        crossfadeEnabledMock.value = true;
      });

      it('does not add the disabled class to the crossfade wrapper element', () => {
        expect(
          wrapper.find({ ref: 'crossfadeWrapper' }).classes(),
        ).not.toContain('disabled');
      });

      describe('when the crossfade InputRange component emits the change event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'crossfadeInputRange' })
            .vm.$emit('change', 7);
        });

        it('calls the setCrossfadeDuration function with the correct parameters', () => {
          expect(setCrossfadeDurationMock).toHaveBeenCalledWith(7);
        });
      });
    });

    describe('when the crossfade ToggleSwitch component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'crossfadeToggle' }).vm.$emit('click');
      });

      it('calls the toggleCrossfade function', () => {
        expect(toggleCrossfadeMock).toHaveBeenCalled();
      });
    });
  });

  describe('when the show podcasts ToggleSwitch component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'showPodcastsToggle' }).vm.$emit('click');
    });

    it('calls the toggleShowPodcasts function', () => {
      expect(toggleShowPodcastsMock).toHaveBeenCalled();
    });
  });

  describe('when the show radio stations ToggleSwitch component emits the click event', () => {
    beforeEach(() => {
      wrapper
        .findComponent({ ref: 'showRadioStationsToggle' })
        .vm.$emit('click');
    });

    it('calls the toggleShowRadioStations function', () => {
      expect(toggleShowRadioStationsMock).toHaveBeenCalled();
    });
  });

  describe('when the scrobble ToggleSwitch component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'scrobbleToggle' }).vm.$emit('click');
    });

    it('calls the toggleScrobble function', () => {
      expect(toggleScrobbleMock).toHaveBeenCalled();
    });
  });

  describe('when the delete podcast on end ToggleSwitch component emits the click event', () => {
    beforeEach(() => {
      wrapper
        .findComponent({ ref: 'deletePodcastOnEndToggle' })
        .vm.$emit('click');
    });

    it('calls the toggleDeletePodcastOnEnd function', () => {
      expect(toggleDeletePodcastOnEndMock).toHaveBeenCalled();
    });
  });

  describe('when the aboutInformation value is null', () => {
    beforeEach(() => {
      aboutInformationMock.value = null;
    });

    it('does not show the AboutApp component', () => {
      expect(wrapper.findComponent(AboutApp).exists()).toBe(false);
    });
  });

  describe('when the aboutInformation value is set', () => {
    beforeEach(() => {
      aboutInformationMock.value = {
        appInformation: appInformationMock,
        serverInformation: serverInformationMock,
      };
    });

    it('shows the AboutApp component', () => {
      expect(wrapper.findComponent(AboutApp).exists()).toBe(true);
    });
  });

  describe('when the cacheEstimate value is set', () => {
    beforeEach(() => {
      cacheEstimateMock.value = '5.0 MB used of 1024.0 MB available';
    });

    it('displays the cache size text', () => {
      expect(wrapper.text()).toContain('5.0 MB used of 1024.0 MB available');
    });
  });

  describe('when the clear cache ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper
        .findComponent({ ref: 'clearCacheButtonLink' })
        .trigger('click');
    });

    it('calls the openModal function with the correct parameters', () => {
      expect(openModalMock).toHaveBeenCalledWith(MODAL_TYPE.confirmDialog, {
        confirmText: 'Clear',
        message:
          'Permanently clear all locally cached data? This includes cached audio, images, and player/queue state.',
        onCancel: expect.any(Function),
        onConfirm: expect.any(Function),
      });
    });
  });

  describe('when the reset settings ButtonLink component is clicked', () => {
    beforeEach(async () => {
      await wrapper
        .findComponent({ ref: 'resetSettingsButtonLink' })
        .trigger('click');
    });

    it('calls the openModal function with the correct parameters', () => {
      expect(openModalMock).toHaveBeenCalledWith(MODAL_TYPE.confirmDialog, {
        confirmText: 'Reset',
        message:
          'Reset all settings to their default values? This cannot be undone.',
        onCancel: expect.any(Function),
        onConfirm: expect.any(Function),
      });
    });
  });
});

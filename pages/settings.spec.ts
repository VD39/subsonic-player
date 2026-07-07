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

const deletePodcastOnEndMock = ref(false);
const scrobbleEnabledMock = ref(true);
const setStreamBitrateMock = vi.fn();
const setThemeModeMock = vi.fn();
const setViewLayoutMock = vi.fn();
const showPodcastsMock = ref(true);
const showRadioStationsMock = ref(true);
const streamBitrateMock = ref(BITRATE_OPTIONS[3].value);
const themePreferenceMock = ref(THEME_OPTIONS[2].value);
const toggleDeletePodcastOnEndMock = vi.fn();
const toggleScrobbleMock = vi.fn();
const toggleShowPodcastsMock = vi.fn();
const toggleShowRadioStationsMock = vi.fn();
const viewLayoutMock = ref<Layout>(LAYOUT_OPTIONS[0].value);

mockNuxtImport('useSettings', () => () => ({
  deletePodcastOnEnd: deletePodcastOnEndMock,
  scrobbleEnabled: scrobbleEnabledMock,
  setStreamBitrate: setStreamBitrateMock,
  setThemeMode: setThemeModeMock,
  setViewLayout: setViewLayoutMock,
  showPodcasts: showPodcastsMock,
  showRadioStations: showRadioStationsMock,
  streamBitrate: streamBitrateMock,
  themePreference: themePreferenceMock,
  toggleDeletePodcastOnEnd: toggleDeletePodcastOnEndMock,
  toggleScrobble: toggleScrobbleMock,
  toggleShowPodcasts: toggleShowPodcastsMock,
  toggleShowRadioStations: toggleShowRadioStationsMock,
  viewLayout: viewLayoutMock,
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
});

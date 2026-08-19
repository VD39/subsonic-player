import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import TracklistRadio from '@/components/tracklist/TracklistRadio.vue';
import RefreshButton from '@/components/ui/RefreshButton.vue';
import { getFormattedRadioStationMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import RadioStationsPage from './radio-stations.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const {
  addRadioStationModalMock,
  deleteRadioStationMock,
  getRadioStationsMock,
  updateRadioStationModalMock,
} = vi.hoisted(() => ({
  addRadioStationModalMock: vi.fn(),
  deleteRadioStationMock: vi.fn(),
  getRadioStationsMock: vi.fn(),
  updateRadioStationModalMock: vi.fn(),
}));

mockNuxtImport('useRadioStation', (original) => () => ({
  ...original(),
  addRadioStationModal: addRadioStationModalMock,
  deleteRadioStation: deleteRadioStationMock,
  getRadioStations: getRadioStationsMock,
  radioStations: ref([]),
  updateRadioStationModal: updateRadioStationModalMock,
}));

const refreshMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useAsyncData', () => () => ({
  error: ref(null),
  pending: ref(false),
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();

const radioStation = getFormattedRadioStationMock()[0];

function factory(props = {}) {
  return mount(RadioStationsPage, {
    props: {
      ...props,
    },
  });
}

describe('radio-stations', () => {
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

  it('sets the useHead function with correct title', () => {
    expect(useHeadTitleMock.value).toBe('Radio Stations');
  });

  describe('when the RefreshButton component emits the refresh event', () => {
    beforeEach(() => {
      wrapper.findComponent(RefreshButton).vm.$emit('refresh');
    });

    it('calls the refresh function', () => {
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  describe('when the ButtonLink is clicked', () => {
    beforeEach(async () => {
      await wrapper
        .findComponent({ ref: 'addRadioStationButton' })
        .trigger('click');
    });

    it('calls the addRadioStationModal function', () => {
      expect(addRadioStationModalMock).toHaveBeenCalled();
    });
  });

  describe('when the TracklistRadio component emits the addToQueue event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(TracklistRadio)
        .vm.$emit('addToQueue', radioStation);
    });

    it('calls the addTrackToQueue function with the correct parameters', () => {
      expect(addTrackToQueueMock).toHaveBeenCalledWith(radioStation);
    });
  });

  describe('when the TracklistRadio component emits the deleteRadioStation event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(TracklistRadio)
        .vm.$emit('deleteRadioStation', radioStation.id);
    });

    it('calls the deleteRadioStation function with the correct parameters', () => {
      expect(deleteRadioStationMock).toHaveBeenCalledWith(radioStation.id);
    });
  });

  describe('when the TracklistRadio component emits the editRadioStation event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(TracklistRadio)
        .vm.$emit('editRadioStation', radioStation);
    });

    it('calls the updateRadioStationModal function with the correct parameters', () => {
      expect(updateRadioStationModalMock).toHaveBeenCalledWith(radioStation);
    });
  });

  describe('when the TracklistRadio component emits the playRadioStation event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(TracklistRadio)
        .vm.$emit('playRadioStation', radioStation);
    });

    it('calls the playTracks function with the correct parameters', () => {
      expect(playTracksMock).toHaveBeenCalledWith([radioStation]);
    });
  });
});

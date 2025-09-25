import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import RadioStationsList from '@/components/Organisms/TrackLists/RadioStationsList.vue';
import { formattedRadioStationMock } from '@/test/fixtures';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import RadioStationsPage from './radio-stations.vue';

const addRadioStationModalMock = vi.fn();
const deleteRadioStationMock = vi.fn();
const getRadioStationsMock = vi.fn();
const updateRadioStationModalMock = vi.fn();

mockNuxtImport('useRadioStation', () => () => ({
  addRadioStationModal: addRadioStationModalMock,
  deleteRadioStation: deleteRadioStationMock,
  getRadioStations: getRadioStationsMock,
  radioStations: ref([]),
  updateRadioStationModal: updateRadioStationModalMock,
}));

const refreshMock = vi.fn();

mockNuxtImport('useAsyncData', () => () => ({
  refresh: refreshMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();
const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();

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
    beforeEach(() => {
      wrapper.findComponent({ ref: 'addRadioStationButton' }).vm.$emit('click');
    });

    it('calls the addRadioStationModal function', () => {
      expect(addRadioStationModalMock).toHaveBeenCalled();
    });
  });

  describe('when the RadioStationsList component emits the addToQueue event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(RadioStationsList)
        .vm.$emit('addToQueue', formattedRadioStationMock);
    });

    it('calls the addTrackToQueue function with the correct parameters', () => {
      expect(addTrackToQueueMock).toHaveBeenCalledWith(
        formattedRadioStationMock,
      );
    });
  });

  describe('when the RadioStationsList component emits the deleteRadioStation event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(RadioStationsList)
        .vm.$emit('deleteRadioStation', formattedRadioStationMock.id);
    });

    it('calls the deleteRadioStation function with the correct parameters', () => {
      expect(deleteRadioStationMock).toHaveBeenCalledWith(
        formattedRadioStationMock.id,
      );
    });
  });

  describe('when the RadioStationsList component emits the editRadioStation event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(RadioStationsList)
        .vm.$emit('editRadioStation', formattedRadioStationMock);
    });

    it('calls the updateRadioStationModal function with the correct parameters', () => {
      expect(updateRadioStationModalMock).toHaveBeenCalledWith(
        formattedRadioStationMock,
      );
    });
  });

  describe('when the RadioStationsList component emits the playRadioStation event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(RadioStationsList)
        .vm.$emit('playRadioStation', formattedRadioStationMock);
    });

    it('calls the playTracks function with the correct parameters', () => {
      expect(playTracksMock).toHaveBeenCalledWith([formattedRadioStationMock]);
    });
  });
});

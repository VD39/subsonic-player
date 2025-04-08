<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import RadioStationList from '@/components/Organisms/RadioStationList.vue';

const {
  addRadioStationModal,
  deleteRadioStation,
  getRadioStations,
  radioStations,
  updateRadioStationModal,
} = useRadioStation();
const { addTrackToQueue, playTracks } = useAudioPlayer();

const { refresh, status } = useAsyncData(
  ASYNC_DATA_NAMES.radioStations,
  async () => {
    await getRadioStations();

    return {
      radioStations: radioStations.value,
    };
  },
  {
    default: () => ({
      radioStations: [],
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function playRadioStation(station: RadioStation) {
  playTracks([station]);
}

useHead({
  title: 'Radio Stations',
});
</script>

<template>
  <HeaderWithAction>
    <h1>Radio Stations</h1>

    <template #actions>
      <RefreshButton :status="status" @refresh="refresh" />

      <ButtonLink
        :icon="ICONS.add"
        icon-size="large"
        title="Add radio station"
        @click="addRadioStationModal"
      >
        Add radio station
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <LoadingData :status="status">
    <RadioStationList
      :radio-stations="radioStations"
      @add-to-queue="addTrackToQueue"
      @delete-radio-station="deleteRadioStation"
      @edit-radio-station="updateRadioStationModal"
      @play-radio-station="playRadioStation"
    />
  </LoadingData>
</template>

<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import RadioStationsList from '@/components/Organisms/TrackLists/RadioStationsList.vue';

const {
  addRadioStationModal,
  deleteRadioStation,
  getRadioStations,
  radioStations,
  updateRadioStationModal,
} = useRadioStation();
const { addTrackToQueue, playTracks } = useAudioPlayer();

/* istanbul ignore next -- @preserve */
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
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'refresh:manual') {
        return undefined;
      }

      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

function onPlayRadioStation(station: RadioStation) {
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
      <RefreshButton :status @refresh="refresh" />

      <ButtonLink
        ref="addRadioStationButton"
        :icon="ICONS.add"
        iconSize="large"
        title="Add radio station"
        @click="addRadioStationModal"
      >
        Add radio station
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <LoadingData :status>
    <RadioStationsList
      :radioStations
      @addToQueue="addTrackToQueue"
      @deleteRadioStation="deleteRadioStation"
      @editRadioStation="updateRadioStationModal"
      @playRadioStation="onPlayRadioStation"
    />
  </LoadingData>
</template>

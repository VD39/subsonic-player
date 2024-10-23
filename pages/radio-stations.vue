<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RadioStationList from '@/components/Organisms/RadioStationList.vue';

const {
  addRadioStationModal,
  deleteRadioStation,
  getRadioStations,
  radioStations,
  updateRadioStationModal,
} = useRadioStation();
const { addTrackToQueue, playTracks } = useAudioPlayer();

function playRadioStation(station: RadioStation) {
  playTracks([station]);
}

onBeforeMount(async () => {
  if (!radioStations.value.length) {
    getRadioStations();
  }
});
</script>

<template>
  <LoadingData>
    <HeaderWithAction>
      <h1>Radio Stations</h1>

      <ButtonLink
        :icon-size="35"
        :icon="ICONS.add"
        title="Add radio station"
        @click="addRadioStationModal"
      >
        Add radio station
      </ButtonLink>
    </HeaderWithAction>

    <RadioStationList
      :radio-stations="radioStations"
      @add-to-queue="addTrackToQueue"
      @delete-radio-station="deleteRadioStation"
      @edit-radio-station="updateRadioStationModal"
      @play-radio-station="playRadioStation"
    />
  </LoadingData>
</template>

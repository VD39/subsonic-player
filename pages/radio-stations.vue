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

function playRadioStation(station: RadioStation) {
  playTracks([station]);
}

if (!radioStations.value.length) {
  getRadioStations();
}

useHead({
  title: 'Radio Stations',
});
</script>

<template>
  <HeaderWithAction>
    <h1>Radio Stations</h1>

    <div class="centerItems">
      <RefreshButton @refresh="getRadioStations" />

      <ButtonLink
        icon-size="large"
        :icon="ICONS.add"
        title="Add radio station"
        @click="addRadioStationModal"
      >
        Add radio station
      </ButtonLink>
    </div>
  </HeaderWithAction>

  <LoadingData>
    <RadioStationList
      :radio-stations="radioStations"
      @add-to-queue="addTrackToQueue"
      @delete-radio-station="deleteRadioStation"
      @edit-radio-station="updateRadioStationModal"
      @play-radio-station="playRadioStation"
    />
  </LoadingData>
</template>

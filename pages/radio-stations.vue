<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';
import RadioStationList from '@/components/MediaLists/RadioStationList.vue';

const {
  addRadioStation,
  deleteRadioStation,
  getRadioStations,
  radioStations,
  updateRadioStation,
} = useRadioStation();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { closeModal, openModal } = useModal();

function addRadioStationModal() {
  openModal('addUpdateRadioStationModal', {
    /* istanbul ignore next -- @preserve */
    async onSubmit(radioStation: RadioStation) {
      await addRadioStation(radioStation);
      closeModal();
    },
  });
}

function updateRadioStationModal(radioStation: RadioStation) {
  openModal('addUpdateRadioStationModal', {
    radioStation,
    /* istanbul ignore next -- @preserve */
    async onSubmit(newRadioStation: RadioStation) {
      await updateRadioStation({
        ...newRadioStation,
        id: radioStation.id,
      });

      closeModal();
    },
  });
}

function playRadioStation(station: RadioStation) {
  playTracks([station]);
}

if (!radioStations.value?.length) {
  getRadioStations();
}
</script>

<template>
  <div :class="$style.header">
    <h1>Radio Stations</h1>

    <IconButton
      :icon-size="35"
      icon="PhPlusCircle"
      title="Add radio station"
      @click="addRadioStationModal"
    >
      Add radio station
    </IconButton>
  </div>

  <RadioStationList
    :radio-stations="radioStations"
    @add-to-queue="addTrackToQueue"
    @delete-station="deleteRadioStation"
    @edit-station="updateRadioStationModal"
    @play-station="playRadioStation"
  />
</template>

<style module>
.header {
  @mixin align-center;

  justify-content: space-between;
  width: 100%;
}
</style>

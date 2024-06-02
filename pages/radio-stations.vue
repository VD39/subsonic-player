<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { closeModal, openModal } = useModal();
const { addRadioStation, getRadioStations, radioStations } = useRadioStation();

function addRadioStationModal() {
  openModal('addRadioStationModal', {
    /* istanbul ignore next -- @preserve */
    async onSubmit(radioStation: RadioStation) {
      await addRadioStation(radioStation);
      closeModal();
    },
  });
}

if (!radioStations.value?.length) {
  getRadioStations();
}
</script>

<template>
  <div :class="$style.header">
    <h1>Internet Radio Stations</h1>

    <IconButton
      icon="plus"
      title="Add radio station"
      @click="addRadioStationModal"
    >
      Add radio station
    </IconButton>
  </div>

  <pre>{{ radioStations }}</pre>
</template>

<style module>
.header {
  @mixin align-center;

  justify-content: space-between;
}
</style>

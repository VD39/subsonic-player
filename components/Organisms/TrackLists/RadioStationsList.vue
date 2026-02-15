<script setup lang="ts">
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import RadioStationsListItem from '@/components/Organisms/TrackLists/RadioStationsListItem.vue';

defineProps<{
  radioStations: RadioStation[];
}>();

defineEmits<{
  addToQueue: [radioStation: RadioStation];
  deleteRadioStation: [radioStationId: string];
  editRadioStation: [radioStation: RadioStation];
  playRadioStation: [radioStation: RadioStation];
}>();

const trackHeaderNames = TRACK_HEADER_NAMES.radioStations;
</script>

<template>
  <div v-if="radioStations.length" ref="radioStationWrapper" class="trackTable">
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeaderNames[0] }}</div>
      <div class="trackCell trackOptions" />
    </div>

    <RadioStationsListItem
      v-for="(radioStation, index) in radioStations"
      :key="radioStation.id"
      :index
      :radioStation
      @addToQueue="$emit('addToQueue', radioStation)"
      @deleteRadioStation="$emit('deleteRadioStation', radioStation.id)"
      @editRadioStation="$emit('editRadioStation', radioStation)"
      @playRadioStation="$emit('playRadioStation', radioStation)"
    />
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.radioStation"
    message="No radio stations found."
  />
</template>

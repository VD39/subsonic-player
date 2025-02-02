<script setup lang="ts">
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

defineProps<{
  radioStations: RadioStation[];
}>();

defineEmits([
  'addToQueue',
  'deleteRadioStation',
  'editRadioStation',
  'playRadioStation',
]);
</script>

<template>
  <div v-if="radioStations.length" ref="radioStationWrapper" class="trackTable">
    <div class="trackHeader">
      <div class="trackCell">Stations</div>
      <div class="trackCell trackOptions" />
    </div>

    <div
      v-for="(radioStation, index) in radioStations"
      :key="radioStation.id"
      class="trackRow"
      data-test-id="radio-station"
    >
      <div class="trackCell">
        <div>
          <TrackPlayPause
            :track-id="radioStation.id"
            :image="radioStation.image"
            :track-number="index + 1"
            @play-track="$emit('playRadioStation', radioStation)"
          />

          <MarqueeScroll>
            <LinkOrText
              is="a"
              :is-link="!!radioStation.homePageUrl"
              :text="radioStation.name"
              :to="radioStation.homePageUrl"
              target="_blank"
            />
          </MarqueeScroll>
        </div>
      </div>

      <div class="trackCell trackOptions">
        <DropdownMenu ref="dropdownMenu">
          <DropdownItem
            is="a"
            v-if="radioStation.homePageUrl"
            :href="radioStation.homePageUrl"
            target="_blank"
          >
            Visit station
          </DropdownItem>
          <DropdownItem
            ref="editRadioStation"
            @click="$emit('editRadioStation', radioStation)"
          >
            Edit station
          </DropdownItem>
          <DropdownItem
            ref="deleteRadioStation"
            @click="$emit('deleteRadioStation', radioStation.id)"
          >
            Delete station
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            ref="addToQueue"
            @click="$emit('addToQueue', radioStation)"
          >
            Add to queue
          </DropdownItem>
          <DropdownItem
            ref="playRadioStation"
            @click="$emit('playRadioStation', radioStation)"
          >
            Play station
          </DropdownItem>
        </DropdownMenu>
      </div>
    </div>
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.radioStation"
    message="No radio stations found."
  />
</template>

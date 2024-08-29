<script setup lang="ts">
import TrackImage from '@/components/TrackDetails/TrackImage.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import DropdownDivider from '@/components/Dropdown/DropdownDivider.vue';
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';

defineProps<{
  radioStations: RadioStation[];
}>();

defineEmits([
  'addToQueue',
  'deleteRadioStation',
  'editRadioStation',
  'playStation',
]);
</script>

<template>
  <div v-if="radioStations.length" ref="radioStationWrapper">
    <div class="trackHeader">
      <div class="trackPlay">#</div>
      <div class="trackDetails">
        <p>Station</p>
      </div>
    </div>

    <ol>
      <li
        v-for="radioStation in radioStations"
        :key="radioStation.id"
        class="trackItem"
        data-test-id="radio-station"
      >
        <div class="trackPlay">
          <TrackImage
            :track-id="radioStation.id"
            @play-current-track="$emit('playStation', radioStation)"
          />
        </div>

        <div class="trackDetails">
          <a
            :href="radioStation.homePageUrl"
            target="_blank"
            :class="['clamp', $style.name]"
          >
            {{ radioStation.name }}
          </a>

          <DropdownMenu data-test-id="dropdown-menu">
            <DropdownItem
              data-test-id="edit-radio-station"
              @click="$emit('editRadioStation', radioStation)"
            >
              Edit station
            </DropdownItem>
            <DropdownItem
              data-test-id="delete-radio-station"
              @click="$emit('deleteRadioStation', radioStation)"
            >
              Delete station
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              data-test-id="add-to-queue"
              @click="$emit('addToQueue', radioStation)"
            >
              Add to queue
            </DropdownItem>
            <DropdownItem
              data-test-id="play-station"
              @click="$emit('playStation', radioStation)"
            >
              Play station
            </DropdownItem>
          </DropdownMenu>
        </div>
      </li>
    </ol>
  </div>
  <NoMediaMessage v-else icon="PhRadio" message="No radio stations found." />
</template>

<style module>
.name {
  margin: 0 auto 0 0;
}
</style>

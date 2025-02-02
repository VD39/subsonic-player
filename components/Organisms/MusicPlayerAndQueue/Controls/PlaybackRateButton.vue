<script setup lang="ts">
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import DropdownTitle from '@/components/Molecules/Dropdown/DropdownTitle.vue';

const { playbackRate, setPlaybackRate } = useAudioPlayer();

const PLAYBACK_RATES = [
  {
    speed: 0.5,
    title: '0.5x',
  },
  {
    speed: 0.75,
    title: '0.75x',
  },
  {
    speed: 1,
    title: 'Normal',
  },
  {
    speed: 1.5,
    title: '1.5x',
  },
  {
    speed: 2,
    title: '2x',
  },
  {
    speed: 2.5,
    title: '2.5x',
  },
] as const;
</script>

<template>
  <DropdownMenu :icon="ICONS.setting">
    <DropdownTitle>Playback speed</DropdownTitle>
    <DropdownDivider />
    <DropdownItem
      v-for="rate in PLAYBACK_RATES"
      :key="rate.speed"
      :selected="playbackRate === rate.speed"
      @click="setPlaybackRate(rate.speed)"
    >
      {{ rate.title }}
    </DropdownItem>
  </DropdownMenu>
</template>

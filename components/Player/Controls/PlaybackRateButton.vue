<script setup lang="ts">
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';
import DropdownDivider from '@/components/Dropdown/DropdownDivider.vue';
import DropdownTitle from '@/components/Dropdown/DropdownTitle.vue';

const { playBackRate, setPlaybackRate } = useAudioPlayer();

const PLAYBACK_RATES = [
  {
    speed: 0.5,
    title: '0.5x',
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
];
</script>

<template>
  <DropdownMenu icon="PhGear" title="Playback speed">
    <DropdownTitle>Playback speed</DropdownTitle>
    <DropdownDivider />
    <DropdownItem
      v-for="rate in PLAYBACK_RATES"
      :key="rate.speed"
      :selected="playBackRate === rate.speed"
      @click="setPlaybackRate(rate.speed)"
    >
      {{ rate.title }}
    </DropdownItem>
  </DropdownMenu>
</template>

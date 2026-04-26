<script setup lang="ts">
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import DropdownTitle from '@/components/Molecules/Dropdown/DropdownTitle.vue';

const { playbackRate, setPlaybackRate } = useAudioPlayer();
</script>

<template>
  <DropdownMenu :icon="ICONS.setting">
    <DropdownTitle>Playback speed</DropdownTitle>
    <DropdownItem
      v-for="(rate, index) in PLAYBACK_RATES"
      :key="rate.speed"
      :selected="playbackRate === index"
      @click="setPlaybackRate(index)"
    >
      {{ rate.title }}
    </DropdownItem>
  </DropdownMenu>
</template>

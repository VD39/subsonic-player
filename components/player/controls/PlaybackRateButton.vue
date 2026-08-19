<script setup lang="ts">
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import DropdownTitle from '@/components/dropdown/DropdownTitle.vue';

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

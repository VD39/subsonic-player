<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { toggleQueuePlayer } = useQueue();
</script>

<template>
  <ButtonLink :icon="ICONS.queue" title="Open queue" @click="toggleQueuePlayer">
    Open queue
  </ButtonLink>
</template>

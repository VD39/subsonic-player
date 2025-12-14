<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { toggleQueuePlayer } = useQueue();
const router = useRouter();

// Detect if running on webOS TV
const isWebOS =
  typeof window !== 'undefined' && window.location.protocol === 'file:';

function handleQueueClick() {
  if (isWebOS) {
    // On webOS, navigate to queue page
    router.push({ name: ROUTE_NAMES.queue });
  } else {
    // On web, toggle queue modal
    toggleQueuePlayer();
  }
}
</script>

<template>
  <ButtonLink :icon="ICONS.queue" title="Open queue" @click="handleQueueClick">
    Open queue
  </ButtonLink>
</template>

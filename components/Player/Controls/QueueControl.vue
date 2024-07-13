<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';
import QueueMenu from '@/components/Queue/QueueMenu.vue';

const isQueueOpen = ref(false);

function toggleQueueListModal() {
  isQueueOpen.value = !isQueueOpen.value;
}
</script>

<template>
  <IconButton icon="PhQueue" title="Queue" @click="toggleQueueListModal">
    Queue
  </IconButton>

  <Teleport to="#teleports">
    <transition name="slide-up-down">
      <QueueMenu v-if="isQueueOpen" @close="toggleQueueListModal" />
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

const props = defineProps<{
  status: AsyncDataRequestStatus;
}>();

defineEmits<{
  refresh: [];
}>();

const buttonProps = computed(() => {
  const loading = props.status === 'pending';

  return {
    icon: loading ? SpinningLoader : ICONS.refresh,
    text: `${loading ? 'Refreshing' : 'Refresh'} page data`,
  };
});
</script>

<template>
  <ButtonLink
    :id="HOTKEY_ELEMENT_IDS.refreshDataButton"
    :icon="buttonProps.icon"
    iconSize="large"
    :title="buttonProps.text"
    @click="$emit('refresh')"
  >
    {{ buttonProps.text }}
  </ButtonLink>
</template>

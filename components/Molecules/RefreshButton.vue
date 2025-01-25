<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

const props = defineProps<{
  status: AsyncDataRequestStatus;
}>();

defineEmits(['refresh']);

const buttonProps = computed<ButtonProps>(() => {
  const loading = props.status === 'pending';

  return {
    icon: loading ? SpinningLoader : ICONS.refresh,
    text: `${loading ? 'Refreshing' : 'Refresh'} page data`,
  };
});
</script>

<template>
  <ButtonLink
    :icon="buttonProps.icon"
    :title="buttonProps.text"
    icon-size="large"
    @click="$emit('refresh')"
  >
    {{ buttonProps.text }}
  </ButtonLink>
</template>

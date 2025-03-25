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
    icon-size="large"
    :title="buttonProps.text"
    @click="$emit('refresh')"
  >
    {{ buttonProps.text }}
  </ButtonLink>
</template>

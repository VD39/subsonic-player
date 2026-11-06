<script setup lang="ts">
import type { AsyncDataRequestStatus } from 'nuxt/app';

import SpinningLoader from '@/components/notification/SpinningLoader.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';

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
    :id="KEYBOARD_SHORTCUT_ELEMENT_IDS.refreshDataButton"
    :icon="buttonProps.icon"
    iconSize="large"
    :title="buttonProps.text"
    @click="$emit('refresh')"
  >
    {{ buttonProps.text }}
  </ButtonLink>
</template>

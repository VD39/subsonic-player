<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

defineEmits(['refresh']);

const loading = useLoading();

const buttonProps = computed<ButtonProps>(() => ({
  icon: loading.value ? SpinningLoader : ICONS.refresh,
  text: `${loading.value ? 'Refreshing' : 'Refresh'} page data`,
}));
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

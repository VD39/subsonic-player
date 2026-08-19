<script setup lang="ts">
import SpinningLoader from '@/components/notification/SpinningLoader.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';

const props = defineProps<{
  fullWidth?: boolean;
  loading?: boolean;
}>();

const icon = computed(() => (props.loading ? SpinningLoader : undefined));
</script>

<template>
  <ButtonLink
    class="actionButton"
    :disabled="loading"
    :fullWidth
    :icon
    iconPosition="right"
    showText
    type="submit"
  >
    <slot />
  </ButtonLink>
</template>

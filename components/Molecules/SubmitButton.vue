<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

const props = defineProps<{
  fullWidth?: boolean;
  loading?: boolean;
}>();

const icon = computed(() => (props.loading ? SpinningLoader : undefined));
</script>

<template>
  <ButtonLink
    :class="$style.submitButton"
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

<style module>
.submitButton {
  --button-hover-color: var(--body-background-color);

  background-color: var(--button-hover-color);
  border: 1px solid var(--theme-color);
  border-radius: var(--border-radius-medium);

  @media (hover: hover) {
    &:hover,
    &:focus {
      --button-hover-color: var(--hover-selected-color);
    }
  }
}
</style>

<script setup lang="ts">
import ButtonLoader from '@/components/Loaders/ButtonLoader.vue';

defineProps<{
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <button
    :class="[
      $style.submitButton,
      {
        [$style.disabled]: disabled,
        [$style.fullWidth]: fullWidth,
      },
    ]"
    :disabled="disabled"
    type="submit"
  >
    <span :class="$style.content">
      <slot />

      <ButtonLoader v-if="loading" :class="$style.loader" />
    </span>
  </button>
</template>

<style module>
.submitButton {
  @mixin align-center;

  position: relative;
  justify-content: center;
  padding: var(--space-8);
  background-color: var(--body-background-color);
  border: 1px solid var(--theme-color);
  border-radius: var(--border-radius-m);

  &:hover {
    background-color: var(--hover-selected-color);
  }
}

.disabled {
  pointer-events: none;
  opacity: 0.25;
}

.fullWidth {
  width: 100%;
}

.content {
  @mixin align-center;

  gap: var(--space-8);
}

.loader {
  margin-left: var(--space-25);
}
</style>

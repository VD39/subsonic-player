<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: ICON_SIZE.medium,
  },
);
</script>

<template>
  <span :class="['centerItems', $style.spinningLoader]">
    <component
      :is="ICONS.spinner"
      ref="spinnerIcon"
      :size="size"
      :class="$style.icon"
    />

    <span class="visuallyHidden">Loading...</span>
  </span>
</template>

<style module>
.spinningLoader {
  flex-shrink: 0;
}

.icon {
  animation: spinner-loader 0.75s linear infinite;
}

@keyframes spinner-loader {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

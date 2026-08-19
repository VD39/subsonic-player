<script setup lang="ts">
defineProps<{
  label: string;
  pressed: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    :aria-checked="pressed"
    :class="[
      $style.button,
      {
        [$style.pressed]: pressed,
      },
    ]"
    role="switch"
    type="button"
    @click="$emit('click')"
  >
    <span class="visuallyHidden">{{ label }}</span>

    <span :class="$style.track" />
    <span :class="$style.knob" />
  </button>
</template>

<style module>
.button {
  --toggle-switch-button-height: 24px;

  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: var(--toggle-switch-button-height);
}

.track {
  width: 44px;
  height: var(--toggle-switch-button-height);
  background-color: var(--border-color);
  border-radius: var(--border-radius-large);
  transition: background-color var(--transition);

  .pressed & {
    background-color: var(--theme-color);
  }
}

.knob {
  --toggle-switch-knob-space: 2px;
  --toggle-switch-knob-width-height: calc(
    var(--toggle-switch-button-height) - var(--toggle-switch-knob-space)
  );

  position: absolute;
  left: var(--toggle-switch-knob-space);
  width: var(--toggle-switch-knob-width-height);
  height: var(--toggle-switch-knob-width-height);
  pointer-events: none;
  background-color: var(--background-color);
  border-radius: var(--border-radius-round);
  box-shadow: var(--box-shadow-small);
  transition: transform var(--transition);

  .pressed & {
    left: 0;
    transform: translateX(20px);
  }
}
</style>

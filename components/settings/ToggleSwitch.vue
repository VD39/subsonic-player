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
  <label ref="labelRef" :class="$style.label">
    <input
      ref="inputRef"
      :checked="pressed"
      :class="['visuallyHidden', $style.input]"
      type="checkbox"
      @change="$emit('click')"
    />

    <span class="visuallyHidden">{{ label }}</span>
    <span :class="$style.track" />
    <span :class="$style.knob" />
  </label>
</template>

<style module>
.label {
  --toggle-switch-button-height: 24px;

  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: 44px;
  height: var(--toggle-switch-button-height);
  cursor: pointer;
}

.input {
  &:checked ~ .track {
    background-color: var(--theme-color);
  }

  &:checked ~ .knob {
    left: 0;
    transform: translateX(20px);
  }

  &:focus-visible ~ .track {
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--theme-color) 40%, transparent);
  }
}

.track {
  display: block;
  width: 44px;
  height: var(--toggle-switch-button-height);
  background-color: var(--border-color);
  border-radius: var(--border-radius-large);
  transition: background-color var(--transition);
}

.knob {
  --toggle-switch-knob-space: 2px;
  --toggle-switch-knob-width-height: calc(
    var(--toggle-switch-button-height) - var(--toggle-switch-knob-space)
  );

  position: absolute;
  top: calc(var(--toggle-switch-knob-space) / 2);
  left: var(--toggle-switch-knob-space);
  width: var(--toggle-switch-knob-width-height);
  height: var(--toggle-switch-knob-width-height);
  pointer-events: none;
  background-color: var(--background-color);
  border-radius: var(--border-radius-round);
  box-shadow: var(--box-shadow-small);
  transition:
    left var(--transition),
    transform var(--transition);
}
</style>

<script setup lang="ts">
defineProps<{
  label: string;
  name: string;
  selected: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <label :class="$style.selectableBadge">
    <input
      ref="inputRef"
      :checked="selected"
      :class="['visuallyHidden', $style.input]"
      :name
      type="radio"
      @change="$emit('click')"
    />

    <span :class="['smallFont', 'strong', $style.label]">{{ label }}</span>
  </label>
</template>

<style module>
.selectableBadge {
  display: flex;
  justify-content: center;
  padding: var(--space-8) var(--space-24);
  text-align: center;
  cursor: pointer;
  border-right: 1px solid var(--border-color);
  transition: color var(--transition);

  &:last-child {
    border-right: none;
  }

  &:has(.input:focus-visible) {
    outline: 2px solid var(--theme-color);
    outline-offset: 2px;
  }
}

.input {
  &:checked ~ .label {
    color: var(--theme-color);
  }
}

.label {
  color: var(--secondary-font-color);
  transition: color var(--transition);
}
</style>

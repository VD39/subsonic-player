<script setup lang="ts">
defineProps<{
  label: string;
  selected: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    :aria-pressed="selected"
    :class="[
      $style.selectableBadge,
      {
        [$style.selected]: selected,
      },
    ]"
    type="button"
    @click="$emit('click')"
  >
    <span :class="['smallFont', 'strong', $style.label]">{{ label }}</span>
  </button>
</template>

<style module>
.selectableBadge {
  justify-content: center;
  padding: var(--space-8) var(--space-24);
  text-align: center;
  cursor: pointer;
  border-right: 1px solid var(--border-color);
  transition: color var(--transition);

  &:last-child {
    border-right: none;
  }
}

.label {
  color: var(--secondary-font-color);

  .selected & {
    color: var(--theme-color);
  }
}
</style>

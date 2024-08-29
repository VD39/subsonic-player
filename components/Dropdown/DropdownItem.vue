<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

withDefaults(
  defineProps<{
    is?: ButtonType;
    selected?: boolean;
  }>(),
  {
    is: undefined,
  },
);

defineEmits(['click']);
</script>

<template>
  <li :class="$style.dropdownItem">
    <IconButton
      :is="is"
      :class="[
        $style.action,
        {
          [$style.selected]: selected,
        },
      ]"
      show-text
      icon-position="right"
      full-width
      v-bind="$attrs"
      @click="$emit('click')"
    >
      <slot />
    </IconButton>
  </li>
</template>

<style module>
.dropdownItem {
  display: flex;
}

.action {
  justify-content: space-between;
  padding: var(--dropdown-spacing);

  &:hover {
    background-color: var(--hover-selected-color);
  }
}

.selected {
  background-color: var(--hover-selected-color);
}
</style>

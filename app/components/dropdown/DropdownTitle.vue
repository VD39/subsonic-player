<script setup lang="ts">
import DropdownDivider from './DropdownDivider.vue';
</script>

<template>
  <li :class="['centerItems', $style.dropdownTitle]">
    <p class="strong smallFont"><slot /></p>
  </li>

  <DropdownDivider />
</template>

<style module>
.dropdownTitle {
  width: var(--width-height-100);
  padding: var(--default-space);
}
</style>

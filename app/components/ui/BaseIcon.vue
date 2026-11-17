<script setup lang="ts">
withDefaults(
  defineProps<{
    fill?: string;
    icon: Component | Icon;
    size?: number;
    stroke?: string;
  }>(),
  {
    fill: 'none',
    size: undefined,
    stroke: undefined,
  },
);
</script>

<template>
  <component :is="icon" :color="stroke" :fill :size :strokeWidth="1" />
</template>

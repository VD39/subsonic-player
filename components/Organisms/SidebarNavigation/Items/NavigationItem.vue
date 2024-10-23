<script setup lang="ts">
defineProps<{
  collapsed: boolean;
  title: string;
}>();
</script>

<template>
  <li>
    <h4
      ref="title"
      :class="[
        'strong',
        'mBM',
        'sidebarTitle',
        {
          visuallyHidden: collapsed,
        },
      ]"
    >
      {{ title }}
    </h4>

    <ul v-if="$slots.default" ref="navigation">
      <slot />
    </ul>
  </li>
</template>

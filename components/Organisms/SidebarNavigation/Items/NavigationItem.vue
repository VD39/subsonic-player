<script setup lang="ts">
defineProps<{
  collapsed: boolean;
  title: string;
}>();
</script>

<template>
  <li>
    <p
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
    </p>

    <ul v-if="$slots.default" ref="navigation">
      <slot />
    </ul>
  </li>
</template>

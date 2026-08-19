<script setup lang="ts">
defineProps<{
  description?: string;
  title?: string;
  variant: 'badge' | 'list';
}>();
</script>

<template>
  <div>
    <div v-if="title || description" ref="titleDescriptionWrapper" class="mBS">
      <div
        v-if="title"
        ref="titleEl"
        :class="['smallFont', 'strong', 'mBXS', $style.title]"
      >
        {{ title }}
      </div>
      <div
        v-if="description"
        ref="descriptionEl"
        :class="['smallFont', $style.description]"
      >
        {{ description }}
      </div>
    </div>

    <div ref="slotContainer" :class="$style[variant]">
      <slot />
    </div>
  </div>
</template>

<style module>
.badge {
  display: inline-flex;
  flex-grow: 0;
  align-items: center;
  align-self: flex-start;
  overflow: hidden;
  background-color: var(--secondary-background-color);
  border-radius: var(--border-radius-large);
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.title {
  color: var(--secondary-font-color);
}

.description {
  line-height: var(--line-height-medium);
  color: var(--secondary-font-color);
}
</style>

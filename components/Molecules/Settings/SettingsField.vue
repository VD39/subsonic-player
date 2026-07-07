<script setup lang="ts">
defineProps<{
  description?: string;
  title: string;
}>();
</script>

<template>
  <div class="spaceBetween centerItems">
    <div :class="$style.info">
      <div :class="['sentenceCase', 'smallFont', 'strong', $style.title]">
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

    <div :class="$style.control">
      <slot />
    </div>
  </div>
</template>

<style module>
.info {
  flex: 1;
}

.title {
  color: var(--body-font-color);
}

.description {
  margin-top: var(--space-2);
  line-height: var(--line-height-medium);
  color: var(--secondary-font-color);
}

.control {
  flex-shrink: 0;
}
</style>

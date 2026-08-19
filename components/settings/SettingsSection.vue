<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <section :class="$style.settingsSection">
    <h2 :class="['smallFont', 'sentenceCase', 'mBM', $style.title]">
      {{ title }}
    </h2>

    <div :class="$style.content">
      <slot />
    </div>
  </section>
</template>

<style module>
.settingsSection {
  padding: var(--space-16);
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
}

.title {
  color: var(--secondary-font-color);
  text-transform: uppercase;
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}
</style>

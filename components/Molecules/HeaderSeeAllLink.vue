<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';

defineProps<{
  to: string;
}>();
</script>

<template>
  <HeaderWithAction>
    <h3 :class="$style.header">
      <NuxtLink :to="to">
        <slot />

        <PhCaretDoubleRight
          :class="$style.moreIcon"
          :size="18"
          weight="regular"
        />
      </NuxtLink>
    </h3>

    <NuxtLink :to="to" class="hideDesktop link">See all</NuxtLink>
  </HeaderWithAction>
</template>

<style module>
.header {
  &:hover,
  &:focus,
  &:focus-within {
    .moreIcon {
      --more-icon-opacity: 1;
    }
  }
}

.moreIcon {
  --more-icon-opacity: 0;

  opacity: var(--more-icon-opacity);
  transition: opacity var(--transition);
}
</style>

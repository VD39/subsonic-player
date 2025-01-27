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

        <component
          :is="ICONS.more"
          :class="$style.moreIcon"
          :size="ICON_SIZE.small"
          weight="regular"
        />
      </NuxtLink>
    </h3>

    <template #actions>
      <NuxtLink :to="to" class="mobileOnly link">See all</NuxtLink>
    </template>
  </HeaderWithAction>
</template>

<style module>
.header {
  @media (hover: hover) {
    &:hover,
    &:focus {
      .moreIcon {
        --more-icon-opacity: 1;
      }
    }
  }
}

.moreIcon {
  --more-icon-opacity: 0;

  opacity: var(--more-icon-opacity);
  transition: opacity var(--transition);
}
</style>

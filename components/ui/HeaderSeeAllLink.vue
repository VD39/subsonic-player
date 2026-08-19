<script setup lang="ts">
import HeaderWithAction from '@/components/ui/HeaderWithAction.vue';

defineProps<{
  to: ToProp;
}>();
</script>

<template>
  <HeaderWithAction>
    <h2 :class="$style.header">
      <NuxtLink draggable="false" :to>
        <slot />

        <component
          :is="ICONS.more"
          :class="$style.moreIcon"
          :size="ICON_SIZE.small"
          weight="regular"
        />
      </NuxtLink>
    </h2>

    <template #actions>
      <NuxtLink class="mobileOnly link" draggable="false" :to>
        See all
      </NuxtLink>
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

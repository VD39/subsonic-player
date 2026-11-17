<script setup lang="ts">
import BaseIcon from '@/components/ui/BaseIcon.vue';
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

        <BaseIcon
          :class="$style.moreIcon"
          :icon="ICONS.more"
          :size="ICON_SIZE.small"
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
  &:focus-within {
    .moreIcon {
      --more-icon-opacity: 1;
    }
  }

  @media (hover: hover) {
    &:hover {
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

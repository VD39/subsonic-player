<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

defineProps<{
  to: string;
}>();
</script>

<template>
  <div :class="$style.headerMoreLink">
    <h2 :class="$style.header">
      <NuxtLink :to="to">
        <slot />

        <IconButton
          is="span"
          :class="$style.more"
          icon="PhCaretDoubleRight"
          title="More"
          :icon-size="20"
          icon-weight="regular"
        >
          See all
        </IconButton>
      </NuxtLink>
    </h2>

    <NuxtLink :to="to" :class="$style.seeAll">See all</NuxtLink>
  </div>
</template>

<style module>
.headerMoreLink {
  @mixin align-center;

  justify-content: space-between;
}

.more {
  padding: 0 0 0 var(--space-4);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.header {
  &:hover,
  &:focus-within {
    .more {
      opacity: 1;
    }
  }
}

.seeAll {
  @media (--tablet-up) {
    display: none;
  }
}
</style>

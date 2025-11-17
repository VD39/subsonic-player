<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { setViewLayout, viewLayout } = useViewLayout();

const buttonProps = computed(() => ({
  icon: viewLayout.value === 'gridLayout' ? ICONS.listLayout : ICONS.gridLayout,
  layout: (viewLayout.value === 'gridLayout'
    ? 'listLayout'
    : 'gridLayout') as Layout,
  text:
    viewLayout.value === 'gridLayout'
      ? 'Switch to list layout'
      : 'Switch to grid layout',
}));
</script>

<template>
  <ClientOnly>
    <ButtonLink
      :id="HOTKEY_ELEMENT_IDS.viewLayoutButton"
      :icon="buttonProps.icon"
      :title="buttonProps.text"
      @click="setViewLayout(buttonProps.layout)"
    >
      {{ buttonProps.text }}
    </ButtonLink>
  </ClientOnly>
</template>

<script setup lang="ts">
import NavigationItem from './Items/NavigationItem.vue';
import SubNavigationItem from './Items/SubNavigationItem.vue';

defineProps<{
  collapsed: boolean;
}>();
</script>

<template>
  <ul class="mBM">
    <NavigationItem
      v-for="items in SIDEBAR_DESKTOP_NAVIGATION"
      :key="`navigation-${items.title}`"
      :collapsed="collapsed"
      :title="items.title"
      class="mBM"
    >
      <SubNavigationItem
        v-for="item in items.items"
        :key="`item-${item.title}`"
        :collapsed="collapsed"
        :icon="item.icon"
        :title="item.title"
        :to="item.to"
      />
    </NavigationItem>
  </ul>
</template>

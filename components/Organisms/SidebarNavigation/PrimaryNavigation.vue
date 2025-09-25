<script setup lang="ts">
import NavigationItem from './Items/NavigationItem.vue';
import SubNavigationItem from './Items/SubNavigationItem.vue';

defineProps<{
  collapsed: boolean;
}>();

const { drop } = useDragAndDrop();
</script>

<template>
  <ul class="mBM">
    <NavigationItem
      v-for="items in SIDEBAR_DESKTOP_NAVIGATION"
      :key="`navigation-${items.title}`"
      class="mBM"
      :collapsed
      :title="items.title"
    >
      <SubNavigationItem
        v-for="item in items.items"
        :key="`item-${item.title}`"
        :class="[
          {
            [DRAG_AND_DROP_CLASS_NAMES.isDroppable]: item.isDroppable,
          },
        ]"
        :collapsed
        :icon="item.icon"
        :title="item.title"
        :to="item.to"
        @drop="drop(QUEUE_ID, $event)"
      />
    </NavigationItem>
  </ul>
</template>

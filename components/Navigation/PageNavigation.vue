<script setup lang="ts">
defineProps<{
  navigation: PageNavigation[];
}>();
</script>

<template>
  <nav :class="$style.pageNavigation">
    <ul :class="$style.navigation">
      <li v-for="item in navigation" :key="item.title" data-test-id="item">
        <NuxtLink
          :to="item.to"
          :class="$style.link"
          :exact-active-class="$style.current"
        >
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style module>
.pageNavigation {
  margin-bottom: var(--space-24);
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-16);
}

.link {
  display: block;
  padding: var(--button-spacing);
}

.current {
  background-color: var(--secondary-background-color);
  border-radius: var(--border-radius-medium);
}
</style>

<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
</script>

<template>
  <nav>
    <ul
      :class="['inner', 'centerAll', 'spaceBetween', $style.mobileNavigation]"
    >
      <li
        v-for="item in MOBILE_NAVIGATION"
        :key="`navigation-${item.title}`"
        :class="$style.item"
      >
        <ButtonLink
          is="nuxt-link"
          v-if="item.icon"
          :to="item.to"
          :icon="item.icon"
          class="link smallFont column centerAll"
          :title="item.title"
          show-text
        >
          {{ item.title }}
        </ButtonLink>
      </li>
    </ul>
  </nav>
</template>

<style module>
.mobileNavigation {
  position: fixed;
  inset: auto 0 0;
  z-index: 9;
  width: var(--width-height-100);
  height: var(--header-height);
  padding: var(--default-space);
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
}

.item {
  flex: 1;
}
</style>

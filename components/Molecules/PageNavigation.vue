<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import OverflowShadow from '@/components/Atoms/OverflowShadow.vue';

defineProps<{
  navigation: PageNavigation;
}>();
</script>

<template>
  <nav :class="$style.pageNavigation">
    <OverflowShadow>
      <ul :class="['centerItems', $style.navigation]">
        <template v-for="(path, name) in navigation" :key="name">
          <li :class="$style.item">
            <ButtonLink
              is="nuxt-link"
              class="link pageLink"
              exactActiveClass="pageCurrentLink"
              showText
              :to="path"
            >
              {{ name }}
            </ButtonLink>
          </li>
        </template>
      </ul>
    </OverflowShadow>
  </nav>
</template>

<style module>
.pageNavigation {
  position: relative;
  z-index: 1;
  width: 100%;
}

.navigation {
  --navigation-flex-wrap: nowrap;

  flex: 1;
  flex-wrap: var(--navigation-flex-wrap);
  gap: 0;

  @media (--tablet-up) {
    --navigation-flex-wrap: wrap;
  }

  @media (--mobile-only) {
    border-bottom: 1px solid var(--border-color);
  }
}

.item {
  @media (--mobile-only) {
    flex: 1;
  }
}
</style>

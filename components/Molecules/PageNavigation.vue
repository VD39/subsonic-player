<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

defineProps<{
  navigation: PageNavigation;
}>();
</script>

<template>
  <nav :class="$style.pageNavigation">
    <ul :class="['centerItems', $style.navigation]">
      <template v-for="(path, name) in navigation.routes" :key="name">
        <li :class="$style.item">
          <ButtonLink
            is="nuxt-link"
            :to="
              !navigation.param
                ? {
                    path,
                  }
                : {
                    params: {
                      [navigation.param]: path,
                    },
                  }
            "
            show-text
            class="link pageLink"
            exact-active-class="pageCurrentLink"
          >
            {{ name }}
          </ButtonLink>
        </li>
      </template>
    </ul>
  </nav>
</template>

<style module>
.pageNavigation {
  position: relative;
  z-index: 2;
  width: 100%;
}

.navigation {
  --navigation-flex-wrap: nowrap;

  flex-wrap: var(--navigation-flex-wrap);
  gap: 0;
  overflow: auto;

  @media (--tablet-up) {
    --navigation-flex-wrap: wrap;
  }

  @media (--mobile-only) {
    border-bottom: 1px solid var(--border-color);

    .item {
      flex: 1;
    }
  }
}
</style>

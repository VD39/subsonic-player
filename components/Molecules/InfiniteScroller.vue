<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

const props = defineProps<{
  hasMore: boolean;
  loading: boolean;
}>();

const emit = defineEmits<{
  loadMore: [];
}>();

const infiniteScrollerRef = ref<HTMLElement | null>(null);
const intersectionObserver = ref<IntersectionObserver | null>(null);

const buttonProps = computed<ButtonProps>(() => ({
  icon: props.loading ? SpinningLoader : undefined,
  text: props.loading ? 'Loading data' : 'Load more',
}));

function loadMore() {
  emit('loadMore');
}

onMounted(() => {
  if (!infiniteScrollerRef.value) {
    return;
  }

  intersectionObserver.value = new IntersectionObserver(
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        if (props.hasMore && !props.loading) {
          loadMore();
        } else {
          intersectionObserver.value?.disconnect();
        }
      }
    },
    {
      root: null,
      rootMargin: '-65px',
      threshold: 0.1,
    },
  );

  intersectionObserver.value.observe(infiniteScrollerRef.value);
});

onUnmounted(() => {
  intersectionObserver.value?.disconnect();
});
</script>

<template>
  <div ref="infiniteScrollerRef" class="infinityScroller">
    <ButtonLink
      v-if="hasMore"
      :class="['centerAll', $style.buttonLink]"
      :disabled="loading"
      :icon="buttonProps.icon"
      :showText="!loading"
      :title="buttonProps.text"
      @click="loadMore"
    >
      {{ buttonProps.text }}
    </ButtonLink>

    <p v-else ref="message" :class="['centerAll', $style.message]">
      -- No more content --
    </p>
  </div>
</template>

<style module>
.buttonLink {
  width: 150px;
  height: 50px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
}

.buttonLink,
.message {
  margin: var(--space-24) auto 0;
}
</style>

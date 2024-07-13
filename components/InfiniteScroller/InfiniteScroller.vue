<script setup lang="ts">
import ScrollerLoader from '@/components/Loaders/ScrollerLoader.vue';

const emit = defineEmits(['loadMore']);

emit('loadMore');

const { loading, hasMore } = useInfinityLoading();

const title = computed(() => (loading.value ? 'Loading data' : 'Load more'));

const containerRef = ref<HTMLElement | null>(null);

function handleScroll() {
  if (
    !loading.value &&
    containerRef.value!.getBoundingClientRect().bottom < window.innerHeight
  ) {
    emit('loadMore');
  }
}

onMounted(() => {
  if (containerRef.value) {
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

function loadMore() {
  emit('loadMore');
}
</script>

<template>
  <div ref="containerRef">
    <button
      v-if="hasMore"
      ref="button"
      :class="$style.button"
      type="button"
      :title="title"
      :disabled="loading"
      @click="loadMore"
    >
      <span v-if="!loading">Load more</span>

      <ScrollerLoader v-if="loading" />
    </button>
  </div>
</template>

<style module>
.button {
  @mixin align-center;

  justify-content: center;
  width: 150px;
  height: 50px;
  padding: var(--button-spacing);
  margin: var(--space-32) auto;
  cursor: pointer;
  background-color: var(--dark-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-m);

  &:disabled {
    pointer-events: none;
    opacity: 0.25;
  }
}
</style>

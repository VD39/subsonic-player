<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

const emit = defineEmits(['loadMore']);

const { hasMore, loading } = useInfinityLoading();

const containerRef = ref<HTMLElement | null>(null);

const title = computed(() => (loading.value ? 'Loading data' : 'Load more'));

function loadMore() {
  emit('loadMore');
}

function onScroll() {
  if (
    !loading.value &&
    containerRef.value!.getBoundingClientRect().bottom < window.innerHeight
  ) {
    loadMore();
  }
}

loadMore();

onMounted(() => {
  if (!containerRef.value) {
    return;
  }

  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <div ref="containerRef">
    <ButtonLink
      v-if="hasMore"
      :class="['centerAll', $style.buttonLink]"
      :title="title"
      :disabled="loading"
      show-text
      @click="loadMore"
    >
      <SpinningLoader v-if="loading" />

      <span v-else>Load more</span>
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

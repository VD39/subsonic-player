<script setup lang="ts">
import IconImage from '@/components/Atoms/IconImage.vue';

const props = withDefaults(
  defineProps<{
    alt?: string;
    image: Image;
    lazyLoad?: boolean;
  }>(),
  {
    alt: 'Image',
    lazyLoad: true,
  },
);

const { getImageUrl } = useAPI();

const preloadImageRef = useTemplateRef('preloadImageRef');

const loading = ref(true);
const loadImage = ref(false);
const intersectionObserver = ref<IntersectionObserver | null>(null);

function onImageLoad() {
  loading.value = false;
}

const imageSrc = computed(() => {
  if (Object.values(IMAGE_DEFAULT_BY_TYPE).includes(props.image as Icon)) {
    return null;
  }

  if (isUrl(props.image)) {
    return props.image;
  }

  return getImageUrl(props.image);
});

onMounted(async () => {
  if (!preloadImageRef.value || !imageSrc.value || !props.lazyLoad) {
    return;
  }

  intersectionObserver.value = new IntersectionObserver(
    ([entry], observer) => {
      if (entry && entry.isIntersecting) {
        loadImage.value = true;
        observer?.disconnect();
      }
    },
    {
      root: null,
      threshold: 0.1,
    },
  );

  intersectionObserver.value.observe(preloadImageRef.value);
});

onUnmounted(() => {
  intersectionObserver.value?.disconnect();
});
</script>

<template>
  <div ref="preloadImageRef" :class="['centerAll', $style.preloadImage]">
    <template v-if="imageSrc">
      <span
        v-show="loading || !loadImage"
        ref="imageLoader"
        class="skeletonLoader"
      >
        <span class="visuallyHidden">Loading image</span>
      </span>

      <ClientOnly>
        <img
          v-show="!loading || loadImage"
          ref="img"
          :alt
          :class="$style.image"
          draggable="false"
          loading="lazy"
          :src="imageSrc"
          @load="onImageLoad"
        />
      </ClientOnly>
    </template>

    <IconImage v-else :icon="image as Icon" />
  </div>
</template>

<style module>
.preloadImage {
  --preload-opacity: 1;

  position: relative;
  flex-shrink: 0;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--box-shadow-medium);
  opacity: var(--preload-opacity);

  @media (hover: hover) {
    &:hover {
      --preload-opacity: 0.85;
    }
  }
}

.image {
  height: var(--width-height-100);
  object-fit: cover;
}
</style>

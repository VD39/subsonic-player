<script setup lang="ts">
import ImageLoader from '@/components/Loaders/ImageLoader.vue';
import DefaultImage from './DefaultImage.vue';

const props = withDefaults(
  defineProps<{
    image: string;
    alt?: string;
  }>(),
  {
    alt: 'Image',
  },
);

const { getImageUrl } = useAPI();

const isLoading = ref(true);

function onImageLoad() {
  isLoading.value = false;
}

const imageSrc = computed(() => {
  if (DEFAULT_IMAGE_ICONS.includes(props.image)) {
    return null;
  }

  if (isUrl(props.image)) {
    return props.image;
  }

  return getImageUrl(props.image);
});
</script>

<template>
  <div :class="$style.preloadImage">
    <template v-if="imageSrc">
      <ImageLoader v-show="isLoading" />

      <img
        v-show="!isLoading"
        ref="img"
        :class="$style.image"
        :src="imageSrc"
        :alt="alt"
        @load="onImageLoad"
      />
    </template>
    <DefaultImage v-else :icon="image" />
  </div>
</template>

<style module>
.preloadImage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--border-radius-small);
  box-shadow: var(--box-shadow-medium);
}

.image {
  height: 100%;
  object-fit: cover;
}
</style>

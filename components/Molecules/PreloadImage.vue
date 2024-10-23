<script setup lang="ts">
import IconImage from '@/components/Atoms/IconImage.vue';

const props = withDefaults(
  defineProps<{
    alt?: string;
    image: Image;
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
  if (Object.values(IMAGE_DEFAULT_BY_TYPE).includes(props.image as Icon)) {
    return null;
  }

  if (isUrl(props.image)) {
    return props.image;
  }

  return getImageUrl(props.image);
});
</script>

<template>
  <div :class="['centerAll', $style.preloadImage]">
    <template v-if="imageSrc">
      <span v-show="isLoading" ref="imageLoader" :class="$style.imageLoader">
        <span class="visuallyHidden">Loading image</span>
      </span>

      <img
        v-show="!isLoading"
        ref="img"
        :class="$style.image"
        :src="imageSrc"
        :alt="alt"
        @load="onImageLoad"
      />
    </template>

    <IconImage v-else :icon="image" />
  </div>
</template>

<style module>
.preloadImage {
  --preload-opacity: 1;

  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--box-shadow-medium);
  opacity: var(--preload-opacity);

  &:hover {
    --preload-opacity: 0.85;
  }
}

.image {
  height: var(--width-height-100);
  object-fit: cover;
}

.imageLoader {
  display: block;
  overflow: hidden;

  &::after {
    position: absolute;
    inset: 0;
    z-index: 1;
    height: var(--width-height-100);
    content: '';
    background: linear-gradient(
      90deg,
      transparent,
      var(--border-color),
      transparent
    );
    transform: translateX(-100%);
    animation: image-loader 1.5s infinite;
  }
}

@keyframes image-loader {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}
</style>

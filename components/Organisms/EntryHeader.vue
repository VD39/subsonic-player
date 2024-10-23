<script setup lang="ts">
import PreloadImage from '@/components/Molecules/PreloadImage.vue';

defineProps<{
  images: string[];
  title: string;
}>();
</script>

<template>
  <div :class="$style.entryHeader">
    <PreloadImage
      :image="images[0]"
      :alt="title"
      :class="$style.backgroundImage"
    />

    <div :class="$style.blur" />
  </div>

  <section :class="['mBXL', $style.content]">
    <figure :class="$style.figure">
      <PreloadImage
        v-for="image in images"
        :key="image"
        :image="image"
        :class="$style.preloadImage"
        :alt="title"
        data-test-id="image"
      />
    </figure>

    <div :class="['mBAllM', $style.detailsWrapper]">
      <h1>{{ title }}</h1>

      <slot />
    </div>
  </section>
</template>

<style module>
.entryHeader {
  --image-width-height: var(--width-height-100);

  position: absolute;
  inset: 0 0 auto;
  z-index: 0;
  height: 500px;
  overflow: hidden;
}

.backgroundImage {
  position: absolute;
  inset: 0;
  width: var(--image-width-height);
  height: var(--image-width-height);
  filter: brightness(0.7) blur(4rem);
}

.blur {
  position: absolute;
  inset: auto auto 0 0;
  width: var(--image-width-height);
  height: var(--image-width-height);
  background-image: var(--image-blur);
}

.content {
  --content-direction: column;

  position: relative;
  display: flex;
  flex-direction: var(--content-direction);
  gap: var(--space-24);

  @media (--tablet-up) {
    --content-direction: row;
  }

  + * {
    position: relative;
  }
}

.figure {
  --figure-width-height: 270px;
  --figure-spacing: var(--space-4);
  --figure-margin: auto;

  position: relative;
  display: grid;
  flex-shrink: 0;
  gap: var(--figure-spacing);
  width: var(--width-height-100);
  max-width: var(--figure-width-height);
  height: var(--width-height-100);
  max-height: var(--figure-width-height);
  aspect-ratio: 1;
  padding: var(--figure-spacing);
  margin: 0 var(--figure-margin);
  overflow: hidden;
  background-image: var(--image-blur);

  :nth-child(2) {
    grid-column-start: 2;
  }

  :nth-child(1):nth-last-child(3) {
    grid-row-start: span 2;
  }

  @media (--tablet-up) {
    --figure-width-height: 300px;
    --figure-margin: 0;
  }
}

.preloadImage {
  width: var(--width-height-100);
  height: var(--width-height-100);
}

.detailsWrapper {
  padding: var(--space-12) 0;

  @media (--mobile-only) {
    > * {
      justify-content: center;
      text-align: center;
    }
  }
}
</style>

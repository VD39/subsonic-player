<script setup lang="ts">
import PreloadImage from '@/components/Image/PreloadImage.vue';

defineProps<{
  images: string[];
  title: string;
}>();
</script>

<template>
  <div :class="$style.background">
    <PreloadImage
      :image="images[0]"
      :alt="title"
      :class="$style.backgroundImage"
    />
    <div :class="$style.blur" />
  </div>

  <section :class="$style.content">
    <figure :class="$style.figure">
      <PreloadImage
        v-for="image in images"
        :key="image"
        :image="image"
        :class="$style.image"
        :alt="title"
        data-test-id="image"
      />
    </figure>

    <div>
      <h1>{{ title }}</h1>

      <slot />
    </div>
  </section>
</template>

<style module>
.background {
  position: absolute;
  inset: 0 0 auto;
  z-index: 0;
  height: 500px;
  overflow: hidden;
}

.backgroundImage {
  position: absolute;
  inset: -20% auto auto -20%;
  width: 120%;
  height: 120%;
  filter: brightness(0.75) blur(3.5rem);
}

.blur {
  position: absolute;
  inset: auto auto 0 0;
  width: 100%;
  height: 100%;
  background-image: var(--image-blur);
}

.content {
  position: relative;
  display: flex;
  gap: var(--space-24);
  margin-bottom: var(--space-40);
}

.figure {
  position: relative;
  display: grid;
  flex-shrink: 0;
  gap: var(--space-4);
  width: 300px;
  height: 300px;
  aspect-ratio: 1;
  padding: var(--space-4);
  overflow: hidden;
  background-image: var(--image-blur);

  :nth-child(2) {
    grid-column-start: 2;
  }

  :nth-child(1):nth-last-child(3) {
    grid-row-start: span 2;
  }
}

.image {
  width: 100%;
  height: 100%;
}
</style>

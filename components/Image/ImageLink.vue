<script setup lang="ts">
import PreloadImage from '@/components/Image/PreloadImage.vue';

defineProps<{
  to: string;
  title: string;
  image: string;
}>();
</script>

<template>
  <figure :class="$style.figure">
    <NuxtLink ref="link" :to="to" :title="`Go to ${title}`">
      <PreloadImage :image="image" :alt="title" />
    </NuxtLink>
  </figure>
</template>

<style module>
.figure {
  &:hover {
    opacity: 0.8;
  }
}
</style>

<script setup lang="ts">
import PreloadImage from '@/components/Molecules/PreloadImage.vue';

defineProps<{
  image: Image;
  title: string;
  to: string;
}>();
</script>

<template>
  <figure>
    <NuxtLink :to="to" :title="`Go to ${title}`">
      <PreloadImage :image="image" :alt="title" />
    </NuxtLink>
  </figure>
</template>

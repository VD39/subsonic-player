<script setup lang="ts">
import PreloadImage from '@/components/Molecules/PreloadImage.vue';

defineProps<{
  image: Image;
  title: string;
  to: ToProp;
}>();
</script>

<template>
  <figure>
    <NuxtLink draggable="false" :title :to>
      <PreloadImage :alt="title" :image />
    </NuxtLink>
  </figure>
</template>

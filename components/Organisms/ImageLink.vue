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
    <NuxtLink :title="title" :to="to">
      <PreloadImage :alt="title" :image="image" />
    </NuxtLink>
  </figure>
</template>

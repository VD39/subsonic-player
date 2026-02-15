<script setup lang="ts">
import PreloadImage from '@/components/Molecules/PreloadImage.vue';

defineProps<{
  image: string;
  title: string;
  to: ToProp;
}>();
</script>

<template>
  <figure>
    <NuxtLink :class="INTERACTION_LINK_CLASS" draggable="false" :title :to>
      <PreloadImage :alt="title" :image />
    </NuxtLink>
  </figure>
</template>

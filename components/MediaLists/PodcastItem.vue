<script setup lang="ts">
import ImageLink from '@/components/Image/ImageLink.vue';

defineProps<{
  podcast: Podcast;
}>();
</script>

<template>
  <article>
    <ImageLink
      :to="`/podcast/${podcast.id}`"
      :title="podcast.name"
      :image="podcast.image"
    />
  </article>
</template>

<script setup lang="ts">
import ImageLink from '@/components/Organisms/ImageLink.vue';

defineProps<{
  podcast: Podcast;
}>();
</script>

<template>
  <article>
    <ImageLink
      :to="`/podcast/all/${podcast.id}`"
      :title="`Go to podcast ${podcast.name}`"
      :image="podcast.image"
    />
  </article>
</template>

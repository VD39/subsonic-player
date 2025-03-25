<script setup lang="ts">
import ImageLink from '@/components/Organisms/ImageLink.vue';

defineProps<{
  podcast: Podcast;
}>();
</script>

<template>
  <article>
    <ImageLink
      :image="podcast.image"
      :title="`Go to podcast ${podcast.name}`"
      :to="`/podcast/all/${podcast.id}`"
    />
  </article>
</template>

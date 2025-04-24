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
      :to="{
        name: ROUTE_NAMES.podcast,
        params: {
          [ROUTE_PARAM_KEYS.podcast.sortBy]: ROUTE_PODCAST_SORT_BY_PARAMS.All,
          [ROUTE_PARAM_KEYS.podcast.id]: podcast.id,
        },
      }"
    />
  </article>
</template>

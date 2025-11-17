<script setup lang="ts">
import ImageLink from '@/components/Organisms/ImageLink.vue';

const props = defineProps<{
  podcast: Podcast;
}>();

const podcastProps = computed(() => ({
  title: `Go to podcast ${props.podcast.name}`,
  toLink: {
    name: ROUTE_NAMES.podcast,
    params: {
      [ROUTE_PARAM_KEYS.podcast.id]: props.podcast.id,
      [ROUTE_PARAM_KEYS.podcast.sortBy]: ROUTE_PODCAST_SORT_BY_PARAMS.All,
    },
  },
}));
</script>

<template>
  <article class="layoutItem">
    <ImageLink
      class="layoutImage"
      :image="podcast.image"
      :title="podcastProps.title"
      :to="podcastProps.toLink"
    />

    <div class="layoutContent">
      <p class="strong smallFont clamp2">
        <NuxtLink
          :aria-label="podcastProps.title"
          class="layoutLink"
          draggable="false"
          :to="podcastProps.toLink"
        >
          {{ podcast.name }}
        </NuxtLink>
      </p>
    </div>
  </article>
</template>

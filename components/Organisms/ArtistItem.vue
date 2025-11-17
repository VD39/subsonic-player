<script setup lang="ts">
import ImageLink from '@/components/Organisms/ImageLink.vue';

const props = defineProps<{
  artist: Artist | SimilarArtist;
}>();

const artistProps = computed(() => ({
  title: `Go to artist ${props.artist.name}`,
  toLink: {
    name: ROUTE_NAMES.artist,
    params: {
      [ROUTE_PARAM_KEYS.artist.id]: props.artist.id,
    },
  },
}));
</script>

<template>
  <article class="layoutItem">
    <ImageLink
      class="layoutImage"
      :image="artist.image"
      :title="artistProps.title"
      :to="artistProps.toLink"
    />

    <div class="layoutContent">
      <p class="strong smallFont clamp2">
        <NuxtLink
          :aria-label="artistProps.title"
          class="layoutLink"
          draggable="false"
          :to="artistProps.toLink"
        >
          {{ artist.name }}
        </NuxtLink>
      </p>
    </div>
  </article>
</template>

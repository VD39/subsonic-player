<script setup lang="ts">
import ImageLink from '@/components/Organisms/ImageLink.vue';

const props = defineProps<{
  artist: Artist | SimilarArtist;
}>();

const toLink = `/artist/${props.artist.id}`;
</script>

<template>
  <article>
    <ImageLink
      :to="toLink"
      :title="`Go to artist ${artist.name}`"
      :image="artist.image"
      class="mBS"
    />

    <p class="mBXS strong smallFont clamp2">
      <NuxtLink
        :to="toLink"
        class="link"
        :aria-label="`Go to artist ${artist.name}`"
      >
        {{ artist.name }}
      </NuxtLink>
    </p>
  </article>
</template>

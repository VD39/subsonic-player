<script setup lang="ts">
import ImageLink from '@/components/Image/ImageLink.vue';

const props = defineProps<{
  artist: Artist;
}>();

const toLink = `/artist/${props.artist.id}`;
</script>

<template>
  <article>
    <ImageLink :to="toLink" :title="artist.name" :image="artist.image" />

    <p class="clamp clamp2">
      <NuxtLink :to="toLink" :title="`Go to artist ${artist.name}`">
        {{ artist.name }}
      </NuxtLink>
    </p>
  </article>
</template>

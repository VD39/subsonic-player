<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';

defineProps<{
  image: Image;
}>();

defineEmits<{
  downloadEpisode: [];
}>();
</script>

<template>
  <div :class="['overlapWrapper', $style.downloadPodcastEpisode]">
    <PreloadImage class="overlap" :image="image" />

    <ButtonLink
      :class="['overlap', $style.buttonLink]"
      :icon="ICONS.download"
      title="Download episode"
      @click="$emit('downloadEpisode')"
    >
      Download episode
    </ButtonLink>
  </div>
</template>

<style module>
.downloadPodcastEpisode {
  --podcast-width-height: var(--track-width-height-large);

  width: var(--podcast-width-height);
  height: var(--podcast-width-height);
}

.buttonLink {
  --button-width-height: calc(var(--track-width-height-default) * 1.25);

  width: var(--button-width-height);
  height: var(--button-width-height);
  margin: auto;
  background-color: var(--theme-color);
  border-radius: var(--border-radius-round);
}
</style>

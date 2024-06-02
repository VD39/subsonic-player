<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { closeModal, openModal } = useModal();
const { podcasts, getPodcasts, addPodcast } = usePodcast();

function addPodcastModal() {
  openModal('addPodcastModal', {
    /* istanbul ignore next -- @preserve */
    async onSubmit(podcastUrl: string) {
      await addPodcast(podcastUrl);
      closeModal();
      await getPodcasts(true);
    },
  });
}

if (!podcasts.value?.length) {
  getPodcasts();
}
</script>

<template>
  <div :class="$style.header">
    <h1>Podcasts</h1>

    <IconButton icon="plus" title="Add radio station" @click="addPodcastModal">
      Add radio station
    </IconButton>
  </div>

  <div v-for="podcast in podcasts" :key="podcast.id">
    <NuxtLink :to="`/podcast/${podcast.id}`">
      {{ podcast.title }}
    </NuxtLink>
  </div>
</template>

<style module>
.header {
  @mixin align-center;

  justify-content: space-between;
}
</style>

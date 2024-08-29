<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';
import PodcastItem from '@/components/MediaLists/PodcastItem.vue';
import MediaListWrapper from '@/components/MediaLists/MediaListWrapper.vue';
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';

const { closeModal, openModal } = useModal();
const { podcasts, getPodcasts, addPodcast } = usePodcast();

function addPodcastModal() {
  openModal('addPodcastModal', {
    /* istanbul ignore next -- @preserve */
    async onSubmit(podcastUrl: string) {
      await addPodcast(podcastUrl);
      closeModal();
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

    <IconButton
      :icon-size="35"
      icon="PhPlusCircle"
      title="Add podcast"
      @click="addPodcastModal"
    >
      Add podcast
    </IconButton>
  </div>

  <MediaListWrapper v-if="podcasts.length">
    <PodcastItem
      v-for="podcast in podcasts"
      :key="podcast.id"
      :podcast="podcast"
    />
  </MediaListWrapper>
  <NoMediaMessage v-else icon="PhApplePodcastsLogo" message="No podcasts found." />
</template>

<style module>
.header {
  @mixin align-center;

  justify-content: space-between;
}

.podcast {
  position: relative;
  background-color: var(--track-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);

  &:hover {
    .image::after {
      position: absolute;
      inset: 0;
      content: '';
      background: rgb(0 0 0 / 40%);
    }
  }
}

.notFound {
  position: relative;
  height: 100%;
}

.content {
  @mixin align-center;

  position: absolute;
  inset: 50% auto auto 50%;
  flex-direction: column;
  transform: translate(-50%, -50%);
}
</style>

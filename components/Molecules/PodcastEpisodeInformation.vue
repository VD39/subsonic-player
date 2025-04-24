<script setup lang="ts">
import LinkOrText from '@/components/Atoms/LinkOrText.vue';

const props = defineProps<{
  podcastEpisode: PodcastEpisode;
}>();

const downloadedIcon = computed(() =>
  props.podcastEpisode.downloaded ? ICONS.downloaded : ICONS.notDownloaded,
);
</script>

<template>
  <div :class="['trackTable', $style.trackInformation]">
    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Title</div>

      <div class="trackCell">
        <p>{{ podcastEpisode.name }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Podcast</div>

      <div class="trackCell">
        <LinkOrText
          :is-link="!!podcastEpisode.podcastId"
          :text="podcastEpisode.podcastName"
          :to="{
            name: ROUTE_NAMES.podcast,
            params: {
              [ROUTE_PARAM_KEYS.podcast.sortBy]:
                ROUTE_PODCAST_SORT_BY_PARAMS.All,
              [ROUTE_PARAM_KEYS.podcast.id]: podcastEpisode.podcastId,
            },
          }"
        />
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Author</div>

      <div class="trackCell">
        <p>{{ podcastEpisode.author }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Description</div>

      <div class="trackCell">
        <div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="podcastEpisode.description" />
        </div>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Duration</div>

      <time class="trackCell">
        {{ podcastEpisode.duration }}
      </time>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">
        Published Date
      </div>

      <div class="trackCell">
        <p>{{ podcastEpisode.publishDate }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Downloaded</div>

      <div class="trackCell">
        <component
          :is="downloadedIcon"
          ref="iconComponent"
          :size="ICON_SIZE.medium"
        />
      </div>
    </div>
  </div>
</template>

<style module>
.trackInformation {
  a {
    color: var(--theme-color);
  }
}

.title {
  width: 25%;
}

.list {
  gap: 0;
}
</style>

<script setup lang="ts">
import LinkOrText from '@/components/Atoms/LinkOrText.vue';

defineProps<{
  podcast: Podcast;
}>();
</script>

<template>
  <div :class="['trackTable', $style.trackInformation]">
    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Title</div>

      <div class="trackCell">
        <LinkOrText
          :isLink="!!podcast.id"
          :text="podcast.name"
          :to="{
            name: ROUTE_NAMES.podcast,
            params: {
              [ROUTE_PARAM_KEYS.podcast.sortBy]:
                ROUTE_PODCAST_SORT_BY_PARAMS.All,
              [ROUTE_PARAM_KEYS.podcast.id]: podcast.id,
            },
          }"
        />
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Description</div>

      <div class="trackCell">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="podcast.description" />
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">
        Total Episodes
      </div>

      <div class="trackCell">
        <p>{{ podcast.totalEpisodes }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">
        Downloaded Episodes
      </div>

      <div class="trackCell">
        <p>{{ podcast.totalDownloadedEpisodes }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Last Updated</div>

      <div class="trackCell">
        <p>{{ podcast.lastUpdated }}</p>
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
  min-width: 25%;
}

.list {
  gap: 0;
}
</style>

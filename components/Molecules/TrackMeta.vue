<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';

defineProps<{
  track: Bookmark | MixedTrack;
}>();
</script>

<template>
  <div class="noTouchEvents">
    <MarqueeScroll class="mBXS" inert>
      <h4>{{ track.name }}</h4>
    </MarqueeScroll>

    <MarqueeScroll class="smallFont mobileOnly mBXS">
      <ul class="bulletList">
        <li v-if="'album' in track && track.album" ref="album">
          <span class="visuallyHidden">Track album</span>

          <LinkOrText
            :isLink="!!track.albumId"
            :text="track.album"
            :to="{
              name: ROUTE_NAMES.album,
              params: {
                [ROUTE_PARAM_KEYS.album.id]: track.albumId,
              },
            }"
          />
        </li>
        <li
          v-if="'podcastName' in track && track.podcastName"
          ref="podcastName"
        >
          <span class="visuallyHidden">Podcast name</span>

          <LinkOrText
            :isLink="!!track.podcastId"
            :text="track.podcastName"
            :to="{
              name: ROUTE_NAMES.podcast,
              params: {
                [ROUTE_PARAM_KEYS.podcast.sortBy]:
                  ROUTE_PODCAST_SORT_BY_PARAMS.All,
                [ROUTE_PARAM_KEYS.podcast.id]: track.podcastId,
              },
            }"
          />
        </li>
        <li v-if="'artists' in track && track.artists.length" ref="artists">
          <span class="visuallyHidden">Track artists</span>

          <ArtistsList :artists="track.artists" />
        </li>
        <li v-if="'author' in track && track.author" ref="author">
          <span class="visuallyHidden">Podcast author</span>

          <span>{{ track.author }}</span>
        </li>
        <li>
          <span class="visuallyHidden">Duration</span>

          <span>
            <template
              v-if="'formattedPosition' in track && track.formattedPosition"
            >
              <time ref="formattedPosition">{{ track.formattedPosition }}</time>
              <span>/</span>
            </template>
            <time>{{ track.formattedDuration }}</time>
          </span>
        </li>
      </ul>
    </MarqueeScroll>
  </div>
</template>

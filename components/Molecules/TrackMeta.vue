<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';

defineProps<{
  track: QueueTrack;
}>();
</script>

<template>
  <div class="noTouchEvents">
    <MarqueeScroll class="mBXS" inert>
      <h4>
        {{ track.name }}
      </h4>
    </MarqueeScroll>

    <MarqueeScroll class="smallFont mobileOnly mBXS">
      <ul class="bulletList">
        <li v-if="'album' in track && track.album" ref="album">
          <span class="visuallyHidden">Track album</span>

          <LinkOrText
            :is-link="!!track.albumId"
            :text="track.album"
            :to="`/album/${track.albumId}`"
          />
        </li>
        <li
          v-if="'podcastName' in track && track.podcastName"
          ref="podcastName"
        >
          <span class="visuallyHidden">Podcast name</span>

          <LinkOrText
            :is-link="!!track.podcastId"
            :text="track.podcastName"
            :to="`/podcast/all/${track.podcastId}`"
          />
        </li>
        <li v-if="'artists' in track && track.artists.length" ref="artists">
          <span class="visuallyHidden">Track artists</span>

          <ArtistsList :artists="track.artists" />
        </li>
        <li v-if="track.duration" ref="duration">
          <span class="visuallyHidden">Duration</span>

          <time>{{ track.duration }}</time>
        </li>
      </ul>
    </MarqueeScroll>
  </div>
</template>

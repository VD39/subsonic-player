<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import TrackMeta from '@/components/Molecules/TrackMeta.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

defineProps<{
  tracks: QueueTrack[];
}>();

defineEmits(['addToPlaylist', 'playTrack', 'removeFromQueue']);
</script>

<template>
  <template v-if="tracks.length">
    <h4>Tracks: {{ tracks.length }}</h4>

    <div ref="tracksWrapper" class="trackTable">
      <div class="trackHeader">
        <div class="trackCell">Track</div>
        <div class="trackCell trackSecondary">Album/Podcast</div>
        <div class="trackCell trackSecondary">Artists/Author</div>
        <div class="trackCell trackTime">Time</div>
        <div class="trackCell trackOptions" />
      </div>

      <div
        v-for="(track, index) in tracks"
        :key="track.id"
        class="trackRow"
        data-test-id="track"
      >
        <div class="trackCell">
          <div>
            <TrackPlayPause
              :track-id="track.id"
              :image="track.image"
              :track-number="DEFAULT_VALUE"
              @play-track="$emit('playTrack', index)"
            />

            <TrackMeta :track="track" class="trackMeta" />

            <FavouriteButton
              v-if="'favourite' in track"
              :id="track.id"
              :type="track.type"
              :favourite="track.favourite"
            />
          </div>
        </div>

        <div class="trackCell trackSecondary">
          <MarqueeScroll
            v-if="'album' in track && track.album"
            ref="albumMarqueeScroll"
          >
            <LinkOrText
              :is-link="!!track.albumId"
              :text="track.album"
              :to="`/album/${track.albumId}`"
            />
          </MarqueeScroll>

          <LinkOrText
            v-else-if="'podcastName' in track && track.podcastName"
            ref="podcastNameLinkOrText"
            :is-link="!!track.podcastId"
            :text="track.podcastName"
            :to="`/podcast/all/${track.podcastId}`"
          />

          <p v-else ref="albumElse">{{ DEFAULT_VALUE }}</p>
        </div>

        <div class="trackCell trackSecondary">
          <MarqueeScroll
            v-if="'artists' in track && track.artists.length"
            ref="artistsMarqueeScroll"
          >
            <ArtistsList :artists="track.artists" />
          </MarqueeScroll>

          <MarqueeScroll
            v-else-if="'author' in track && track.author"
            ref="authorMarqueeScroll"
          >
            <p>{{ track.author }}</p>
          </MarqueeScroll>

          <p v-else ref="artistsElse">{{ DEFAULT_VALUE }}</p>
        </div>

        <time class="trackCell trackTime">
          {{ track.duration }}
        </time>

        <div class="trackCell trackOptions">
          <ButtonLink
            ref="removeFromQueue"
            icon="PhX"
            title="Remove item from queue"
            icon-weight="bold"
            icon-size="small"
            @click="$emit('removeFromQueue', track.id)"
          >
            Remove item from queue
          </ButtonLink>
        </div>
      </div>
    </div>
  </template>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.track"
    message="No tracks found."
  />
</template>

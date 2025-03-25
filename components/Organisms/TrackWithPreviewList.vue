<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import TrackMeta from '@/components/Molecules/TrackMeta.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

const props = defineProps<{
  inPlaylist?: boolean;
  inQueue?: boolean;
  tracks: (PodcastEpisode | QueueTrack | Track)[];
}>();

defineEmits<{
  addToPlaylist: [value: string];
  addToQueue: [value: PodcastEpisode | QueueTrack | Track];
  downloadMedia: [value: string];
  mediaInformation: [value: PodcastEpisode | QueueTrack | Track];
  playTrack: [value: number];
  removeFromPlaylist: [value: number];
  removeFromQueue: [value: string];
}>();

const TRACK_HEADER = {
  mix: ['Track', 'Album/Podcast', 'Artists/Author', 'Duration'],
  track: ['Track', 'Album', 'Artists', 'Duration'],
};

const trackHeader = computed(() => {
  if (props.inPlaylist || props.inQueue) {
    return TRACK_HEADER.mix;
  }

  return TRACK_HEADER.track;
});
</script>

<template>
  <div v-if="tracks.length" ref="tracksWrapper" class="trackTable withPreview">
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeader[0] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeader[1] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeader[2] }}</div>
      <div class="trackCell trackTime">{{ trackHeader[3] }}</div>
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
            :image="track.image"
            :track-id="track.id"
            :track-number="track.trackNumber"
            @play-track="$emit('playTrack', index)"
          />

          <TrackMeta class="trackMeta" :track="track" />

          <FavouriteButton
            v-if="'favourite' in track"
            :id="track.id"
            :favourite="track.favourite"
            :type="track.type"
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

        <MarqueeScroll
          v-else-if="'podcastName' in track && track.podcastName"
          ref="podcastNameMarqueeScroll"
        >
          <LinkOrText
            ref=""
            :is-link="!!track.podcastId"
            :text="track.podcastName"
            :to="`/podcast/all/${track.podcastId}`"
          />
        </MarqueeScroll>

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

      <div class="trackCell trackTime">
        <time>{{ track.duration }}</time>
      </div>

      <div class="trackCell trackOptions">
        <ButtonLink
          v-if="inQueue"
          ref="removeFromQueue"
          icon="PhX"
          icon-size="small"
          icon-weight="bold"
          title="Remove item from queue"
          @click="$emit('removeFromQueue', track.id)"
        >
          Remove item from queue
        </ButtonLink>

        <DropdownMenu v-else>
          <DropdownItem
            v-if="inPlaylist"
            ref="removeFromPlaylist"
            @click="$emit('removeFromPlaylist', index)"
          >
            Remove from Playlist
          </DropdownItem>
          <DropdownItem
            v-else
            ref="addToPlaylist"
            @click="$emit('addToPlaylist', track.id)"
          >
            Add to playlist
          </DropdownItem>
          <DropdownItem
            ref="mediaInformation"
            @click="$emit('mediaInformation', track)"
          >
            Media information
          </DropdownItem>
          <DropdownItem
            ref="downloadMedia"
            @click="$emit('downloadMedia', track.id)"
          >
            Download track
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem ref="addToQueue" @click="$emit('addToQueue', track)">
            Add to queue
          </DropdownItem>
          <DropdownItem ref="playTrack" @click="$emit('playTrack', index)">
            Play Track
          </DropdownItem>
        </DropdownMenu>
      </div>
    </div>
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.track"
    message="No tracks found."
  />
</template>

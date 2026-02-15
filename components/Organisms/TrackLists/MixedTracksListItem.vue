<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import LazyLoadContent from '@/components/Atoms/LazyLoadContent.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import TrackMeta from '@/components/Molecules/TrackMeta.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

const props = defineProps<{
  hasAddToQueueEvent?: boolean;
  hasDragStartEvent?: boolean;
  hideRemoveOption?: boolean;
  index: number;
  track: MixedTrack;
}>();

const emit = defineEmits<{
  addToPlaylist: [];
  addToQueue: [];
  downloadMedia: [];
  dragStart: [event: DragEvent];
  mediaInformation: [];
  playTrack: [];
  remove: [];
}>();

const { isCurrentTrack } = useAudioPlayer();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

function onClick() {
  if (isCurrentTrack(props.track.id)) {
    return;
  }

  emit('playTrack');
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
}
</script>

<template>
  <LazyLoadContent class="trackRow">
    <InteractionWrapper
      :draggable="hasDragStartEvent"
      @click="onClick"
      @contextMenu="openDropdownMenu"
      @dragStart="$emit('dragStart', $event)"
      @longPress="openDropdownMenu"
    >
      <div class="trackCell">
        <div>
          <TrackPlayPause
            :image="track.image"
            :trackId="track.id"
            :trackNumber="track.trackNumber"
            @playTrack="$emit('playTrack')"
          />

          <TrackMeta class="trackMeta" :track />

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
            :isLink="!!track.albumId"
            :text="track.album"
            :to="{
              name: ROUTE_NAMES.album,
              params: {
                [ROUTE_PARAM_KEYS.album.id]: track.albumId,
              },
            }"
          />
        </MarqueeScroll>

        <MarqueeScroll
          v-else-if="'podcastName' in track && track.podcastName"
          ref="podcastNameMarqueeScroll"
        >
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

      <time class="trackCell trackTime">
        {{ track.formattedDuration }}
      </time>

      <div class="trackCell trackOptions">
        <DropdownMenu ref="dropdownMenuRef">
          <DropdownItem ref="playTrack" @click="$emit('playTrack')">
            Play Track
          </DropdownItem>
          <DropdownItem
            v-if="hasAddToQueueEvent"
            ref="addToQueue"
            @click="$emit('addToQueue')"
          >
            Add to queue
          </DropdownItem>
          <DropdownItem
            v-if="track.type !== MEDIA_TYPE.radioStation"
            ref="addToPlaylist"
            @click="$emit('addToPlaylist')"
          >
            Add to playlist
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            is="nuxt-link"
            v-if="'albumId' in track && track.albumId"
            ref="goToAlbum"
            :to="{
              name: ROUTE_NAMES.album,
              params: {
                [ROUTE_PARAM_KEYS.album.id]: track.albumId,
              },
            }"
          >
            Go to album
          </DropdownItem>
          <DropdownItem
            is="nuxt-link"
            v-if="'podcastId' in track && track.podcastId"
            ref="goToPodcast"
            :to="{
              name: ROUTE_NAMES.podcast,
              params: {
                [ROUTE_PARAM_KEYS.podcast.sortBy]:
                  ROUTE_PODCAST_SORT_BY_PARAMS.All,
                [ROUTE_PARAM_KEYS.podcast.id]: track.podcastId,
              },
            }"
          >
            Go to podcast
          </DropdownItem>
          <DropdownItem
            is="a"
            v-if="'homePageUrl' in track && track.homePageUrl"
            ref="visitStation"
            :href="track.homePageUrl"
            target="_blank"
          >
            Visit station
          </DropdownItem>
          <template v-if="track.type !== MEDIA_TYPE.radioStation">
            <DropdownDivider />
            <DropdownItem
              ref="mediaInformation"
              @click="$emit('mediaInformation')"
            >
              Media information
            </DropdownItem>
            <DropdownItem ref="downloadMedia" @click="$emit('downloadMedia')">
              Download track
            </DropdownItem>
          </template>
          <DropdownDivider />
          <DropdownItem is="span" v-if="'favourite' in track">
            <FavouriteButton
              :id="track.id"
              class="globalLink"
              :favourite="track.favourite"
              showText
              :type="track.type"
            />
          </DropdownItem>
          <template v-if="!hideRemoveOption">
            <DropdownDivider />
            <DropdownItem ref="dropdownItemRemove" @click="$emit('remove')">
              Remove track
            </DropdownItem>
          </template>
        </DropdownMenu>
      </div>

      <div
        v-if="!hideRemoveOption"
        ref="trackRemoveRow"
        class="trackCell trackOptions"
      >
        <ButtonLink
          ref="removeButton"
          icon="PhX"
          iconSize="small"
          iconWeight="bold"
          title="Remove track"
          @click="$emit('remove')"
        >
          Remove track
        </ButtonLink>
      </div>
    </InteractionWrapper>
  </LazyLoadContent>
</template>

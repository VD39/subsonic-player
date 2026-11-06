<script setup lang="ts">
import ArtistLinkList from '@/components/artist/ArtistLinkList.vue';
import DropdownDivider from '@/components/dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import DropdownSubmenu from '@/components/dropdown/DropdownSubmenu.vue';
import FavouriteButton from '@/components/favourite/FavouriteButton.vue';
import TrackPlayPause from '@/components/player/controls/TrackPlayPause.vue';
import TrackPlayPauseDropdownItem from '@/components/player/controls/TrackPlayPauseDropdownItem.vue';
import TrackMeta from '@/components/track-details/TrackMeta.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import InteractionWrapper from '@/components/ui/InteractionWrapper.vue';
import LazyLoadContent from '@/components/ui/LazyLoadContent.vue';
import LinkOrText from '@/components/ui/LinkOrText.vue';
import MarqueeScroll from '@/components/ui/MarqueeScroll.vue';

const props = defineProps<{
  track: Track;
}>();

const emit = defineEmits<{
  addToPlaylist: [];
  addToQueue: [];
  downloadMedia: [];
  dragStart: [event: DragEvent];
  mediaInformation: [];
  playTrack: [];
}>();

const { isCurrentTrack } = useQueue();

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
  <LazyLoadContent class="trackRow trackPlayPauseHover">
    <InteractionWrapper
      @click="onClick"
      @contextMenu="openDropdownMenu"
      @dragStart="$emit('dragStart', $event)"
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
            :id="track.id"
            class="desktopOnly"
            :favourite="track.favourite"
            :type="track.type"
          />
        </div>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll v-if="track.album" ref="albumMarqueeScroll">
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

        <p v-else ref="albumElse">{{ EMPTY_DISPLAY_VALUE }}</p>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll v-if="track.artists.length" ref="artistsMarqueeScroll">
          <ArtistLinkList :artists="track.artists" />
        </MarqueeScroll>

        <p v-else ref="artistsElse">{{ EMPTY_DISPLAY_VALUE }}</p>
      </div>

      <div class="trackCell trackTime">
        <time>{{ track.formattedDuration }}</time>
      </div>

      <div class="trackCell trackOptions">
        <ButtonLink
          ref="addToQueueButton"
          :icon="ICONS.add"
          title="Add to queue"
          @click="$emit('addToQueue')"
        >
          Add to queue
        </ButtonLink>
      </div>

      <div class="trackCell trackOptions">
        <DropdownMenu ref="dropdownMenuRef">
          <TrackPlayPauseDropdownItem
            :trackId="track.id"
            :type="track.type"
            @playTrack="$emit('playTrack')"
          />
          <DropdownItem ref="addToQueue" @click="$emit('addToQueue')">
            Add to queue
          </DropdownItem>
          <DropdownItem ref="addToPlaylist" @click="$emit('addToPlaylist')">
            Add to playlist
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            is="nuxt-link"
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
          <DropdownSubmenu v-if="track.artists.length" text="Artists">
            <DropdownItem
              is="nuxt-link"
              v-for="artist in track.artists"
              :key="artist.id"
              :to="{
                name: ROUTE_NAMES.artist,
                params: {
                  [ROUTE_PARAM_KEYS.artist.id]: artist.id,
                },
              }"
            >
              {{ artist.name }}
            </DropdownItem>
          </DropdownSubmenu>
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
          <DropdownDivider />
          <DropdownItem is="span">
            <FavouriteButton
              :id="track.id"
              class="globalLink"
              :favourite="track.favourite"
              showText
              :type="track.type"
            />
          </DropdownItem>
        </DropdownMenu>
      </div>
    </InteractionWrapper>
  </LazyLoadContent>
</template>

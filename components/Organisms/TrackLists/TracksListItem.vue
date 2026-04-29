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
import DropdownSubmenu from '@/components/Molecules/Dropdown/DropdownSubmenu.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import TrackMeta from '@/components/Molecules/TrackMeta.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import TrackPlayPauseDropdownItem from '@/components/Organisms/TrackPlayPauseDropdownItem.vue';

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

        <p v-else ref="albumElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll v-if="track.artists.length" ref="artistsMarqueeScroll">
          <ArtistsList :artists="track.artists" />
        </MarqueeScroll>

        <p v-else ref="artistsElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <div class="trackCell trackTime">
        <time>{{ track.formattedDuration }}</time>
      </div>

      <div class="trackCell trackOptions">
        <ButtonLink
          ref="addToQueueButton"
          :icon="ICONS.add"
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

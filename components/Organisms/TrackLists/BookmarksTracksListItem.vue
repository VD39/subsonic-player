<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import LazyLoadContent from '@/components/Atoms/LazyLoadContent.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackMeta from '@/components/Molecules/TrackMeta.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

const props = defineProps<{
  bookmark: Bookmark;
}>();

const emit = defineEmits<{
  addToPlaylist: [];
  downloadMedia: [];
  mediaInformation: [];
  playTrack: [];
  remove: [];
}>();

const { isCurrentTrack } = useAudioPlayer();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

function onClick() {
  if (isCurrentTrack(props.bookmark.id)) {
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
    >
      <div class="trackCell">
        <div>
          <TrackPlayPause
            :image="bookmark.image"
            :trackId="bookmark.id"
            :trackNumber="bookmark.trackNumber"
            @playTrack="$emit('playTrack')"
          />

          <TrackMeta class="trackMeta" :track="bookmark" />
        </div>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll
          v-if="bookmark.podcastName"
          ref="podcastNameMarqueeScroll"
        >
          <LinkOrText
            :isLink="!!bookmark.podcastId"
            :text="bookmark.podcastName"
            :to="{
              name: ROUTE_NAMES.podcast,
              params: {
                [ROUTE_PARAM_KEYS.podcast.sortBy]:
                  ROUTE_PODCAST_SORT_BY_PARAMS.All,
                [ROUTE_PARAM_KEYS.podcast.id]: bookmark.podcastId,
              },
            }"
          />
        </MarqueeScroll>

        <p v-else ref="podcastNameElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll v-if="bookmark.author" ref="authorMarqueeScroll">
          <p>{{ bookmark.author }}</p>
        </MarqueeScroll>

        <p v-else ref="authorsElse">{{ DEFAULT_VALUE }}</p>
      </div>

      <div class="trackCell trackTime withPosition">
        <span>
          <time>{{ bookmark.formattedPosition }}</time>
          <span>/</span>
          <time>{{ bookmark.formattedDuration }}</time>
        </span>
      </div>

      <div class="trackCell trackOptions">
        <DropdownMenu ref="dropdownMenuRef">
          <DropdownItem ref="playTrack" @click="$emit('playTrack')">
            Play Track
          </DropdownItem>
          <DropdownItem ref="addToPlaylist" @click="$emit('addToPlaylist')">
            Add to playlist
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            is="nuxt-link"
            v-if="bookmark.podcastId"
            ref="goToPodcast"
            :to="{
              name: ROUTE_NAMES.podcast,
              params: {
                [ROUTE_PARAM_KEYS.podcast.sortBy]:
                  ROUTE_PODCAST_SORT_BY_PARAMS.All,
                [ROUTE_PARAM_KEYS.podcast.id]: bookmark.podcastId,
              },
            }"
          >
            Go to podcast
          </DropdownItem>
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
          <DropdownItem ref="dropdownItemRemove" @click="$emit('remove')">
            Remove track
          </DropdownItem>
        </DropdownMenu>
      </div>

      <div class="trackCell trackOptions">
        <ButtonLink
          ref="removeButton"
          icon="PhX"
          iconSize="small"
          iconWeight="bold"
          title="Remove track from bookmarks"
          @click="$emit('remove')"
        >
          Remove track from bookmarks
        </ButtonLink>
      </div>
    </InteractionWrapper>
  </LazyLoadContent>
</template>

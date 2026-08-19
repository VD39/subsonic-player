<script setup lang="ts">
import DropdownDivider from '@/components/dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/player/controls/TrackPlayPause.vue';
import TrackPlayPauseDropdownItem from '@/components/player/controls/TrackPlayPauseDropdownItem.vue';
import TrackMeta from '@/components/track-details/TrackMeta.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import InteractionWrapper from '@/components/ui/InteractionWrapper.vue';
import LazyLoadContent from '@/components/ui/LazyLoadContent.vue';
import LinkOrText from '@/components/ui/LinkOrText.vue';
import MarqueeScroll from '@/components/ui/MarqueeScroll.vue';

const props = defineProps<{
  bookmark: Bookmark;
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

const { isCurrentTrack } = useQueue();

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
  <LazyLoadContent class="trackRow trackPlayPauseHover">
    <InteractionWrapper
      @click="onClick"
      @contextMenu="openDropdownMenu"
      @dragStart="$emit('dragStart', $event)"
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
                  ROUTE_PODCAST_FILTER_PARAMS.All,
                [ROUTE_PARAM_KEYS.podcast.id]: bookmark.podcastId,
              },
            }"
          />
        </MarqueeScroll>

        <p v-else ref="podcastNameElse">{{ EMPTY_DISPLAY_VALUE }}</p>
      </div>

      <div class="trackCell trackSecondary">
        <MarqueeScroll v-if="bookmark.author" ref="authorMarqueeScroll">
          <p>{{ bookmark.author }}</p>
        </MarqueeScroll>

        <p v-else ref="authorsElse">{{ EMPTY_DISPLAY_VALUE }}</p>
      </div>

      <div class="trackCell trackTime withPosition">
        <span>
          <time>{{ bookmark.formattedPosition }}</time>
          <span>/</span>
          <time>{{ bookmark.formattedDuration }}</time>
        </span>
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
            :trackId="bookmark.id"
            :type="bookmark.type"
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
            v-if="bookmark.podcastId"
            ref="goToPodcast"
            :to="{
              name: ROUTE_NAMES.podcast,
              params: {
                [ROUTE_PARAM_KEYS.podcast.sortBy]:
                  ROUTE_PODCAST_FILTER_PARAMS.All,
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
          :icon="ICONS.close"
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

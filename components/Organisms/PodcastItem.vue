<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';

const props = defineProps<{
  podcast: Podcast;
}>();

const emit = defineEmits<{
  addPodcastToQueue: [podcast: Podcast];
  dragStart: [podcast: Podcast, event: DragEvent];
  mediaInformation: [podcast: Podcast];
  playPodcast: [podcast: Podcast];
}>();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

const podcastProps = computed(() => ({
  title: `Go to podcast ${props.podcast.name}`,
  toLink: {
    name: ROUTE_NAMES.podcast,
    params: {
      [ROUTE_PARAM_KEYS.podcast.id]: props.podcast.id,
      [ROUTE_PARAM_KEYS.podcast.sortBy]: ROUTE_PODCAST_SORT_BY_PARAMS.All,
    },
  },
}));

const buttonProps = computed(() => ({
  icon: ICONS.play,
  text: `Play podcast ${props.podcast.name}`,
}));

async function goToPodcast() {
  await navigateTo(podcastProps.value.toLink);
}

function onDragStart(event: DragEvent) {
  emit('dragStart', props.podcast, event);
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
}
</script>

<template>
  <InteractionWrapper
    is="article"
    :class="['layoutItem', $style.podcastItem]"
    @click="goToPodcast"
    @contextMenu="openDropdownMenu"
    @dragStart="onDragStart"
  >
    <div :class="['layoutImage', $style.podcastImageWrapper]">
      <ImageLink
        :image="podcast.image"
        :title="podcastProps.title"
        :to="podcastProps.toLink"
      />

      <div :class="['hideOnListLayout', $style.actions, $style.hoverActions]">
        <ButtonLink
          ref="playPodcastButtonLink"
          class="themeHoverButton"
          :icon="buttonProps.icon"
          :title="buttonProps.text"
          @click="$emit('playPodcast', podcast)"
        >
          {{ buttonProps.text }}
        </ButtonLink>
      </div>
    </div>

    <div class="layoutContent">
      <p class="mBXS strong smallFont clamp2">
        <NuxtLink
          :aria-label="podcastProps.title"
          class="layoutLink"
          draggable="false"
          :to="podcastProps.toLink"
        >
          {{ podcast.name }}
        </NuxtLink>
      </p>
    </div>

    <div :class="['layoutDropdownMenu', $style.hoverActions]">
      <DropdownMenu ref="dropdownMenuRef">
        <DropdownItem ref="playPodcast" @click="$emit('playPodcast', podcast)">
          Play podcast
        </DropdownItem>
        <DropdownItem
          ref="addPodcastToQueue"
          @click="$emit('addPodcastToQueue', podcast)"
        >
          Add to queue
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem is="nuxt-link" :to="podcastProps.toLink">
          Go to podcast
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          ref="mediaInformation"
          @click="$emit('mediaInformation', podcast)"
        >
          Media information
        </DropdownItem>
      </DropdownMenu>
    </div>
  </InteractionWrapper>
</template>

<style module>
.podcastItem {
  position: relative;

  @media (hover: hover) {
    &:hover,
    &:focus,
    &:focus-within {
      .hoverActions {
        --podcast-hover-actions-opacity: 1;
        --podcast-hover-actions-z-index: 10;
      }
    }
  }
}

.podcastImageWrapper {
  position: relative;
}

.actions {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  justify-content: space-between;
  width: var(--width-height-100);
  padding: var(--default-space);
  transition: opacity var(--transition);
}

.hoverActions {
  --podcast-hover-actions-opacity: 0;
  --podcast-hover-actions-z-index: -2;

  z-index: var(--podcast-hover-actions-z-index);
  opacity: var(--podcast-hover-actions-opacity);
}
</style>

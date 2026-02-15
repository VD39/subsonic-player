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

const isDropdownOpened = ref(false);

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

function onClosedDropdown() {
  isDropdownOpened.value = false;
}

function onDragStart(event: DragEvent) {
  emit('dragStart', props.podcast, event);
}

function onOpenedDropdown() {
  isDropdownOpened.value = true;
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
  onOpenedDropdown();
}
</script>

<template>
  <InteractionWrapper
    is="article"
    class="layoutItem"
    @contextMenu="openDropdownMenu"
    @dragStart="onDragStart"
    @longPress="openDropdownMenu"
  >
    <div
      :class="[
        'layoutImage',
        $style.podcastImageWrapper,
        {
          [$style.dropdownOpened]: isDropdownOpened,
        },
      ]"
    >
      <ImageLink
        :image="podcast.image"
        :title="podcastProps.title"
        :to="podcastProps.toLink"
      />

      <div :class="['hideOnListLayout', $style.actions]">
        <ButtonLink
          ref="playPodcastButtonLink"
          class="themeHoverButton"
          :icon="buttonProps.icon"
          :title="buttonProps.text"
          @click="$emit('playPodcast', podcast)"
        >
          {{ buttonProps.text }}
        </ButtonLink>

        <div :class="$style.actionsRight">
          <DropdownMenu
            ref="dropdownMenuRef"
            @closed="onClosedDropdown"
            @opened="onOpenedDropdown"
          >
            <DropdownItem
              ref="playPodcast"
              @click="$emit('playPodcast', podcast)"
            >
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
      </div>
    </div>

    <div class="layoutContent">
      <p class="strong smallFont clamp2">
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
  </InteractionWrapper>
</template>

<style module>
.podcastImageWrapper {
  position: relative;

  @media (hover: hover) {
    &:hover,
    &:focus,
    &:focus-within {
      .actions {
        --podcast-actions-opacity: 1;
        --podcast-actions-z-index: 10;
      }
    }
  }
}

.actions {
  --podcast-actions-opacity: 0;
  --podcast-actions-z-index: -2;

  position: absolute;
  inset: auto var(--default-space) var(--default-space);
  z-index: var(--podcast-actions-z-index);
  display: flex;
  gap: var(--default-space);
  width: var(--width-height-100);
  opacity: var(--podcast-actions-opacity);
  transition: opacity var(--transition);

  .dropdownOpened & {
    --podcast-actions-opacity: 1;
    --podcast-actions-z-index: 10;
  }
}

.actionsRight {
  display: flex;
  flex-direction: row;
  gap: var(--default-space);
  margin-left: auto;
}
</style>

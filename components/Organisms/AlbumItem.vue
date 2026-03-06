<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';

const props = defineProps<{
  album: Album;
  hideArtist?: boolean;
}>();

const emit = defineEmits<{
  addToQueue: [album: Album];
  dragStart: [album: Album, event: DragEvent];
  mediaInformation: [album: Album];
  playAlbum: [album: Album];
}>();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

const isDropdownOpened = ref(false);

const albumProps = computed(() => ({
  title: `Go to album ${props.album.name}`,
  toLink: {
    name: ROUTE_NAMES.album,
    params: {
      [ROUTE_PARAM_KEYS.album.id]: props.album.id,
    },
  },
}));

const buttonProps = computed(() => ({
  icon: ICONS.play,
  text: `Play album ${props.album.name}`,
}));

async function goToAlbum() {
  await navigateTo(albumProps.value.toLink);
}

function onClosedDropdown() {
  isDropdownOpened.value = false;
}

function onDragStart(event: DragEvent) {
  emit('dragStart', props.album, event);
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
    :class="[
      'layoutItem',
      $style.albumItem,
      {
        [$style.dropdownOpened]: isDropdownOpened,
      },
    ]"
    @click="goToAlbum"
    @contextMenu="openDropdownMenu"
    @dragStart="onDragStart"
  >
    <div :class="['layoutImage', $style.albumImageWrapper]">
      <ImageLink
        :image="album.image"
        :title="albumProps.title"
        :to="albumProps.toLink"
      />

      <div :class="['hideOnListLayout', $style.actions, $style.hoverActions]">
        <ButtonLink
          ref="playAlbumButtonLink"
          class="themeHoverButton"
          :icon="buttonProps.icon"
          :title="buttonProps.text"
          @click="$emit('playAlbum', album)"
        >
          {{ buttonProps.text }}
        </ButtonLink>

        <FavouriteButton
          :id="album.id"
          :favourite="album.favourite"
          :type="album.type"
        />
      </div>
    </div>

    <div class="layoutContent">
      <p class="mBXS strong smallFont clamp2">
        <NuxtLink
          :aria-label="albumProps.title"
          class="layoutLink"
          draggable="false"
          :to="albumProps.toLink"
        >
          {{ album.name }}
        </NuxtLink>
      </p>

      <ArtistsList
        v-if="!hideArtist && album.artists.length"
        :artists="album.artists"
        class="smallFont clamp2"
      />
    </div>

    <div :class="['layoutDropdownMenu', $style.hoverActions]">
      <DropdownMenu
        ref="dropdownMenuRef"
        @closed="onClosedDropdown"
        @opened="onOpenedDropdown"
      >
        <DropdownItem ref="playAlbum" @click="$emit('playAlbum', album)">
          Play album
        </DropdownItem>
        <DropdownItem ref="addToQueue" @click="$emit('addToQueue', album)">
          Add to queue
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem is="nuxt-link" :to="albumProps.toLink">
          Go to album
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          ref="mediaInformation"
          @click="$emit('mediaInformation', album)"
        >
          Media information
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem is="span">
          <FavouriteButton
            :id="album.id"
            class="globalLink"
            :favourite="album.favourite"
            showText
            :type="album.type"
          />
        </DropdownItem>
      </DropdownMenu>
    </div>
  </InteractionWrapper>
</template>

<style module>
.albumItem {
  position: relative;

  @media (hover: hover) {
    &:hover,
    &:focus,
    &:focus-within {
      .hoverActions {
        --album-hover-actions-opacity: 1;
        --album-hover-actions-z-index: 10;
      }
    }
  }
}

.albumImageWrapper {
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
  --album-hover-actions-opacity: 0;
  --album-hover-actions-z-index: -2;

  z-index: var(--album-hover-actions-z-index);
  opacity: var(--album-hover-actions-opacity);

  .dropdownOpened & {
    --album-hover-actions-opacity: 1;
    --album-hover-actions-z-index: 10;
  }
}
</style>

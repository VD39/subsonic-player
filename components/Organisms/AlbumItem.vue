<script setup lang="ts">
import ArtistLinks from '@/components/Atoms/ArtistLinks.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import DropdownSubmenu from '@/components/Molecules/Dropdown/DropdownSubmenu.vue';
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

function onDragStart(event: DragEvent) {
  emit('dragStart', props.album, event);
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
}
</script>

<template>
  <InteractionWrapper
    is="article"
    class="layoutItem"
    @click="goToAlbum"
    @contextMenu="openDropdownMenu"
    @dragStart="onDragStart"
  >
    <div class="layoutImage layoutItemImageWrapper">
      <ImageLink
        :image="album.image"
        :title="albumProps.title"
        :to="albumProps.toLink"
      />

      <div class="hideOnListLayout layoutItemActions layoutItemHoverActions">
        <div class="centerItems actionsLeft">
          <ButtonLink
            ref="playAlbumButtonLink"
            class="themeHoverButton"
            :icon="buttonProps.icon"
            :title="buttonProps.text"
            @click="$emit('playAlbum', album)"
          >
            {{ buttonProps.text }}
          </ButtonLink>

          <ButtonLink
            ref="addToQueueButtonLink"
            :icon="ICONS.add"
            title="Add album to queue"
            @click="$emit('addToQueue', album)"
          >
            Add album to queue
          </ButtonLink>
        </div>

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

      <ArtistLinks
        v-if="!hideArtist && album.artists.length"
        :artists="album.artists"
        class="smallFont clamp2"
      />
    </div>

    <div class="layoutDropdownMenu layoutItemHoverActions">
      <DropdownMenu ref="dropdownMenuRef">
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
        <DropdownSubmenu v-if="album.artists.length" text="Artist">
          <DropdownItem
            is="nuxt-link"
            v-for="artist in album.artists"
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

<style>
.actionsLeft {
  gap: var(--default-space);
}
</style>

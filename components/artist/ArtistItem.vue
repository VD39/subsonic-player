<script setup lang="ts">
import DropdownDivider from '@/components/dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import FavouriteButton from '@/components/favourite/FavouriteButton.vue';
import ImageLink from '@/components/media/ImageLink.vue';
import InteractionWrapper from '@/components/ui/InteractionWrapper.vue';

const props = defineProps<{
  artist: Artist;
}>();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

const artistProps = computed(() => ({
  title: `Go to artist ${props.artist.name}`,
  toLink: {
    name: ROUTE_NAMES.artist,
    params: {
      [ROUTE_PARAM_KEYS.artist.id]: props.artist.id,
    },
  },
}));

async function goToArtist() {
  await navigateTo(artistProps.value.toLink);
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
}
</script>

<template>
  <InteractionWrapper
    is="article"
    class="layoutItem"
    @click="goToArtist"
    @contextMenu="openDropdownMenu"
  >
    <div class="layoutImage layoutItemImageWrapper">
      <ImageLink
        :image="artist.image"
        :title="artistProps.title"
        :to="artistProps.toLink"
      />

      <div
        v-if="'favourite' in artist"
        class="hideOnListLayout layoutItemActions layoutItemActionsEnd layoutItemHoverActions"
      >
        <FavouriteButton
          :id="artist.id"
          :favourite="artist.favourite"
          :type="artist.type"
        />
      </div>
    </div>

    <div class="layoutContent">
      <p class="strong smallFont clamp2">
        <NuxtLink
          :aria-label="artistProps.title"
          class="layoutLink"
          draggable="false"
          :to="artistProps.toLink"
        >
          {{ artist.name }}
        </NuxtLink>
      </p>
    </div>

    <div
      v-if="'favourite' in artist"
      class="layoutDropdownMenu layoutItemHoverActions"
    >
      <DropdownMenu ref="dropdownMenuRef">
        <DropdownItem is="nuxt-link" :to="artistProps.toLink">
          Go to artist
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem is="span">
          <FavouriteButton
            :id="artist.id"
            class="globalLink"
            :favourite="artist.favourite"
            showText
            :type="artist.type"
          />
        </DropdownItem>
      </DropdownMenu>
    </div>
  </InteractionWrapper>
</template>

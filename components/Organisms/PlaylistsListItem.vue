<script setup lang="ts">
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';

const props = defineProps<{
  playlist: Playlist;
}>();

defineEmits<{
  deletePlaylist: [];
  editPlaylist: [];
}>();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

const playlistProps = computed(() => ({
  title: `Go to playlist ${props.playlist.name}`,
  toLink: {
    name: ROUTE_NAMES.playlist,
    params: {
      [ROUTE_PARAM_KEYS.playlist.id]: props.playlist.id,
    },
  },
}));

async function navigateToPlaylist() {
  await navigateTo(playlistProps.value.toLink);
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
}
</script>

<template>
  <InteractionWrapper
    is="article"
    :class="$style.playlistsListItem"
    @click="navigateToPlaylist"
    @contextMenu="openDropdownMenu"
  >
    <div :class="['centerItems', $style.playlistDetails]">
      <ImageLink
        :class="$style.imageLink"
        :image="ICONS.playlist"
        :title="playlistProps.title"
        :to="playlistProps.toLink"
      />

      <div class="spaceBetween">
        <div>
          <h4 class="mBS">
            <NuxtLink
              :aria-label="playlistProps.title"
              class="link"
              draggable="false"
              :to="playlistProps.toLink"
            >
              {{ playlist.name }}
            </NuxtLink>
          </h4>

          <ul class="bulletList smallFont">
            <li>{{ playlist.trackCount }} tracks</li>
            <li>
              <time>{{ playlist.formattedDuration }}</time>
            </li>
          </ul>
        </div>

        <DropdownMenu ref="dropdownMenuRef">
          <DropdownItem
            is="nuxt-link"
            ref="goToPlaylist"
            :to="playlistProps.toLink"
          >
            Go to playlist
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem ref="editPlaylist" @click="$emit('editPlaylist')">
            Edit playlist
          </DropdownItem>
          <DropdownItem ref="deletePlaylist" @click="$emit('deletePlaylist')">
            Delete playlist
          </DropdownItem>
        </DropdownMenu>
      </div>
    </div>
  </InteractionWrapper>
</template>

<style module>
.playlistsListItem {
  cursor: pointer;
}

.playlistDetails {
  position: relative;
  gap: var(--default-space);
  padding: var(--default-space);
  background-color: var(--track-background-color);
  box-shadow: var(--box-shadow-medium);
}

.imageLink {
  flex-shrink: 0;
  width: 75px;
}
</style>

<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import NavigationItem from './Items/NavigationItem.vue';
import SubNavigationItem from './Items/SubNavigationItem.vue';

defineProps<{
  collapsed: boolean;
  playlists: Playlist[];
}>();

defineEmits<{
  addPlaylist: [];
}>();

const { onDrop } = useDragAndDrop();

function isRandomPlaylist(playlistId: string) {
  return playlistId === RANDOM_PLAYLIST.id;
}
</script>

<template>
  <ul class="mBM">
    <NavigationItem :collapsed title="Playlist">
      <template v-if="playlists.length">
        <SubNavigationItem
          v-for="playlist in playlists.slice(0, PREVIEW_PLAYLIST_COUNT)"
          :key="playlist.id"
          :class="[
            {
              [DRAG_AND_DROP_CLASS_NAMES.isDroppable]: !isRandomPlaylist(
                playlist.id,
              ),
            },
          ]"
          :collapsed
          :icon="ICONS.playlist"
          :title="playlist.name"
          :to="{
            name: ROUTE_NAMES.playlist,
            params: {
              [ROUTE_PARAM_KEYS.playlist.id]: playlist.id,
            },
          }"
          @drop="onDrop(playlist.id, $event)"
        />
      </template>
    </NavigationItem>

    <li>
      <ButtonLink
        ref="addPlaylist"
        class="sidebarLink"
        fullWidth
        :icon="ICONS.playlistAdd"
        :showText="!collapsed"
        title="Add playlist"
        @click="$emit('addPlaylist')"
      >
        Add playlist
      </ButtonLink>
    </li>
  </ul>
</template>

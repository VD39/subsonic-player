<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import NavigationItem from './Items/NavigationItem.vue';
import SubNavigationItem from './Items/SubNavigationItem.vue';

defineProps<{
  collapsed: boolean;
}>();

const { addPlaylistModal, playlists } = usePlaylist();
</script>

<template>
  <ul class="mBM">
    <NavigationItem :collapsed="collapsed" title="Playlist">
      <template v-if="playlists.length">
        <SubNavigationItem
          v-for="playlist in playlists.slice(0, 5)"
          :key="playlist.id"
          :collapsed="collapsed"
          :icon="ICONS.playlist"
          :title="playlist.name"
          :to="`/playlist/${playlist.id}`"
        />
      </template>
    </NavigationItem>

    <li>
      <ButtonLink
        ref="addPlaylist"
        :icon="ICONS.playlistAdd"
        class="sidebarLink"
        :show-text="!collapsed"
        title="Add playlist"
        full-width
        @click="addPlaylistModal"
      >
        Add playlist
      </ButtonLink>
    </li>
  </ul>
</template>

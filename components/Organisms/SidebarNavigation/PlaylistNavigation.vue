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
        class="sidebarLink"
        full-width
        :icon="ICONS.playlistAdd"
        :show-text="!collapsed"
        title="Add playlist"
        @click="$emit('addPlaylist')"
      >
        Add playlist
      </ButtonLink>
    </li>
  </ul>
</template>

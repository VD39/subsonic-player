<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { collapsed } = useSidebar();
const { playlists, getPlaylists } = usePlaylist();

getPlaylists();
</script>

<template>
  <ul v-if="playlists.length" ref="playlistWrapper">
    <li v-for="playlist in playlists.slice(0, 5)" :key="playlist.id">
      <IconButton
        is="nuxt-link"
        :to="`/playlist/${playlist.id}`"
        icon="PhQueue"
        :class="$style.link"
        :exact-active-class="$style.current"
        :show-text="!collapsed"
        :title="`${playlist.name} Playlist`"
      >
        {{ playlist.name }}
      </IconButton>
    </li>
  </ul>
</template>

<style module>
.link {
  @mixin sidebar-link;
}

.current {
  @mixin sidebar-current-link;
}
</style>

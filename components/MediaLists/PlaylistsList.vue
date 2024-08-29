<script setup lang="ts">
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';
import MediaListWrapper from './MediaListWrapper.vue';
import DropdownMenu from '@/components/Dropdown/DropdownMenu.vue';
import DropdownItem from '@/components/Dropdown/DropdownItem.vue';

defineProps<{
  playlists: Playlist[];
  rows?: string;
}>();

defineEmits(['deletePlaylist', 'editPlaylist']);
</script>

<template>
  <MediaListWrapper v-if="playlists.length" :rows="rows">
    <article
      v-for="playlist in playlists"
      :key="playlist.id"
      :class="$style.playlist"
      data-test-id="playlist"
    >
      <ImageLink
        :to="`/playlist/${playlist.id}`"
        :title="`Go to playlist ${playlist.name}`"
        image="PhPlaylist"
        :class="$style.image"
      />

      <div :class="$style.playlistOptions">
        <div :class="$style.playlistDetails">
          <p>
            <NuxtLink
              :to="`/playlist/${playlist.id}`"
              :title="`Go to playlist ${playlist.name}`"
              class="itemLink"
            >
              {{ playlist.name }}
            </NuxtLink>
          </p>

          <ul class="bulletList">
            <li>{{ playlist.songCount }} tracks</li>
            <li>
              <time>{{ playlist.duration }}</time>
            </li>
          </ul>
        </div>

        <DropdownMenu data-test-id="dropdown-menu">
          <DropdownItem
            data-test-id="delete-playlist"
            @click="$emit('deletePlaylist', playlist)"
          >
            Delete playlist
          </DropdownItem>
          <DropdownItem
            data-test-id="edit-playlist"
            @click="$emit('editPlaylist', playlist)"
          >
            Edit playlist
          </DropdownItem>
        </DropdownMenu>
      </div>
    </article>
  </MediaListWrapper>
  <NoMediaMessage v-else icon="PhPlaylist" message="No playlists found." />
</template>

<style module>
.playlist,
.playlistOptions {
  @mixin align-center;

  gap: var(--space-12);
}

.playlist {
  position: relative;
  padding: var(--space-8);
  background-color: var(--track-background-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--box-shadow-medium);
}

.image {
  flex-shrink: 0;
  width: 90px;
}

.playlistOptions {
  justify-content: space-between;
  width: 100%;
}

.playlistDetails {
  margin-right: auto;
}
</style>

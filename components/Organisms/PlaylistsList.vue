<script setup lang="ts">
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';

defineProps<{
  playlists: Playlist[];
}>();

defineEmits(['deletePlaylist', 'editPlaylist']);
</script>

<template>
  <MediaListWrapper v-if="playlists.length" mobile="1" tablet="2" desktop="2">
    <article
      v-for="playlist in playlists"
      :key="playlist.id"
      :class="['centerItems', $style.playlist]"
      data-test-id="playlist"
    >
      <ImageLink
        :to="`/playlist/${playlist.id}`"
        :title="`Go to playlist ${playlist.name}`"
        :image="ICONS.playlist"
        :class="$style.imageLink"
      />

      <div class="spaceBetween">
        <div>
          <h4 class="mBS">
            <NuxtLink
              :to="`/playlist/${playlist.id}`"
              :aria-label="`Go to playlist ${playlist.name}`"
              class="link globalLink"
            >
              {{ playlist.name }}
            </NuxtLink>
          </h4>

          <ul class="bulletList smallFont">
            <li>{{ playlist.trackCount }} tracks</li>
            <li v-if="playlist.duration">
              <time>{{ playlist.duration }}</time>
            </li>
          </ul>
        </div>

        <DropdownMenu>
          <DropdownItem
            ref="editPlaylist"
            @click="$emit('editPlaylist', playlist)"
          >
            Edit playlist
          </DropdownItem>
          <DropdownItem
            ref="deletePlaylist"
            @click="$emit('deletePlaylist', playlist.id)"
          >
            Delete playlist
          </DropdownItem>
        </DropdownMenu>
      </div>
    </article>
  </MediaListWrapper>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.playlist"
    message="No playlists found."
  />
</template>

<style module>
.playlist {
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

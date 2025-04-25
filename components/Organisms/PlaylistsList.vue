<script setup lang="ts">
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';

defineProps<{
  playlists: Playlist[];
}>();

defineEmits<{
  deletePlaylist: [value: string];
  editPlaylist: [value: Playlist];
}>();
</script>

<template>
  <MediaListWrapper v-if="playlists.length" desktop="2" mobile="1" tablet="2">
    <article
      v-for="playlist in playlists"
      :key="playlist.id"
      :class="['centerItems', $style.playlist]"
      data-test-id="playlist"
    >
      <ImageLink
        :class="$style.imageLink"
        :image="ICONS.playlist"
        :title="`Go to playlist ${playlist.name}`"
        :to="{
          name: ROUTE_NAMES.playlist,
          params: {
            [ROUTE_PARAM_KEYS.playlist.id]: playlist.id,
          },
        }"
      />

      <div class="spaceBetween">
        <div>
          <h4 class="mBS">
            <NuxtLink
              :aria-label="`Go to playlist ${playlist.name}`"
              class="link globalLink"
              :to="{
                name: ROUTE_NAMES.playlist,
                params: {
                  [ROUTE_PARAM_KEYS.playlist.id]: playlist.id,
                },
              }"
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

<script setup lang="ts">
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import DropdownTitle from '@/components/Molecules/Dropdown/DropdownTitle.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';

const { getAvatar, user } = useUser();
const { logoutAndRedirect } = useAuth();
const { startScan } = useMediaLibrary();
const { openAboutAppModal } = useServerInfo();

const userAvatar = ref<Icon | string>(IMAGE_DEFAULT_BY_TYPE.user);

watchEffect(async () => {
  userAvatar.value = await getAvatar(user.value!.username!);
});
</script>

<template>
  <DropdownMenu title="View details">
    <template #icon>
      <PreloadImage
        :class="$style.avatar"
        :image="userAvatar"
        :lazyLoad="false"
      />
    </template>

    <DropdownTitle>
      {{ user!.username }}
    </DropdownTitle>
    <DropdownItem
      is="nuxt-link"
      :to="{
        name: ROUTE_NAMES.files,
      }"
    >
      Files
    </DropdownItem>
    <DropdownItem is="a" :href="user!.server" target="_blank">
      Server
    </DropdownItem>
    <DropdownItem ref="scanDropdownItem" @click="startScan">
      Scan files
    </DropdownItem>
    <DropdownItem ref="aboutDropdownItem" @click="openAboutAppModal">
      About
    </DropdownItem>
    <DropdownDivider />
    <DropdownItem
      ref="logoutDropdownItem"
      :icon="ICONS.logOut"
      @click="logoutAndRedirect"
    >
      Log out
    </DropdownItem>
  </DropdownMenu>
</template>

<style module>
.avatar {
  width: var(--space-40);
  height: var(--space-40);
  border-radius: var(--border-radius-round);
}
</style>

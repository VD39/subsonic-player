<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const props = defineProps<{
  favourite: boolean;
  id: string;
  type: MediaType;
}>();

const { updateQueueTrackFavourite } = useAudioPlayer();
const { addFavourite, addToFavouriteIds, favouriteIds, removeFavourite } =
  useFavourite();

const isFavourite = computed(() => favouriteIds.value[props.id]);

const buttonProps = computed<ButtonProps>(() => ({
  iconColor: isFavourite.value ? 'var(--error-color)' : undefined,
  iconWeight: isFavourite.value ? 'fill' : 'regular',
  text: `${isFavourite.value ? 'Unlike' : 'Like'} ${props.type}`,
}));

async function toggleFavourite() {
  if (isFavourite.value) {
    await removeFavourite(props);
  } else {
    await addFavourite(props);
  }

  updateQueueTrackFavourite(props.id, isFavourite.value);
}

const unwatch = watch(
  () => props.favourite,
  () => {
    if (props.id in favouriteIds.value) {
      setTimeout(() => unwatch());
      return;
    }

    if (props.favourite) {
      addToFavouriteIds(props.id);
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <ButtonLink
    :icon="ICONS.favourite"
    :icon-color="buttonProps.iconColor"
    :icon-weight="buttonProps.iconWeight"
    :title="buttonProps.text"
    @click="toggleFavourite"
  >
    {{ buttonProps.text }}
  </ButtonLink>
</template>

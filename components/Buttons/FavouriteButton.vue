<script setup lang="ts">
import IconButton from './IconButton.vue';

const props = defineProps<{
  favourite: boolean;
  id: string;
  type: MediaType;
}>();

const { addFavourite, removeFavourite } = useFavourite();

const isFavourite = ref(props.favourite);

const buttonProps = computed<FavouriteButtonProps>(() => {
  const message = isFavourite.value ? 'Unlike' : 'Like';

  return {
    iconColor: isFavourite.value ? 'var(--error-color)' : undefined,
    iconWeight: isFavourite.value ? 'fill' : 'duotone',
    text: `${message} ${props.type}`,
  };
});

async function toggleFavourite() {
  const action = isFavourite.value ? removeFavourite : addFavourite;

  await action(props);

  isFavourite.value = !isFavourite.value;
}
</script>

<template>
  <IconButton
    icon="PhHeart"
    :icon-color="buttonProps.iconColor"
    :icon-weight="buttonProps.iconWeight"
    :title="buttonProps.text"
    v-bind="$attrs"
    @click="toggleFavourite"
  >
    {{ buttonProps.text }}
  </IconButton>
</template>

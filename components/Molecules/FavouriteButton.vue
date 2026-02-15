<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const props = defineProps<{
  favourite: boolean;
  id: string;
  showText?: boolean;
  type: MediaType;
}>();

const { addToFavouriteIds, favouriteIds, toggleFavourite } = useFavourite();

const isFavourite = computed(() => !!favouriteIds.value[props.id]);

const buttonProps = computed<ButtonProps>(() => ({
  iconColor: isFavourite.value ? 'var(--error-color)' : undefined,
  iconWeight: isFavourite.value ? 'fill' : 'regular',
  text: `${isFavourite.value ? 'Unlike' : 'Like'} ${props.type}`,
}));

function onClick() {
  // No need to pass isFavourite.value value, use props directly.
  toggleFavourite(props, isFavourite.value);
}

watch(
  () => props.id || props.favourite,
  () => {
    // Check if id exists as a key, cannot check value as it could be false.
    if (props.id in favouriteIds.value) {
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
    :iconColor="buttonProps.iconColor"
    :iconWeight="buttonProps.iconWeight"
    iconPosition="right"
    :showText
    :title="buttonProps.text"
    @click="onClick"
  >
    {{ buttonProps.text }}
  </ButtonLink>
</template>

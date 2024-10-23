<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const props = defineProps<{
  favourite: boolean;
  id: string;
  type: MediaType;
}>();

const { addFavourite, removeFavourite } = useFavourite();

const isFavourite = ref(props.favourite);

const buttonProps = computed<ButtonProps>(() => ({
  iconColor: isFavourite.value ? 'var(--error-color)' : undefined,
  iconWeight: isFavourite.value ? 'fill' : 'duotone',
  text: `${isFavourite.value ? 'Unlike' : 'Like'} ${props.type}`,
}));

async function toggleFavourite() {
  if (isFavourite.value) {
    await removeFavourite(props);
  } else {
    await addFavourite(props);
  }

  isFavourite.value = !isFavourite.value;
}
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

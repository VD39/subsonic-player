<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    is?: LinkIs;
    isLink: boolean;
    text: string;
    to: ToProp;
  }>(),
  {
    is: 'nuxt-link',
  },
);

const isComponent =
  props.is === 'nuxt-link' ? resolveComponent('NuxtLink') : props.is;
const linkAttribute = props.is === 'nuxt-link' ? 'to' : 'href';
</script>

<template>
  <component
    :is="isComponent"
    v-if="isLink"
    :[linkAttribute]="to"
    class="link"
    data-test-id="link"
  >
    {{ text }}
  </component>

  <p v-else ref="noLink">{{ text }}</p>
</template>

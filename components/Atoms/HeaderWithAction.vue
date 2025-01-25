<template>
  <div class="centerItems spaceBetween">
    <slot />

    <div v-if="$slots.actions" ref="actions" class="centerItems">
      <slot name="actions" />
    </div>
  </div>
</template>

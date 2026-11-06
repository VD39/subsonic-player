<script setup lang="ts">
defineProps<{
  playing?: boolean;
}>();
</script>

<template>
  <span
    :class="[
      'centerAll',
      $style.playingLoader,
      {
        [$style.playing]: playing,
      },
    ]"
  >
    <span :class="['centerAll', $style.loading]">
      <span :class="$style.bar" />
      <span :class="$style.bar" />
      <span :class="$style.bar" />
      <span :class="$style.bar" />
    </span>

    <span class="visuallyHidden">
      <slot />
    </span>
  </span>
</template>

<style module>
.playingLoader {
  width: var(--width-height-100);
  height: 16px;
}

.loading {
  gap: 1px;
  align-items: end;
  height: var(--width-height-100);
}

.bar {
  --bar-background-color: var(--invert-color);

  width: 3px;
  height: 20%;
  background-color: var(--bar-background-color);

  .playing & {
    --bar-background-color: var(--theme-color);

    &:nth-child(1) {
      height: 20%;
      animation: scale 0.4s 0s linear infinite alternate;
    }

    &:nth-child(2) {
      height: 50%;
      animation: scale 0.5s 0s linear infinite alternate;
    }

    &:nth-child(3) {
      height: 30%;
      animation: scale 0.3s 0s linear infinite alternate;
    }

    &:nth-child(4) {
      height: 40%;
      animation: scale 0.4s 0s linear infinite alternate;
    }
  }
}

@keyframes scale {
  to {
    height: 100%;
  }
}
</style>

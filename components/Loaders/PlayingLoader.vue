<template>
  <span :class="$style.playingLoader">
    <span :class="$style.loading">
      <span :class="$style.bar" />
      <span :class="$style.bar" />
      <span :class="$style.bar" />
    </span>

    <span class="visually-hidden"><slot /></span>
  </span>
</template>

<style module>
.playingLoader {
  padding: var(--button-spacing);
}

.loading {
  @mixin align-center;

  gap: var(--space-2);
  align-items: flex-end;
  width: 20px;
  height: 20px;
}

.bar {
  width: 5px;
  background-color: var(--theme-color);
  opacity: 0.5;

  &:nth-child(1) {
    height: 20%;
    animation: scale 0.3s 0s linear infinite alternate;
  }

  &:nth-child(2) {
    height: 50%;
    animation: scale 0.4s 0s linear infinite alternate;
  }

  &:nth-child(3) {
    height: 30%;
    animation: scale 0.2s 0s linear infinite alternate;
  }
}

@keyframes scale {
  to {
    height: 100%;
  }
}
</style>

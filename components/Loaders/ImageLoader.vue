<template>
  <span :class="$style.loader">
    <span class="visually-hidden">Loading image</span>
  </span>
</template>

<style module>
.loader {
  display: block;
  overflow: hidden;

  &::after {
    position: absolute;
    inset: 0 0 auto;
    z-index: 1;
    height: 100%;
    content: '';
    background: linear-gradient(
      90deg,
      transparent,
      var(--border-color),
      transparent
    );
    transform: translateX(-100%);
    animation: image-loader 1.3s infinite;
  }
}

@keyframes image-loader {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}
</style>

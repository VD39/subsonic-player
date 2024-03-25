<template>
  <span>
    <span :class="$style.loader" />
    <span class="visually-hidden">Loading data</span>
  </span>
</template>

<style module>
.loader {
  position: relative;
  display: block;
  width: 15px;
  height: 15px;
  border: 2px solid var(--invert-background-color);
  border-top-color: transparent;
  border-radius: 50%;
  animation: button-loader 0.75s linear infinite;
}

@keyframes button-loader {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

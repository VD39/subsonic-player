<template>
  <span>
    <span :class="$style.loader" />
    <span class="visually-hidden">Loading data</span>
  </span>
</template>

<style module>
.loader {
  @mixin align-center;

  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
  background-color: currentcolor;
  border-radius: 50%;
  opacity: 0;
  animation: scroller-loader 0.75s linear infinite;
}

@keyframes scroller-loader {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  80% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>

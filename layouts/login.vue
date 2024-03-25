<template>
  <main :class="$style.root">
    <slot />
  </main>
</template>

<style module>
.root {
  @mixin align-center;

  flex-wrap: wrap;
  justify-content: center;
  min-height: 100vh;

  &::before {
    position: fixed;
    top: 0;
    left: 0;
    width: 50%;
    height: 100vh;
    content: '';
    background-color: var(--theme-color);
    opacity: 0.05;
  }
}
</style>

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
    inset: 0 auto auto 0;
    width: 50%;
    height: 100vh;
    content: '';
    background-color: var(--theme-color);
    opacity: 0.1;
  }
}
</style>

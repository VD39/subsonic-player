<template>
  <main :class="['centerAll', $style.login]">
    <slot />
  </main>
</template>

<style module>
.login {
  flex-wrap: wrap;
  min-height: 100svh;

  &::before {
    position: fixed;
    inset: 0 auto auto 0;
    width: 50%;
    height: 100svh;
    content: '';
    background-color: var(--theme-color);
    opacity: 0.1;
  }
}
</style>

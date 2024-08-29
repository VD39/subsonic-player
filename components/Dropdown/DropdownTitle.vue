<template>
  <li :class="$style.title">
    <p class="strong"><slot /></p>
  </li>
</template>

<style module>
.title {
  @mixin align-center;

  width: 100%;
  padding: var(--dropdown-spacing);
}
</style>

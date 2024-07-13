<template>
  <span :class="$style.icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 24 24"
      width="75"
    >
      <path d="M4 13.5V13c0-4.97 3.582-9 8-9s8 4.03 8 9v.5" />
      <path
        d="M2 17.439v-1.877a2 2 0 0 1 1.515-1.94L4 13.5l1.254-.314a.6.6 0 0 1 .746.582v5.464a.6.6 0 0 1-.746.582l-1.74-.435A2 2 0 0 1 2 17.439ZM22 17.439v-1.877a2 2 0 0 0-1.515-1.94L20 13.5l-1.255-.314a.6.6 0 0 0-.745.582v5.464a.6.6 0 0 0 .745.582l1.74-.435A2 2 0 0 0 22 17.439Z"
      />
    </svg>
  </span>

  <span :class="$style.loading">
    <span :class="$style.bar" />
    <span :class="$style.bar" />
    <span :class="$style.bar" />
    <span :class="$style.bar" />
  </span>

  <span class="visually-hidden">Loading data</span>
</template>

<style module>
.loading,
.icon {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
}

.loading {
  @mixin align-center;

  height: 8px;
  margin-top: var(--space-12);
}

.bar {
  width: 2px;
  margin: 0 var(--space-2);
  background-color: var(--invert-background-color);
  border-radius: var(--border-radius-l);
  animation: main-loader 0.8s infinite;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:nth-child(4) {
    animation-delay: 0.4s;
  }
}

@keyframes main-loader {
  0% {
    height: 0;
  }

  50% {
    height: 20px;
  }

  100% {
    height: 0;
  }
}
</style>

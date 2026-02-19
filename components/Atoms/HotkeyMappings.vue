<script setup lang="ts">
const { HOTKEY_MAPPINGS, isHotkeyListOpened } = useHotkeyManager();
</script>

<template>
  <transition name="slide-up-down">
    <div
      v-if="isHotkeyListOpened"
      ref="hotkeyMappings"
      :class="$style.hotkeyMappings"
    >
      <h2 :class="['mBM', $style.title]">Application Hotkey Mappings</h2>

      <div :class="$style.categories">
        <div
          v-for="(mappings, category) in HOTKEY_MAPPINGS"
          :key="category"
          :class="['mBM', $style.category]"
        >
          <h3 :class="['mBM', $style.categoryTitle]">{{ category }}</h3>

          <ul :class="$style.list">
            <li
              v-for="mapping in mappings"
              :key="mapping.description"
              :class="['spaceBetween', $style.item]"
            >
              <p>{{ mapping.description }}</p>

              <p class="visuallyHidden">{{ mapping.helpText }}</p>

              <div :class="$style.keys" :title="mapping.helpText">
                <code v-for="key in mapping.keys" :key :class="$style.key">
                  {{ key }}
                </code>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>

  <span v-if="isHotkeyListOpened" ref="fullscreen" class="fullscreen" />
</template>

<style module>
.hotkeyMappings {
  position: fixed;
  inset: 0;
  z-index: 99;
  width: var(--width-height-100);
  height: 100vh;
  padding: var(--space-16) 0;
  overflow-y: auto;
  background-color: var(--modal-background-color);
  box-shadow: var(--box-shadow-large);

  @media (--tablet-up) {
    top: auto;
    left: auto;
    max-width: 1000px;
    height: auto;
  }
}

.title {
  padding: var(--space-16);
  text-align: center;
  border-bottom: 2px solid #e0e0e0;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.category {
  padding: 0 var(--space-24);
}

.categoryTitle {
  padding-bottom: var(--space-4);
  color: var(--theme-color);
  border-bottom: 2px solid var(--theme-color);
  opacity: 0.8;
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-12);
}

.item {
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-8);
  background-color: var(--modal-background-color);
  border: 1px solid var(--invert-color);
  border-radius: var(--border-radius-medium);
}

.keys {
  display: inline-flex;
  gap: calc(var(--space-8) * 2);
}

.key {
  position: relative;
  flex-shrink: 0;
  padding: var(--space-8);
  background-color: var(--modal-background-color);
  border: 1px solid var(--invert-color);
  border-radius: var(--border-radius-medium);

  &:not(:last-child)::after {
    position: absolute;
    inset: 50% -14px auto auto;
    font-weight: var(--font-weight-bold);
    content: '+';
    transform: translateY(-50%);
  }
}
</style>

<script setup lang="ts">
const { KEYBOARD_SHORTCUTS } = useKeyboardShortcuts();
</script>

<template>
  <div ref="shortcutList" :class="$style.shortcutList">
    <p :class="$style.note">
      Shortcuts are ignored while focus is on an input, button, link, or other
      control (or while a modal is open). Focus away from any control before
      using a shortcut.
    </p>

    <div :class="$style.categories">
      <div
        v-for="(mappings, category) in KEYBOARD_SHORTCUTS"
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
</template>

<style module>
.shortcutList {
  max-width: 1000px;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.note {
  margin: var(--space-24);
  text-align: center;
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

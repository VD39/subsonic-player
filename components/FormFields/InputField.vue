<script setup lang="ts">
withDefaults(
  defineProps<{
    error?: string;
    hideLabel?: boolean;
    id: string;
    label: string;
    modelValue: string | string[];
    placeholder?: string;
    required?: boolean;
    type?: string;
  }>(),
  {
    error: undefined,
    placeholder: undefined,
    type: 'text',
  },
);

const emit = defineEmits(['update:modelValue']);

function updateModel(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div
    :class="[
      $style.inputField,
      {
        [$style.error]: error,
      },
    ]"
  >
    <label
      ref="label"
      :class="[
        $style.label,
        {
          'visually-hidden': hideLabel,
        },
      ]"
      :for="id"
    >
      {{ label }}
      <span v-if="required" ref="required" :class="$style.required">*</span>
    </label>

    <input
      :id="id"
      ref="input"
      :type="type"
      autocomplete="off"
      :value="modelValue"
      :required="required"
      :placeholder="placeholder"
      :class="$style.input"
      @input="updateModel"
    />

    <p v-if="error" ref="error" :class="$style.error">
      {{ error }}
    </p>
  </div>
</template>

<style module>
.inputField {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.label {
  display: inline-block;
  color: var(--secondary-font-color);

  &::first-letter {
    text-transform: capitalize;
  }
}

.input {
  position: relative;
  width: 100%;
  padding: calc(var(--space-12) - 1px) var(--space-12);
  color: var(--body-font-color);
  background-color: var(--secondary-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-small);

  .error & {
    border-color: var(--error-color);

    &:focus {
      border-color: var(--error-color);
    }
  }

  &::placeholder {
    opacity: 0.8;
  }
}

.required {
  color: var(--error-color);
}

.error {
  margin-top: var(--space-2);
  font-size: var(--small-font-size);
  color: var(--error-color);

  &::first-letter {
    text-transform: capitalize;
  }
}
</style>

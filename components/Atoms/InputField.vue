<script setup lang="ts">
withDefaults(
  defineProps<{
    error?: string;
    hideLabel?: boolean;
    id: string;
    label: string;
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

const internalModal = defineModel<string | string[]>();
</script>

<template>
  <div
    :class="[
      'column',
      $style.inputField,
      {
        [$style.error]: error,
      },
    ]"
  >
    <label
      ref="label"
      :class="[
        'mBXS',
        'sentenceCase',
        'smallFont',
        $style.label,
        {
          visuallyHidden: hideLabel,
        },
      ]"
      :for="id"
    >
      {{ label }}
      <span v-if="required" ref="required" :class="$style.required">*</span>
    </label>

    <input
      :id
      ref="input"
      v-model="internalModal"
      autocomplete="off"
      :class="$style.input"
      :placeholder
      :required
      :type
    />

    <p v-if="error" ref="error" class="smallFont sentenceCase">
      {{ error }}
    </p>
  </div>
</template>

<style module>
.inputField {
  --label-color: var(--secondary-font-color);
  --input-border-color: var(--border-color);
  --input-width: var(--width-height-100);

  width: var(--input-width);
  color: var(--label-color);
}

.error {
  --label-color: var(--error-color);
  --input-border-color: var(--error-color);
}

.label {
  display: inline-block;
  color: var(--secondary-font-color);
}

.input {
  position: relative;
  width: var(--input-width);
  padding: calc(var(--space-12) - 2px) var(--space-12);
  color: var(--body-font-color);
  background-color: var(--secondary-background-color);
  border: 1px solid var(--input-border-color);
  border-radius: var(--border-radius-small);

  &::placeholder {
    opacity: 0.8;
  }
}

.required {
  color: var(--error-color);
}
</style>

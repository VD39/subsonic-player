<script setup lang="ts">
import InputField from '@/components/FormFields/InputField.vue';
import LoadingButton from '@/components/Buttons/LoadingButton.vue';

const loading = ref(false);

const emit = defineEmits(['submit']);

const formInputs = {
  feedUrl: {
    validationRules: {
      isUrl: true,
      required: true,
    },
  },
};

const form = createForm(formInputs);

async function submitForm() {
  validateInputs(form);

  if (!form.isValid.value) {
    return;
  }

  loading.value = true;

  emit('submit', form.fields.feedUrl.value.value);
}
</script>

<template>
  <form novalidate @submit.stop.prevent="submitForm">
    <div :class="$style.fields">
      <InputField
        :id="form.fields.feedUrl.id"
        v-model="form.fields.feedUrl.value.value"
        :label="form.fields.feedUrl.label"
        placeholder="RSS feed url"
        :required="form.fields.feedUrl.required"
        :error="form.fields.feedUrl.error.value"
      />
    </div>

    <LoadingButton :class="$style.button" :loading="loading">
      Add podcast
    </LoadingButton>
  </form>
</template>

<style module>
.fields {
  margin-bottom: var(--space-32);
}

.button {
  @media (--mobile-only) {
    width: 100%;
  }

  margin-left: auto;
}
</style>

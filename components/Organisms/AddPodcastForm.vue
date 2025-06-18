<script setup lang="ts">
import InputField from '@/components/Atoms/InputField.vue';
import SubmitButton from '@/components/Molecules/SubmitButton.vue';

const emit = defineEmits<{
  submit: [value: string | string[]];
}>();

const loading = ref(false);

const formInputs = {
  feedUrl: {
    validationRules: {
      isUrl: true,
      required: true,
    },
  },
};

const form = createForm(formInputs);

async function onFormSubmit() {
  validateInputs(form);

  if (!form.isValid.value) {
    return;
  }

  loading.value = true;

  emit('submit', form.fields.feedUrl.value.value);
}
</script>

<template>
  <form novalidate @submit.stop.prevent="onFormSubmit">
    <div class="formFields">
      <InputField
        :id="form.fields.feedUrl.id"
        v-model="form.fields.feedUrl.value.value"
        :error="form.fields.feedUrl.error.value"
        :label="form.fields.feedUrl.label"
        placeholder="Enter RSS feed url"
        :required="form.fields.feedUrl.required"
      />
    </div>

    <SubmitButton class="formButton" :loading> Add podcast </SubmitButton>
  </form>
</template>

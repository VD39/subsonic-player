<script setup lang="ts">
import InputField from '@/components/FormFields/InputField.vue';
import LoadingButton from '@/components/Buttons/LoadingButton.vue';

const loading = ref(false);

const emit = defineEmits(['submit']);

const formInputs = {
  name: {
    validationRules: {
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
  emit('submit', form.fields.name.value.value);
}
</script>

<template>
  <form novalidate @submit.stop.prevent="submitForm">
    <div :class="$style.fields">
      <InputField
        :id="form.fields.name.id"
        v-model="form.fields.name.value.value"
        :label="form.fields.name.label"
        placeholder="Enter radio station name"
        :required="form.fields.name.required"
        :error="form.fields.name.error.value"
      />
    </div>

    <LoadingButton :loading="loading" :class="$style.button">
      Add playlist
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

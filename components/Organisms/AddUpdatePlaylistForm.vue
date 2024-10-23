<script setup lang="ts">
import InputField from '@/components/Atoms/InputField.vue';
import SubmitButton from '@/components/Molecules/SubmitButton.vue';

const props = defineProps<{
  playlist?: Playlist;
}>();

const emit = defineEmits(['submit']);

const loading = ref(false);

const formInputs = {
  name: {
    validationRules: {
      required: true,
    },
    value: props.playlist?.name,
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
    <div class="formFields">
      <InputField
        :id="form.fields.name.id"
        v-model="form.fields.name.value.value"
        :label="form.fields.name.label"
        placeholder="Enter playlist name"
        :required="form.fields.name.required"
        :error="form.fields.name.error.value"
      />
    </div>

    <SubmitButton :loading="loading" class="formButton">
      {{ playlist?.name ? 'Update' : 'Add' }} playlist
    </SubmitButton>
  </form>
</template>

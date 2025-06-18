<script setup lang="ts">
import InputField from '@/components/Atoms/InputField.vue';
import SubmitButton from '@/components/Molecules/SubmitButton.vue';

const props = defineProps<{
  playlist?: Playlist;
}>();

const emit = defineEmits<{
  submit: [value: string | string[]];
}>();

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

async function onFormSubmit() {
  validateInputs(form);

  if (!form.isValid.value) {
    return;
  }

  loading.value = true;

  emit('submit', form.fields.name.value.value);
}
</script>

<template>
  <form novalidate @submit.stop.prevent="onFormSubmit">
    <div class="formFields">
      <InputField
        :id="form.fields.name.id"
        v-model="form.fields.name.value.value"
        :error="form.fields.name.error.value"
        :label="form.fields.name.label"
        placeholder="Enter playlist name"
        :required="form.fields.name.required"
      />
    </div>

    <SubmitButton class="formButton" :loading>
      {{ playlist?.name ? 'Update' : 'Add' }} playlist
    </SubmitButton>
  </form>
</template>

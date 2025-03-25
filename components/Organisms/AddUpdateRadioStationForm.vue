<script setup lang="ts">
import InputField from '@/components/Atoms/InputField.vue';
import SubmitButton from '@/components/Molecules/SubmitButton.vue';

const props = defineProps<{
  radioStation?: RadioStation;
}>();

const emit = defineEmits<{
  submit: [
    value: {
      homepageUrl: string | string[];
      name: string | string[];
      streamUrl: string | string[];
    },
  ];
}>();

const loading = ref(false);

const formInputs = {
  homepageUrl: {
    validationRules: {
      isUrl: true,
    },
    value: props.radioStation?.homePageUrl,
  },
  name: {
    validationRules: {
      required: true,
    },
    value: props.radioStation?.name,
  },
  streamUrl: {
    validationRules: {
      isUrl: true,
      required: true,
    },
    value: props.radioStation?.streamUrlId,
  },
};

const form = createForm(formInputs);

async function onFormSubmit() {
  validateInputs(form);

  if (!form.isValid.value) {
    return;
  }

  loading.value = true;

  const { homepageUrl, name, streamUrl } = form.fields;

  emit('submit', {
    homepageUrl: homepageUrl.value.value,
    name: name.value.value,
    streamUrl: streamUrl.value.value,
  });
}
</script>

<template>
  <form novalidate @submit.stop.prevent="onFormSubmit">
    <div class="formFields">
      <InputField
        :id="form.fields.name.id"
        ref="name"
        v-model="form.fields.name.value.value"
        class="formField"
        :error="form.fields.name.error.value"
        :label="form.fields.name.label"
        placeholder="Enter radio station name"
        :required="form.fields.name.required"
      />

      <InputField
        :id="form.fields.streamUrl.id"
        ref="streamUrl"
        v-model="form.fields.streamUrl.value.value"
        class="formField"
        :error="form.fields.streamUrl.error.value"
        :label="form.fields.streamUrl.label"
        placeholder="Enter radio station stream URL"
        required
      />

      <InputField
        :id="form.fields.homepageUrl.id"
        ref="homepageUrl"
        v-model="form.fields.homepageUrl.value.value"
        class="formField"
        :error="form.fields.homepageUrl.error.value"
        :label="form.fields.homepageUrl.label"
        placeholder="Enter radio station homepage URL"
      />
    </div>

    <SubmitButton class="formButton" :loading="loading">
      {{ radioStation?.name ? 'Update' : 'Add' }} radio station
    </SubmitButton>
  </form>
</template>

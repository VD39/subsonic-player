<script setup lang="ts">
import InputField from '@/components/FormFields/InputField.vue';
import LoadingButton from '@/components/Buttons/LoadingButton.vue';

const props = defineProps<{
  radioStation?: RadioStation;
}>();

const emit = defineEmits(['submit']);

const loading = ref(false);

const formInputs = {
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
    value: props.radioStation?.streamUrl,
  },
  homepageUrl: {
    validationRules: {
      isUrl: true,
    },
    value: props.radioStation?.homePageUrl,
  },
};

const form = createForm(formInputs);

async function submitForm() {
  validateInputs(form);

  if (!form.isValid.value) {
    return;
  }

  loading.value = true;

  const { name, streamUrl, homepageUrl } = form.fields;

  emit('submit', {
    name: name.value.value,
    streamUrl: streamUrl.value.value,
    homepageUrl: homepageUrl.value.value,
  });
}
</script>

<template>
  <form novalidate @submit.stop.prevent="submitForm">
    <div :class="$style.fields">
      <InputField
        :id="form.fields.name.id"
        ref="name"
        v-model="form.fields.name.value.value"
        :class="$style.field"
        :label="form.fields.name.label"
        placeholder="Enter radio station name"
        :required="form.fields.name.required"
        :error="form.fields.name.error.value"
      />

      <InputField
        :id="form.fields.streamUrl.id"
        ref="streamUrl"
        v-model="form.fields.streamUrl.value.value"
        :class="$style.field"
        :label="form.fields.streamUrl.label"
        placeholder="Enter radio station stream URL"
        required
        :error="form.fields.streamUrl.error.value"
      />

      <InputField
        :id="form.fields.homepageUrl.id"
        ref="homepageUrl"
        v-model="form.fields.homepageUrl.value.value"
        :class="$style.field"
        :label="form.fields.homepageUrl.label"
        placeholder="Enter radio station homepage URL"
        :error="form.fields.homepageUrl.error.value"
      />
    </div>

    <LoadingButton :class="$style.button" :loading="loading">
      {{ radioStation?.name ? 'Update' : 'Add' }} Radio Station
    </LoadingButton>
  </form>
</template>

<style module>
.fields {
  margin-bottom: var(--space-32);
}

.field {
  margin-bottom: var(--space-12);
}

.button {
  @media (--mobile-only) {
    width: 100%;
  }

  margin-left: auto;
}
</style>

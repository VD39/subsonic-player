<script setup lang="ts">
import InputField from '@/components/Atoms/InputField.vue';
import MessageBar from '@/components/Atoms/MessageBar.vue';
import SubmitButton from '@/components/Molecules/SubmitButton.vue';

defineProps<{
  error?: null | string;
  loading?: boolean;
}>();

const emit = defineEmits(['submit']);

const config = useRuntimeConfig();
const { SERVER_URL } = config.public;

const formInputs = {
  password: {
    validationRules: {
      required: true,
    },
  },
  server: {
    validationRules: !SERVER_URL
      ? {
          isUrl: true,
          required: true,
        }
      : {},
    value: SERVER_URL,
  },
  username: {
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

  const { password, server, username } = form.fields;

  emit('submit', {
    password: password.value.value,
    server: server.value.value,
    username: username.value.value,
  });
}
</script>

<template>
  <form novalidate @submit.stop.prevent="submitForm">
    <div class="formFields">
      <InputField
        v-if="!SERVER_URL"
        :id="form.fields.server.id"
        ref="serverUrl"
        v-model="form.fields.server.value.value"
        class="formField"
        :label="form.fields.server.label"
        placeholder="Enter your server URL"
        required
        :error="form.fields.server.error.value"
      />

      <InputField
        :id="form.fields.username.id"
        ref="username"
        v-model="form.fields.username.value.value"
        class="formField"
        :label="form.fields.username.label"
        placeholder="Enter your username"
        required
        :error="form.fields.username.error.value"
      />

      <InputField
        :id="form.fields.password.id"
        ref="password"
        v-model="form.fields.password.value.value"
        class="formField"
        type="password"
        :label="form.fields.password.label"
        placeholder="Enter your password"
        required
        :error="form.fields.password.error.value"
      />
    </div>

    <MessageBar v-if="form.isValid.value && error" class="mBM" type="error">
      <p class="sentenceCase">{{ error }}</p>
    </MessageBar>

    <SubmitButton class="formButton" :loading="loading" full-width>
      Login
    </SubmitButton>
  </form>
</template>

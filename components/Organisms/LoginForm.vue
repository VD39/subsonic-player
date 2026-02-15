<script setup lang="ts">
import InputField from '@/components/Atoms/InputField.vue';
import MessageBar from '@/components/Atoms/MessageBar.vue';
import SubmitButton from '@/components/Molecules/SubmitButton.vue';

defineProps<{
  error?: null | string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [value: AuthData];
}>();

const config = useRuntimeConfig();
const { SERVER_URL } = config.public;

const formInputs = {
  password: {
    validationRules: {
      required: true,
    },
  },
  server: {
    validationRules: SERVER_URL
      ? {}
      : {
          isUrl: true,
          required: true,
        },
    value: SERVER_URL,
  },
  username: {
    validationRules: {
      required: true,
    },
  },
};

const form = createForm(formInputs);

function onFormSubmit() {
  validateInputs(form);

  if (!form.isValid.value) {
    return;
  }

  const { password, server, username } = form.fields;

  emit('submit', {
    password: password.value.value as string,
    server: server.value.value as string,
    username: username.value.value as string,
  });
}
</script>

<template>
  <form novalidate @submit.stop.prevent="onFormSubmit">
    <div class="formFields">
      <InputField
        v-if="!SERVER_URL"
        :id="form.fields.server.id"
        ref="serverUrl"
        v-model="form.fields.server.value.value"
        class="formField"
        :error="form.fields.server.error.value"
        :label="form.fields.server.label"
        placeholder="Enter your server URL"
        required
      />

      <InputField
        :id="form.fields.username.id"
        ref="username"
        v-model="form.fields.username.value.value"
        class="formField"
        :error="form.fields.username.error.value"
        :label="form.fields.username.label"
        placeholder="Enter your username"
        required
      />

      <InputField
        :id="form.fields.password.id"
        ref="password"
        v-model="form.fields.password.value.value"
        class="formField"
        :error="form.fields.password.error.value"
        :label="form.fields.password.label"
        placeholder="Enter your password"
        required
        type="password"
      />
    </div>

    <MessageBar v-if="form.isValid.value && error" class="mBM" type="error">
      <p class="sentenceCase">{{ error }}</p>
    </MessageBar>

    <SubmitButton class="formButton" fullWidth :loading> Login </SubmitButton>
  </form>
</template>

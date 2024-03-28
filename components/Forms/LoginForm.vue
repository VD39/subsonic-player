<script setup lang="ts">
import { createForm, validateInputs } from './utils';
import MassageBar from '@/components/MessageBar/MessageBar.vue';
import InputField from '@/components/FormFields/InputField.vue';
import LoadingButton from '@/components/Buttons/LoadingButton.vue';

const config = useRuntimeConfig();
const { SERVER_URL } = config.public;

defineProps<{
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits(['submit']);

const formInputs = {
  server: {
    value: SERVER_URL,
    validationRules: !SERVER_URL
      ? {
          required: true,
          isUrl: true,
        }
      : {},
  },
  username: {
    validationRules: {
      required: true,
    },
  },
  password: {
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

  const { server, username, password } = form.fields;

  emit('submit', {
    password: password.value.value,
    server: server.value.value,
    username: username.value.value,
  });
}
</script>

<template>
  <form novalidate @submit.stop.prevent="submitForm">
    <div :class="$style.fields">
      <InputField
        v-if="!SERVER_URL"
        :id="form.fields.server.id"
        ref="serverUrl"
        v-model="form.fields.server.value.value"
        :class="$style.field"
        :label="form.fields.server.label"
        placeholder="Enter your server URL"
        required
        :error="form.fields.server.error.value"
      />

      <InputField
        :id="form.fields.username.id"
        ref="username"
        v-model="form.fields.username.value.value"
        :class="$style.field"
        :label="form.fields.username.label"
        placeholder="Enter your username"
        required
        :error="form.fields.username.error.value"
      />

      <InputField
        :id="form.fields.password.id"
        ref="password"
        v-model="form.fields.password.value.value"
        :class="$style.field"
        type="password"
        :label="form.fields.password.label"
        placeholder="Enter your password"
        required
        :error="form.fields.password.error.value"
      />
    </div>

    <MassageBar
      v-if="form.isValid.value && error"
      :class="$style.messageBar"
      type="error"
    >
      <p>{{ error }}</p>
    </MassageBar>

    <LoadingButton
      :class="$style.button"
      :disabled="loading"
      :loading="loading"
      full-width
    >
      Login
    </LoadingButton>
  </form>
</template>

<style module>
.fields,
.messageBar {
  margin-bottom: var(--space-32);
}

.field {
  margin-bottom: var(--space-12);
}
</style>

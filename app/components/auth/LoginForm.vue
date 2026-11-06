<script setup lang="ts">
import MessageBar from '@/components/notification/MessageBar.vue';
import SelectableBadge from '@/components/settings/SelectableBadge.vue';
import SettingsField from '@/components/settings/SettingsField.vue';
import SettingsGroup from '@/components/settings/SettingsGroup.vue';
import ToggleSwitch from '@/components/settings/ToggleSwitch.vue';
import InputField from '@/components/ui/InputField.vue';
import SubmitButton from '@/components/ui/SubmitButton.vue';

defineProps<{
  error?: null | string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [value: AuthData];
}>();

const config = useRuntimeConfig();
const { SERVER_URL } = config.public;

const loginMode = ref<LoginMode>('password');
const isLegacy = ref(false);

const serverForm = createForm({
  server: {
    validationRules: SERVER_URL
      ? {}
      : {
          isUrl: true,
          required: true,
        },
    value: SERVER_URL,
  },
});

const passwordForm = createForm({
  password: {
    validationRules: {
      required: true,
    },
  },
  username: {
    validationRules: {
      required: true,
    },
  },
});

const apiKeyForm = createForm({
  apiKey: {
    validationRules: {
      required: true,
    },
  },
});

const activeForm = computed(() =>
  loginMode.value === 'apiKey' ? apiKeyForm : passwordForm,
);

const isFormValid = computed(
  () => serverForm.isValid.value && activeForm.value.isValid.value,
);

function onFormSubmit() {
  validateFormFields(serverForm);
  validateFormFields(activeForm.value);

  if (!isFormValid.value) {
    return;
  }

  const server = serverForm.fields.server.value.value as string;

  if (loginMode.value === 'apiKey') {
    emit('submit', {
      apiKey: apiKeyForm.fields.apiKey.value.value as string,
      authMethod: 'apiKey',
      server,
    });

    return;
  }

  emit('submit', {
    authMethod: isLegacy.value ? 'legacy' : 'token',
    password: passwordForm.fields.password.value.value as string,
    server,
    username: passwordForm.fields.username.value.value as string,
  });
}

function setLoginMode(mode: LoginMode) {
  loginMode.value = mode;
}

function toggleLegacy() {
  isLegacy.value = !isLegacy.value;
}
</script>

<template>
  <form novalidate @submit.stop.prevent="onFormSubmit">
    <div class="formFields">
      <SettingsGroup
        ref="loginModeGroup"
        class="mBM"
        title="Login method"
        variant="badge"
      >
        <SelectableBadge
          v-for="opt in LOGIN_MODE_OPTIONS"
          :key="opt.value"
          :label="opt.label"
          name="loginMode"
          :selected="loginMode === opt.value"
          @click="setLoginMode(opt.value)"
        />
      </SettingsGroup>

      <InputField
        v-if="!SERVER_URL"
        :id="serverForm.fields.server.id"
        ref="serverUrl"
        v-model="serverForm.fields.server.value.value"
        class="formField"
        :error="serverForm.fields.server.error.value"
        :label="serverForm.fields.server.label"
        placeholder="Enter your server URL"
        required
      />

      <template v-if="loginMode === 'password'">
        <InputField
          :id="passwordForm.fields.username.id"
          ref="username"
          v-model="passwordForm.fields.username.value.value"
          class="formField"
          :error="passwordForm.fields.username.error.value"
          :label="passwordForm.fields.username.label"
          placeholder="Enter your username"
          required
        />

        <InputField
          :id="passwordForm.fields.password.id"
          ref="password"
          v-model="passwordForm.fields.password.value.value"
          class="formField"
          :error="passwordForm.fields.password.error.value"
          :label="passwordForm.fields.password.label"
          placeholder="Enter your password"
          required
          type="password"
        />

        <SettingsField
          description="Send the password hex-encoded instead of as a salted token."
          title="Legacy authentication"
        >
          <ToggleSwitch
            ref="legacyToggle"
            label="Legacy authentication"
            :pressed="isLegacy"
            @click="toggleLegacy"
          />
        </SettingsField>
      </template>

      <InputField
        v-else
        :id="apiKeyForm.fields.apiKey.id"
        ref="apiKey"
        v-model="apiKeyForm.fields.apiKey.value.value"
        class="formField"
        :error="apiKeyForm.fields.apiKey.error.value"
        label="API key"
        placeholder="Enter your API key"
        required
        type="password"
      />
    </div>

    <MessageBar v-if="isFormValid && error" class="mBM" type="error">
      <p class="sentenceCase">{{ error }}</p>
    </MessageBar>

    <SubmitButton class="formButton" fullWidth :loading> Login </SubmitButton>
  </form>
</template>

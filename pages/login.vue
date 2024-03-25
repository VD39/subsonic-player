<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import LoginForm from '@/components/Forms/LoginForm.vue';
import type { LoginFields } from '@/components/Forms/types';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher.vue';

definePageMeta({
  layout: 'login',
});

const route = useRoute();

const { login, isLoading, isLoggedIn, errorMessage } = useAuth();

async function checkLogin() {
  if (isLoggedIn.value) {
    const redirect = route.query.redirect?.toString();

    await navigateTo(redirect ?? '/');
  }
}

async function submitForm(fields: LoginFields) {
  const { server, username, password } = fields;

  await login({
    password,
    server,
    username,
  });

  await checkLogin();
}
</script>

<template>
  <div :class="$style.loginView">
    <div :class="$style.header">
      <h3>Login</h3>

      <ThemeSwitcher :class="$style.themeSwitcher" />
    </div>

    <LoginForm
      :is-loading="isLoading"
      :error-message="errorMessage"
      @submit="submitForm"
    />
  </div>
</template>

<style module>
.loginView {
  position: relative;
  display: block;
  width: 95%;
  max-width: 500px;
  padding: var(--space-40);
  background-color: var(--background-color);
  border-radius: var(--border-radius-l);
  box-shadow: var(--box-shadow-large);
}

.header {
  @mixin align-center;

  justify-content: space-between;
}

.themeSwitcher {
  margin-left: auto;
}
</style>

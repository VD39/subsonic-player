<script setup lang="ts">
import LoginForm from '@/components/Forms/LoginForm.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher.vue';

definePageMeta({
  layout: 'login',
});

const route = useRoute();

const { authenticated, error, loading, login } = useAuth();

async function checkLogin() {
  if (authenticated.value) {
    const redirect = route.query.redirect?.toString();

    await navigateTo(redirect ?? '/');
  }
}

async function submitForm(fields: AuthData) {
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

    <LoginForm :loading="loading" :error="error" @submit="submitForm" />
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
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
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

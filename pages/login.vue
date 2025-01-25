<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import ThemeSwitcher from '@/components/Molecules/ThemeSwitcher.vue';
import LoginForm from '@/components/Organisms/LoginForm.vue';

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

async function onFormSubmit(fields: AuthData) {
  const { password, server, username } = fields;

  await login({
    password,
    server,
    username,
  });

  await checkLogin();
}

useHead({
  title: 'Login',
});
</script>

<template>
  <div :class="['mBAllM', 'inner', $style.login]">
    <HeaderWithAction>
      <h3>Login</h3>

      <template #actions>
        <ThemeSwitcher />
      </template>
    </HeaderWithAction>

    <LoginForm :loading="loading" :error="error" @submit="onFormSubmit" />
  </div>
</template>

<style module>
.login {
  position: relative;
  max-width: 500px;
  padding: var(--space-40);
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  box-shadow: var(--box-shadow-large);
}
</style>

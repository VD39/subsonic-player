<script setup lang="ts">
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import ThemeSwitcher from '@/components/Molecules/ThemeSwitcher.vue';
import LoginForm from '@/components/Organisms/LoginForm.vue';

definePageMeta({
  layout: 'login',
});

const route = useRoute();

const { error, isAuthenticated, loading, login } = useAuth();

async function checkLogin() {
  if (isAuthenticated.value) {
    const redirect = route.query.redirect?.toString();

    // For webOS file:// protocol, ignore redirect query as it may contain file system paths
    const isWebOS = import.meta.client && window.location.protocol === 'file:';
    const isValidRedirect =
      redirect &&
      !redirect.includes('/media/') &&
      !redirect.includes('/usr/palm/') &&
      redirect.startsWith('/');

    await navigateTo(
      !isWebOS && isValidRedirect
        ? redirect
        : {
            name: ROUTE_NAMES.index,
          },
    );
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

    <LoginForm :error :loading @submit="onFormSubmit" />
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

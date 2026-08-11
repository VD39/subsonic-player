import { mountSuspended } from '@nuxt/test-utils/runtime';
import { defineComponent } from 'vue';

interface WithSetup<T> {
  app: Awaited<ReturnType<typeof mountSuspended>>;
  composable: T;
}

export async function withSetup<T>(
  composable: () => Promise<T> | T,
): Promise<WithSetup<T>> {
  let result!: T;

  const SetupComponent = defineComponent({
    async setup() {
      result = await composable();
      return () => ({});
    },
  });

  const wrapper = await mountSuspended(SetupComponent);

  return {
    app: wrapper,
    composable: result,
  };
}

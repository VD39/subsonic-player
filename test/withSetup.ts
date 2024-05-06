import type { App } from 'vue';
import { createApp } from 'vue';

interface WithSetup<T> {
  composable: T;
  app: App<Element>;
}

export function withSetup<T>(composable: () => T): WithSetup<T> {
  let result!: T;

  const app = createApp({
    setup() {
      result = composable();
      return () => {};
    },
  });

  app.mount(document.createElement('div'));

  return {
    app,
    composable: result,
  };
}

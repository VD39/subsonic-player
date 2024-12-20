import TestComponent from './TestComponent.vue';

export default {
  component: TestComponent,
  decorators: [
    () => ({
      template: '<div id="teleports"></div><story />',
    }),
  ],
  render: (args: unknown) => ({
    components: {
      TestComponent,
    },
    setup: () => {
      return {
        args,
      };
    },
    template: '<TestComponent v-bind="args" />',
  }),
  title: 'TestComponent',
};

export const Default = {
  args: {},
};

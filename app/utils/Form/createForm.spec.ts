import { createForm } from './createForm';

describe('createForm', () => {
  it('returns the correct values', () => {
    expect(
      createForm({
        input: {
          validationRules: {
            isUrl: true,
            required: true,
          },
        },
        noValidationsOrOptions: {},
        withOptions: {
          options: ['1', '2', '3'],
          validationRules: {
            required: true,
          },
        },
        withValue: {
          value: 'This is the set value',
        },
      }),
    ).toEqual({
      fields: {
        input: {
          error: ref(''),
          id: 'input',
          isValid: ref(true),
          label: 'input',
          name: 'input',
          options: undefined,
          required: true,
          validationRules: {
            isUrl: true,
            required: true,
          },
          value: ref(''),
        },
        noValidationsOrOptions: {
          error: ref(''),
          id: 'noValidationsOrOptions',
          isValid: ref(true),
          label: 'no Validations Or Options',
          name: 'noValidationsOrOptions',
          options: undefined,
          required: false,
          validationRules: undefined,
          value: ref(''),
        },
        withOptions: {
          error: ref(''),
          id: 'withOptions',
          isValid: ref(true),
          label: 'with Options',
          name: 'withOptions',
          options: ['1', '2', '3'],
          required: true,
          validationRules: {
            required: true,
          },
          value: ref([]),
        },
        withValue: {
          error: ref(''),
          id: 'withValue',
          isValid: ref(true),
          label: 'with Value',
          name: 'withValue',
          options: undefined,
          required: false,
          validationRules: undefined,
          value: ref('This is the set value'),
        },
      },
      isValid: ref(false),
    });
  });
});

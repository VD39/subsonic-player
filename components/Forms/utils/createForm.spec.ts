import { createForm } from './createForm';

describe('createForm', () => {
  it('returns the correct values', () => {
    expect(
      createForm({
        input: {
          validationRules: {
            required: true,
            isUrl: true,
          },
        },
        withOptions: {
          options: ['1', '2', '3'],
          validationRules: {
            required: true,
          },
        },
        withValue: {
          value: 'This is the set value',
        },
        noValidationsOrOptions: {},
      }),
    ).toEqual({
      fields: {
        input: {
          name: 'input',
          id: 'input',
          label: 'input',
          value: ref(''),
          isValid: ref(true),
          errorMessage: ref(''),
          validationRules: {
            required: true,
            isUrl: true,
          },
          required: true,
          options: undefined,
        },
        withOptions: {
          name: 'withOptions',
          id: 'withOptions',
          label: 'with Options',
          value: ref([]),
          isValid: ref(true),
          errorMessage: ref(''),
          validationRules: {
            required: true,
          },
          required: true,
          options: ['1', '2', '3'],
        },
        withValue: {
          name: 'withValue',
          id: 'withValue',
          label: 'with Value',
          value: ref('This is the set value'),
          isValid: ref(true),
          errorMessage: ref(''),
          validationRules: undefined,
          required: false,
          options: undefined,
        },
        noValidationsOrOptions: {
          name: 'noValidationsOrOptions',
          id: 'noValidationsOrOptions',
          label: 'no Validations Or Options',
          value: ref(''),
          isValid: ref(true),
          errorMessage: ref(''),
          validationRules: undefined,
          required: false,
          options: undefined,
        },
      },
      isValid: ref(false),
    });
  });
});

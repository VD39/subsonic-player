import type { ValidationRules } from './types';

import { validateInputs } from './validateInputs';

function setFormFields(
  fieldValue: string | string[],
  validationRules: ValidationRules = {},
) {
  const form = {
    fields: {
      input: {
        error: ref(''),
        id: 'input',
        isValid: ref(true),
        label: 'input',
        name: 'input',
        options: undefined,
        required: true,
        validationRules,
        value: ref(fieldValue),
      },
    },
    isValid: ref(false),
  };

  validateInputs(form);

  return form;
}

describe('validateInputs', () => {
  describe('when field input value is a string value', () => {
    describe('when field input value has no validations rules', () => {
      it('sets the field input as valid', () => {
        const field = setFormFields('');
        expect(field.fields.input.isValid.value).toEqual(true);
        expect(field.fields.input.error.value).toEqual('');
        expect(field.isValid.value).toEqual(true);
      });
    });

    describe('when field input value has validations rules', () => {
      describe('when field input value should be required', () => {
        describe('when field input value is not defined', () => {
          it('sets the field input as valid', () => {
            const field = setFormFields('', {
              required: true,
            });
            expect(field.fields.input.isValid.value).toEqual(false);
            expect(field.fields.input.error.value).toEqual('input is required');
            expect(field.isValid.value).toEqual(false);
          });
        });

        describe('when field input value is defined', () => {
          it('sets the field input as valid', () => {
            const field = setFormFields('value', {
              required: true,
            });
            expect(field.fields.input.isValid.value).toEqual(true);
            expect(field.fields.input.error.value).toEqual('');
            expect(field.isValid.value).toEqual(true);
          });
        });
      });

      describe('when field input value should be an email', () => {
        describe('when field input value is not defined', () => {
          it('sets the field input as valid', () => {
            const field = setFormFields('', {
              isUrl: true,
            });
            expect(field.fields.input.isValid.value).toEqual(true);
            expect(field.fields.input.error.value).toEqual('');
            expect(field.isValid.value).toEqual(true);
          });
        });

        describe('when field input value is not an email', () => {
          it('sets the field input as valid', () => {
            const field = setFormFields('value', {
              isUrl: true,
            });
            expect(field.fields.input.isValid.value).toEqual(false);
            expect(field.fields.input.error.value).toEqual(
              'input is not a valid URL',
            );
            expect(field.isValid.value).toEqual(false);
          });
        });

        describe('when field input value is an email', () => {
          it('sets the field input as valid', () => {
            const field = setFormFields('https://www.test.com', {
              isUrl: true,
            });
            expect(field.fields.input.isValid.value).toEqual(true);
            expect(field.fields.input.error.value).toEqual('');
            expect(field.isValid.value).toEqual(true);
          });
        });
      });
    });
  });

  describe('when field input value is an array value', () => {
    describe('when field input value has no validations rules', () => {
      it('sets the field input as valid', () => {
        const field = setFormFields([]);
        expect(field.fields.input.isValid.value).toEqual(true);
        expect(field.fields.input.error.value).toEqual('');
        expect(field.isValid.value).toEqual(true);
      });
    });

    describe('when field input value should be required', () => {
      describe('when field input value is not defined', () => {
        it('sets the field input as valid', () => {
          const field = setFormFields([], {
            required: true,
          });
          expect(field.fields.input.isValid.value).toEqual(false);
          expect(field.fields.input.error.value).toEqual('input is required');
          expect(field.isValid.value).toEqual(false);
        });
      });

      describe('when field input value is defined', () => {
        it('sets the field input as valid', () => {
          const field = setFormFields(['value'], {
            required: true,
          });
          expect(field.fields.input.isValid.value).toEqual(true);
          expect(field.fields.input.error.value).toEqual('');
          expect(field.isValid.value).toEqual(true);
        });
      });
    });
  });
});

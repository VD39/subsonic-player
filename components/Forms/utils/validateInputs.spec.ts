import type { ValidationRules } from './types';
import { validateInputs } from './validateInputs';

function setFormFields(
  fieldValue: string | string[],
  validationRules: ValidationRules = {},
) {
  const form = {
    fields: {
      input: {
        name: 'input',
        id: 'input',
        label: 'input',
        value: ref(fieldValue),
        isValid: ref(true),
        errorMessage: ref(''),
        validationRules,
        required: true,
        options: undefined,
      },
    },
    isValid: ref(false),
  };

  validateInputs(form);

  return form;
}

describe('validateInputs', () => {
  describe('when value is a string value', () => {
    describe('when value has no validations rules', () => {
      it('sets the input as valid', () => {
        const field = setFormFields('');
        expect(field.fields.input.isValid.value).toEqual(true);
        expect(field.fields.input.errorMessage.value).toEqual('');
        expect(field.isValid.value).toEqual(true);
      });
    });

    describe('when value has validations rules', () => {
      describe('when value should be required', () => {
        describe('when value is not defined', () => {
          it('sets the input as valid', () => {
            const field = setFormFields('', {
              required: true,
            });
            expect(field.fields.input.isValid.value).toEqual(false);
            expect(field.fields.input.errorMessage.value).toEqual(
              'input is required',
            );
            expect(field.isValid.value).toEqual(false);
          });
        });

        describe('when value is defined', () => {
          it('sets the input as valid', () => {
            const field = setFormFields('value', {
              required: true,
            });
            expect(field.fields.input.isValid.value).toEqual(true);
            expect(field.fields.input.errorMessage.value).toEqual('');
            expect(field.isValid.value).toEqual(true);
          });
        });
      });

      describe('when value should be an email', () => {
        describe('when value is not an email', () => {
          it('sets the input as valid', () => {
            const field = setFormFields('value', {
              isUrl: true,
            });
            expect(field.fields.input.isValid.value).toEqual(false);
            expect(field.fields.input.errorMessage.value).toEqual(
              'input is not a valid URL.',
            );
            expect(field.isValid.value).toEqual(false);
          });
        });

        describe('when value is an email', () => {
          it('sets the input as valid', () => {
            const field = setFormFields('https://www.test.com', {
              isUrl: true,
            });
            expect(field.fields.input.isValid.value).toEqual(true);
            expect(field.fields.input.errorMessage.value).toEqual('');
            expect(field.isValid.value).toEqual(true);
          });
        });
      });
    });
  });

  describe('when value is an array value', () => {
    describe('when value has no validations rules', () => {
      it('sets the input as valid', () => {
        const field = setFormFields([]);
        expect(field.fields.input.isValid.value).toEqual(true);
        expect(field.fields.input.errorMessage.value).toEqual('');
        expect(field.isValid.value).toEqual(true);
      });
    });

    describe('when value should be required', () => {
      describe('when value is not defined', () => {
        it('sets the input as valid', () => {
          const field = setFormFields([], {
            required: true,
          });
          expect(field.fields.input.isValid.value).toEqual(false);
          expect(field.fields.input.errorMessage.value).toEqual(
            'input is required',
          );
          expect(field.isValid.value).toEqual(false);
        });
      });

      describe('when value is defined', () => {
        it('sets the input as valid', () => {
          const field = setFormFields(['value'], {
            required: true,
          });
          expect(field.fields.input.isValid.value).toEqual(true);
          expect(field.fields.input.errorMessage.value).toEqual('');
          expect(field.isValid.value).toEqual(true);
        });
      });
    });
  });
});

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
  let blurSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    blurSpy = vi.spyOn(HTMLElement.prototype, 'blur');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the form is valid', () => {
    describe.each([
      ['', {}],
      [
        'value',
        {
          required: true,
        },
      ],
      [
        '',
        {
          isUrl: true,
        },
      ],
      [
        'https://www.test.com',
        {
          isUrl: true,
        },
      ],
      [[], {}],
      [
        ['value'],
        {
          required: true,
        },
      ],
    ])(
      'when the field value is %o with validation rules %o',
      (fieldValue, validationRules) => {
        let field: ReturnType<typeof setFormFields>;

        beforeEach(() => {
          field = setFormFields(fieldValue, validationRules);
        });

        it('sets the correct isValid value on the field', () => {
          expect(field.fields.input.isValid.value).toBe(true);
        });

        it('sets the correct error value on the field', () => {
          expect(field.fields.input.error.value).toBe('');
        });

        it('sets the correct isValid value on the form', () => {
          expect(field.isValid.value).toBe(true);
        });

        it('calls the blur function', () => {
          expect(blurSpy).toHaveBeenCalledOnce();
        });
      },
    );
  });

  describe('when the form is invalid', () => {
    describe.each([
      [
        '',
        {
          required: true,
        },
        'input is required',
      ],
      [
        'value',
        {
          isUrl: true,
        },
        'input is not a valid URL',
      ],
      [
        [],
        {
          required: true,
        },
        'input is required',
      ],
    ])(
      'when the field value is %o with validation rules %o',
      (fieldValue, validationRules, expectedError) => {
        let field: ReturnType<typeof setFormFields>;

        beforeEach(() => {
          field = setFormFields(fieldValue, validationRules);
        });

        it('sets the correct isValid value on the field', () => {
          expect(field.fields.input.isValid.value).toBe(false);
        });

        it('sets the correct error value on the field', () => {
          expect(field.fields.input.error.value).toBe(expectedError as string);
        });

        it('sets the correct isValid value on the form', () => {
          expect(field.isValid.value).toBe(false);
        });

        it('does not call the blur function', () => {
          expect(blurSpy).not.toHaveBeenCalled();
        });
      },
    );
  });
});

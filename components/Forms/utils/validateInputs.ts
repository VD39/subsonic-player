import type { Fields, Form, FormField } from './types';

function checkFormIsInvalid<T extends Fields<T>>(formFields: T) {
  return Object.values<FormField>(formFields).every(
    (field) => field.isValid.value,
  );
}

function isValidUrl(url: string) {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateInputs<T extends Form<any>>(form: T) {
  Object.values(form.fields).forEach((field) => {
    let value = field.value.value;

    if (typeof value === 'string') {
      value = value.trim();

      if (field.validationRules?.required && !value) {
        field.isValid.value = false;
        field.errorMessage.value = `${field.label} is required`;
        return;
      }

      if (field.validationRules?.isUrl && !isValidUrl(value)) {
        field.isValid.value = false;
        field.errorMessage.value = `${field.label} is not a valid URL.`;
        return;
      }
    }

    if (Array.isArray(value)) {
      if (field.validationRules?.required && !value.length) {
        field.isValid.value = false;
        field.errorMessage.value = `${field.label} is required`;
        return;
      }
    }

    field.isValid.value = true;
    field.errorMessage.value = '';
  });

  form.isValid.value = checkFormIsInvalid(form.fields);
}

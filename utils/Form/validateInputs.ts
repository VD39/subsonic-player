// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateInputs<T extends Form<any>>(form: T) {
  for (const field of Object.values(form.fields)) {
    const value = field.value.value;

    if (typeof value === 'string' && !validateStringField(field, value)) {
      continue;
    }

    if (Array.isArray(value) && !validateArrayField(field, value)) {
      continue;
    }

    field.isValid.value = true;
    field.error.value = '';
  }

  form.isValid.value = checkFormIsInvalid(form.fields);
}

function checkFormIsInvalid<T extends Fields<T>>(formFields: T) {
  return Object.values<FormField>(formFields).every(
    (field) => field.isValid.value,
  );
}

function validateArrayField(field: FormField, value: unknown[]) {
  if (field.validationRules?.required && !value.length) {
    field.isValid.value = false;
    field.error.value = `${field.label} is required`;
    return false;
  }

  return true;
}

function validateStringField(field: FormField, value: string) {
  const trimmed = value.trim();

  if (field.validationRules?.required && !trimmed) {
    field.isValid.value = false;
    field.error.value = `${field.label} is required`;
    return false;
  }

  if (trimmed && field.validationRules?.isUrl && !isUrl(trimmed)) {
    field.isValid.value = false;
    field.error.value = `${field.label} is not a valid URL`;
    return false;
  }

  return true;
}

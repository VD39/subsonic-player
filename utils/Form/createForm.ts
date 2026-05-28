export function createForm<T extends FieldConfig>(fieldsConfig: T) {
  const fields = Object.entries(fieldsConfig).reduce(
    (previousValue, [name, { options, validationRules, value = '' }]) => {
      previousValue[name as keyof T] = {
        error: ref(''),
        id: name,
        isValid: ref(true),
        label: splitCamelCase(name),
        name,
        options,
        required: !!validationRules?.required,
        validationRules,
        value: ref(options ? [] : value),
      };

      return previousValue;
    },
    {} as Fields<T>,
  );

  return {
    fields,
    isValid: ref(false),
  };
}

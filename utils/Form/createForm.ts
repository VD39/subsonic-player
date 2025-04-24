export function createForm<T extends Inputs>(formInputs: T) {
  const fields = Object.entries(formInputs).reduce(
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

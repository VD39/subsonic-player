export function createForm<T extends Inputs>(formInputs: T) {
  const fields = Object.entries(formInputs).reduce(
    (previous, [name, { validationRules, options, value = '' }]) => {
      previous[name as keyof T] = {
        name,
        id: name,
        label: splitCamelCase(name),
        value: ref(options ? [] : value),
        isValid: ref(true),
        error: ref(''),
        validationRules,
        required: !!validationRules?.required,
        options,
      };

      return previous;
    },
    {} as Fields<T>,
  );

  return {
    fields,
    isValid: ref(false),
  };
}

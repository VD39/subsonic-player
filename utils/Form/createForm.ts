export function createForm<T extends Inputs>(formInputs: T) {
  const fields = Object.entries(formInputs).reduce(
    (previous, [name, { options, validationRules, value = '' }]) => {
      previous[name as keyof T] = {
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

      return previous;
    },
    {} as Fields<T>,
  );

  return {
    fields,
    isValid: ref(false),
  };
}

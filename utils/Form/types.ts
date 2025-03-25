/* eslint-disable @typescript-eslint/no-explicit-any */

export type Fields<T> = {
  [K in keyof T]: FormField;
};

export interface Form<T> {
  fields: Fields<T>;
  isValid: Ref<boolean>;
}

export interface FormField {
  error: Ref<string>;
  id: string;
  isValid: Ref<boolean>;
  label: string;
  name: string;
  options?: any[];
  required: boolean;
  validationRules?: ValidationRules;
  value: Ref<string | string[]>;
}

export interface Inputs {
  [key: string]: {
    options?: any[];
    validationRules?: ValidationRules;
    value?: string | string[];
  };
}

export interface ValidationRules {
  isUrl?: boolean;
  required?: boolean;
}

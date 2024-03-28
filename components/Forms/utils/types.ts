/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ValidationRules {
  required?: boolean;
  isUrl?: boolean;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  required: boolean;
  value: Ref<string | string[]>;
  isValid: Ref<boolean>;
  error: Ref<string>;
  validationRules?: ValidationRules;
  options?: any[];
}

export type Fields<T> = {
  [K in keyof T]: FormField;
};

export interface Form<T> {
  fields: Fields<T>;
  isValid: Ref<boolean>;
}

export interface Inputs {
  [key: string]: {
    value?: string | string[];
    options?: any[];
    validationRules?: ValidationRules;
  };
}

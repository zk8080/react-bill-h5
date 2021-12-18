// rc-form没有ts版本，所以自定义类型
declare module "rc-form" {
  export const createForm: Function;
  export interface FormType {
    getFieldsValue: Function;
    getFieldValue: Function;
    getFieldInstance: Function;
    setFieldsValue: Function;
    setFields: Function;
    setFieldsInitialValue: Function;
    getFieldDecorator: Function;
    getFieldProps: Function;
    getFieldsError: Function;
    getFieldError: Function;
    isFieldValidating: Function;
    isFieldsValidating: Function;
    isFieldsTouched: Function;
    isFieldTouched: Function;
    isSubmitting: Function;
    submit: Function;
    validateFields: Function;
    resetFields: Function;
  }
  export type ValidateErrors = {
    [fieldName: string]: {
      errors: Array<{ message: string; field: string;[s: string]: any }>
    }
  } | null;
  export type ValidateValues = {
    [fieldName: string]: any
  };
}

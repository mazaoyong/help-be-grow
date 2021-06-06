// 原生标签不能传非标准属性，否则会有warning
// https://facebook.github.io/react/warnings/unknown-prop.html
const unknownProps = [
  // form
  'isDirty',
  'isTouched',
  'isPristine',
  'isValid',
  'isActive',
  'isAsyncValidated',
  'error',
  'errors',
  'validationError',
  'validationErrors',
  'validations',
  'validateOnChange',
  'validateOnBlur',
  'clearErrorOnFocus',
  'asyncValidation',
  'normalize',
  'format',
  'fields',
  'relatedFields',
  'submitFailed',
  'submitSuccess',
  // special
  'decimal',
  'max',
  'preValue',
];

export default unknownProps;
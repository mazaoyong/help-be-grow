// 错误提示
export const ERROR_HINT = {
  validations: {
    required: true,
  },
  validationErrors: {
    required: '该项不能为空',
  },
};
// 手机格式校验
export const PHONE_TEST = /^1[3-9]\d{9}$/;
// 身份证校验
export const ID_CARD_TEST = /((^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$))|(^\d\*{16}\w$)/;

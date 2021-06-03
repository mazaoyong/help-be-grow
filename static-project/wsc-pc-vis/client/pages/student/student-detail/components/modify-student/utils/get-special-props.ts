import get from 'lodash/get';
import slice from 'lodash/slice';
import { Validators } from 'zent';

import { DataType } from '../types';
import { PHONE_TEST, ID_CARD_TEST } from '../constant';

function getIdCardTestValidation() {
  const isIDCardError = '身份证格式错误';
  const isIDCardErrorValidator = value => {
    const isValidValue = value && ID_CARD_TEST.test(value);
    if (value && !isValidValue) {
      return {
        name: 'isIDCardError',
        message: isIDCardError,
      };
    }
    return null;
  };
  return isIDCardErrorValidator;
}

function getSpecialProps(field: Record<string, any>, remoteConfig: Record<string, any>) {
  const { dataType, watch, name } = field;
  const specialProps: Record<string, any> = { watch };
  switch (dataType) {
    case DataType.NUMBER:
      specialProps.showStepper = true;
    // eslint-disable-next-line no-fallthrough
    case DataType.TEXT:
      const TEXT_LIMITATION = get(remoteConfig, 'textLimit', 20);
      const NUMBER_LIMITATION = get(remoteConfig, 'numberLimit', 20);
      const CURRENT_LIMITATION = dataType === DataType.TEXT ? TEXT_LIMITATION : NUMBER_LIMITATION;

      if (CURRENT_LIMITATION) {
        const underLimitError = `输入字符最长为${CURRENT_LIMITATION}`;
        specialProps.validators = [Validators.maxLength(CURRENT_LIMITATION, underLimitError)];
      }
      if (name === 'edu_idCard') {
        specialProps.validators = [getIdCardTestValidation()];
      }
      break;
    case DataType.MULTI_SELECT:
      specialProps.tags = true;
      // 添加多选的校验
      if (field.required) {
        const isValidError = '请选择至少一个选项';
        const isValidSelectValue = (value: any) => {
          const isArrayType = Array.isArray(value) && value.length > 0;
          const isStringArrayType = typeof value === 'string' && value.split(',').length > 0;
          if (isArrayType || isStringArrayType) {
            return null;
          }
          return {
            name: 'isValidSelectValue',
            message: isValidError,
          };
        };
        specialProps.validators = [isValidSelectValue];
      }
      break;
    case DataType.ADDRESS:
    case DataType.PROVINCE:
      const isAddressError = '地址格式错误';
      const isValidAddress = (address: any) => {
        if (Array.isArray(address)) {
          const provincePart = slice(address, 0, 3);
          const streetPart = slice(address, -1);
          const street = get(streetPart[0], 'name');
          const hasStreet = dataType === DataType.PROVINCE ? true : !!street;
          const hasProvince = provincePart.every(val => get(val, 'code') !== undefined);

          const addressErrorCondition = hasStreet !== hasProvince; // 异或
          const hasError =
            dataType === DataType.ADDRESS ? addressErrorCondition : field.required && !hasProvince;
          if (hasError) {
            return {
              name: 'isValidAddress',
              message: isAddressError,
            };
          }
        }
        return null;
      };
      specialProps.asyncValidators = [isValidAddress];
      break;
    case DataType.PHONE:
      specialProps.value = (field.value || '').toString();
      if (field.required) {
        specialProps.validators = [Validators.pattern(PHONE_TEST, '手机号不合法')];
      }
      break;
    case DataType.IMAGE:
      specialProps.useRemote = true;
      break;
    case DataType.DATE:
      specialProps.disabledDate = field.disabledDate || (() => false);
      break;
    default:
      break;
  }
  return specialProps;
}

export default getSpecialProps;

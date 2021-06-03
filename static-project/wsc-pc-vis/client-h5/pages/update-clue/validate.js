import RulesCollection from './utils/validate-rules';
import DATATYPE from './enums';

/**
 * 用于校验某个适用场景下表单数据是否正确
 * ```typescript
 * interface result {
 *  items: {
 *    [key: string]: {
 *      isError: boolean,
 *      errorMsg: string,
 *    }
 *  };
 *  isHasError: boolean;
 * }
* ```
 *
 * @param {Array} form 待校验的form表单数据
 * @param {number} applicableScene 适用场景
 * @param {number} sourceId 线索来源
 * @return {{items: Object, isHasError: boolean}}
 */
export default function(form, applicableScene = 1, sourceId = 0) {
  const rules = new RulesCollection();
  if (!rules.isRequired(form)) {
    throw new Error('form can not be undefind or null or something make no meaning');
  }
  if (!Array.isArray(form)) {
    throw new Error('form must be array-type but get', typeof form);
  }

  const res = {
    items: {},
    isHasError: false,
  };

  form.forEach(item => {
    const {
      dataType,
      attributeTitle,
      attributeId,
      attributeKey,
      value,
      needFill,
      validations,
      validationErrors,
    } = item;
    // 线索管理中，线索来源不能为空
    if (item === 'source') {
      if (sourceId === 0) {
        res.isHasError = true;
        res.items[item] = {
          isError: true,
          errorMsg: '线索来源不能为空',
        };
      }
      return void 0;
    }
    const name = attributeKey || attributeId;
    res.items[name] = {
      isError: false,
      errorMsg: undefined,
    };
    if (needFill) {
      if (!rules.isRequired(value)) {
        res.isHasError = true;
        res.items[name] = {
          isError: true,
          errorMsg: `${attributeTitle}不能为空`,
        };
        return void 0;
      }
    }

    if (value !== undefined && value !== null && value !== '') {
      // if (dataType === DATATYPE.customProfileType.TEXT ||
      //   dataType === DATATYPE.customProfileType.NUMBER) {
      //   if (String(value).length > 20) {
      //     res.isHasError = true;
      //     res.items[name] = {
      //       isError: true,
      //       errorMsg: '不能超过20个字符',
      //     };
      //   }
      // }
      if (dataType === DATATYPE.customProfileType.ADDRESS ||
        dataType === DATATYPE.customProfileType.PROVINCE) {
        if (Array.isArray(value) && value.length === 0) {
          return void 0;
        }
        if (!rules.isValidAddress(value, dataType === DATATYPE.customProfileType.ADDRESS ? 4 : 3)) {
          res.isHasError = true;
          res.items[name] = {
            isError: true,
            errorMsg: '地址格式错误',
          };
          return void 0;
        }
      } else if (dataType === DATATYPE.customProfileType.PHONE) {
        if (!rules.isPhone(value)) {
          res.isHasError = true;
          res.items[name] = {
            isError: true,
            errorMsg: '手机格式错误',
          };
          return void 0;
        }
      }
      // 如果有自定义规则集就进行检测
      const validationMethods = Object.keys(validations || {});
      if (validationMethods.length) {
        let firstErrorMsg;
        const isError = !validationMethods.every(methodName => {
          // 先去找规则集中，是否有这个校验规则，如果没有，用自定义的规则
          const res = (rules[methodName] || validations[methodName])(value);
          if (typeof res !== 'boolean') {
            throw new Error(`validation method must be return a boolean type value, but method ${methodName} returned ${typeof res}`);
          }
          if (!res) {
            firstErrorMsg = validationErrors[methodName] || '检测不通过';
          }
          return res;
        });
        if (isError) {
          res.isHasError = true;
          res.items[name] = {
            isError: true,
            errorMsg: firstErrorMsg,
          };
          return void 0;
        }
      }
    }
  });

  return res;
};

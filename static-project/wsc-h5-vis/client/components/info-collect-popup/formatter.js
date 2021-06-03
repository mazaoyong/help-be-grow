import { TYPE_ENUMS } from '@youzan/vis-ui/es/dynamic-form';
import get from 'lodash/get';

/** 验证码外置，合并入资料项内 */
export function formatAttributeWithCaptcha(items = [], needVerifyCode) {
  let itemArray = [];
  let captchaCofig = {
    name: 'captcha',
    slotName: 'withLabel',
  };

  items.length > 0 && items.forEach((item, index) => {
    if (item.attributeKey === 'edu_stuName') {
      itemArray.push(item);
    } else if (item.attributeKey === 'edu_stuContractPhone') {
      itemArray.push(item);
      if (needVerifyCode) {
        Object.assign(captchaCofig, item);
        delete captchaCofig.validations;
        delete captchaCofig.type;
        captchaCofig.dataType = 10;
        captchaCofig.attributeKey = 'captcha';
        captchaCofig.label = '验证码';
        captchaCofig.attributeTitle = '验证码';
        captchaCofig.validations = {
          minLength: 6,
        };
        itemArray.push(captchaCofig);
      }
    } else {
      itemArray.push(item);
    }
  });
  return itemArray;
};

/** 获取提交的信息 */
export function formatSubmitAttributeWithCaptcha(setting, values) {
  const converAddressLike = (value, dataType) => {
    let currentValue = '';
    if (Array.isArray(value)) {
      let tempValue = value;
      if (dataType === TYPE_ENUMS.PROVINCE) {
        tempValue = value.slice(0, 3);
      }
      currentValue = JSON.stringify(tempValue);
    }
    return currentValue;
  };

  const converMultiSelect = (value) => {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return '';
  };

  const collectInfoValues = values;
  const collectInfoSetting = setting || [];

  let attributeItems = [];
  let verifyCode = '';
  const collectInfoValueKeys = Object.keys(collectInfoValues);
  if (collectInfoValueKeys.length > 0 && Array.isArray(collectInfoSetting)) {
    collectInfoValueKeys.forEach(standardKey => {
      const settingOfCurrentKey = collectInfoSetting.find(setting => {
        return (
          setting.attributeKey === standardKey ||
          String(setting.attributeId) === standardKey
        );
      });

      if (get(settingOfCurrentKey, 'attributeKey', '') === 'captcha') {
        verifyCode = collectInfoValues['captcha'];
      }

      if (settingOfCurrentKey !== undefined) {
        const { attributeId, dataType, attributeKey,
          createdAt, attributeTitle } = settingOfCurrentKey;
        let value = collectInfoValues[standardKey];

        if (!['captcha', 'withLabel'].includes(attributeKey)) {
          switch (dataType) {
            case TYPE_ENUMS.ADDRESS:
            case TYPE_ENUMS.PROVINCE:
              value = converAddressLike(value, dataType);
              break;
            case TYPE_ENUMS.MULTISELECT:
              value = converMultiSelect(value);
              break;
            default:
              break;
          }

          attributeItems.push({
            attributeId,
            attributeKey,
            createdAt,
            attributeTitle,
            value,
          });
        }
      }
    });
  }

  return {
    attributeItems,
    verifyCode,
    values,
  };
};

/* eslint-disable jsdoc/require-returns */
import { TYPE_ENUMS } from '@youzan/vis-ui/es/dynamic-form';
import {
  differenceInMonths,
  differenceInYears,
  differenceInCalendarDays,
  subDays,
  addYears,
  addMonths,
} from 'date-fns';
import get from 'lodash/get';

const DEFAULT_LIMITATION = 20;
const REFILL_KEY_MAP = {
  edu_stuName: 'name',
  edu_stuContractPhone: 'mobile',
  edu_stuContractWeChat: 'weiXin',
  edu_stuSex: 'gender',
};

export function appendSpecificPropertyByPath(
  profile,
  propertyName,
  firstPath,
  secondPath,
) {
  const firstValue = get(profile, firstPath);
  const secondValue = get(profile, secondPath);
  const value = isNotUndefinedAndEmptyStr(firstValue)
    ? firstValue
    : secondValue;
  profile[propertyName] = value;
}

export function appendRequiredProperty(profile) {
  profile.required = profile.needFill;
}

export function appendOptionsProperty(profile) {
  const { type, attrItem } = profile;
  if (type === TYPE_ENUMS.SINGLESELECT || type === TYPE_ENUMS.MULTISELECT) {
    profile.options = attrItem.map(item => ({
      text: item.value,
      value: String(item.id),
    }));
  }
}

export function appendPlaceholderProperty(profile, params) {
  const { remoteConf } = params;
  const settings = Object.keys(remoteConf);
  if (!profile.placeholder && settings.length) {
    const placeholderSettingStr = get(remoteConf, 'placeholders');
    if (isNotUndefinedAndEmptyStr(placeholderSettingStr)) {
      try {
        const { type } = profile;
        const placeholderSetting = JSON.parse(placeholderSettingStr);
        profile.placeholder = get(placeholderSetting, `[${type}]`);
      } catch (e) {}
    }
  }
}

export function appendLimitationProperty(profile, params) {
  let limitation = DEFAULT_LIMITATION;
  const { remoteConf } = params;
  const settings = Object.keys(remoteConf);
  if (settings.length) {
    const { type } = profile;
    switch (type) {
      case TYPE_ENUMS.TEXT:
        limitation = get(remoteConf, 'textLimit', DEFAULT_LIMITATION);
        profile.maxLength = limitation;
        if (!profile.placeholder) {
          profile.placeholder = `${limitation}个字以内`;
        }
        break;
      case TYPE_ENUMS.NUMBER:
        limitation = get(remoteConf, 'numberLimit', DEFAULT_LIMITATION);
        profile.maxLength = limitation;
        if (!profile.placeholder) {
          profile.placeholder = `${limitation}个数字以内`;
        }
        break;
      default:
        break;
    }
  }
}

export function appendDefaultValue(profile, defaultValues, collectInfoCacheValue) {
  const { attributeKey, attributeId } = profile;
  const refillDataKey = REFILL_KEY_MAP[attributeKey];
  const curReflectValue = defaultValues[refillDataKey] || '';
  const curDefaultValue =
    defaultValues[attributeKey] || defaultValues[attributeId] || '';
  const cacheValue =
    collectInfoCacheValue[attributeKey] ||
    collectInfoCacheValue[attributeId] ||
    '';

  if (isNotNullOrUndefined(curDefaultValue)) {
    profile.value = curReflectValue || curDefaultValue || cacheValue;
  }
}

export function appendPhoneValidation(profile) {
  const { dataType } = profile;
  if (dataType === TYPE_ENUMS.PHONE) {
    profile.validations = { isPhone: true };
  }
}

export function setRelationBetweenBirthdayAndAge(profiles) {
  const birthdayConfig = profiles.find(
    profile => profile.attributeKey === 'edu_stuBirth'
  );
  const ageConfig = profiles.find(
    profile => profile.attributeKey === 'edu_stuAge'
  );
  if (birthdayConfig !== undefined) {
    setBirthdayFieldProps(birthdayConfig);

    if (ageConfig !== undefined) {
      birthdayConfig.valueChange = function(values) {
        const newValues = Object.assign({}, values, {
          edu_stuAge: getAge(values.edu_stuBirth),
        });
        return newValues;
      };

      setAgeFieldProps(ageConfig);
    }
  }
}

function isNotUndefinedAndEmptyStr(value) {
  return value !== '' && isNotNullOrUndefined(value);
}

function isNotNullOrUndefined(value) {
  return value !== undefined && value !== null;
}

function setAgeFieldProps(ageConfig) {
  ageConfig.placeholder = '选择生日后自动计算';
  ageConfig.disabled = true;
}

function setBirthdayFieldProps(birthdayConfig) {
  birthdayConfig.maxDate = subDays(new Date(), 1);
}

/**
 * 获取多少岁
 * 产品需求：年龄=[0,4)岁的学员，年龄显示精准到几岁几个月；4岁及以上的学员，可以只显示几岁。
 * 计算思路：先算出相隔年数；然后给生日加上对应的年数后，计算相隔的月数；然后给生日加上对应的月数后，计算相隔的天数
 *
 * @param {*} birthday
 */
function getAge(birthday) {
  const now = new Date();
  const yearAge = differenceInYears(now, birthday);
  if (yearAge >= 4) {
    return `${yearAge}岁`;
  } else {
    const afterAddYears = addYears(birthday, yearAge);
    const monthAge = differenceInMonths(now, afterAddYears);
    const afterAddMonths = addMonths(afterAddYears, monthAge);
    const dayAge = differenceInCalendarDays(now, afterAddMonths);
    let ageDesc = '';
    if (yearAge >= 1) {
      ageDesc = `${yearAge}岁`;
    }

    if (monthAge >= 1) {
      ageDesc += `${monthAge}个月`;
    }
    if (yearAge < 1 && monthAge < 1 && dayAge >= 1) {
      ageDesc += `${dayAge}天`;
    }
    return ageDesc;
  }
}

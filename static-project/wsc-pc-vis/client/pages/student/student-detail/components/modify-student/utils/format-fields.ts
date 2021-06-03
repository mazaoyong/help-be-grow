import { get, find, some } from 'lodash';
import {
  differenceInMonths,
  differenceInYears,
  differenceInCalendarDays,
  addYears,
  addMonths,
} from 'date-fns';

import { IProfileField, DataType } from '../types';

export default function(
  fields: Record<string, any>[],
  applicableScene: number,
): IProfileField[] {
  let duplicateFields: IProfileField[] = [];
  const birthdayConf = find(fields, { attributeKey: 'edu_stuBirth' });
  const ageConf = find(fields, { attributeKey: 'edu_stuAge' });
  const hasRelativeAge = birthdayConf && ageConf;
  duplicateFields = fields.map(field => {
    if (!field) {
      throwError('field不能为空');
    }
    let addonProperties: IProfileField = {
      name: '',
      label: '',
      defaultValue: '',
      dataType: 0,
    };
    const { dataType, attributeTitle, attributeKey } = field;
    addonProperties.dataType = dataType;
    addonProperties.label = attributeTitle || throwError('找不到attributeTitle');
    addonProperties.name =
      getName(field) ||
      throwError('找不到可以用来作为自定义资料项的name，可能缺少attributeKey|attributeId');
    addonProperties.defaultValue = getDefaultValue(field);
    addonProperties.required = getRequired(field, applicableScene);
    if (dataType === DataType.SELECT || dataType === DataType.MULTI_SELECT) {
      addonProperties.options = getOptions(field);
    }
    if (attributeKey === 'edu_stuBirth') {
      addonProperties.disabledDate = (dateObj) => {
        return dateObj.getTime() > Date.now();
      };
    }
    // 处理学员生日和年龄的特殊逻辑
    if (hasRelativeAge && attributeKey === 'edu_stuAge') {
      addonProperties.disabled = true;
      addonProperties.placeholder = '选择生日后自动计算';
      addonProperties.defaultValue = '';
      addonProperties.watch = [
        {
          dep: 'edu_stuBirth',
          fn(birthday, form) {
            const age = getAge(birthday);
            form.patchValue({ edu_stuAge: age });
          },
        },
      ];
    }
    return addonProperties;
  });

  return duplicateFields;
}

// 获取多少岁

/**
 * 获取多少岁
 * 产品需求：年龄=[0,4)岁的学员，年龄显示精准到几岁几个月；4岁及以上的学员，可以只显示几岁。
 * 计算思路：先算出相隔年数；然后给生日加上对应的年数后，计算相隔的月数；然后给生日加上对应的月数后，计算相隔的天数
 *
 * @param {*} birthday
 * @return {String}
 */
export function getAge(birthday) {
  if (!birthday) {
    return '';
  }

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
    if (yearAge < 1 && monthAge < 1 && dayAge < 1) {
      ageDesc += '0岁';
    }
    return ageDesc;
  }
}

function throwError(msg: string) {
  throw new Error(msg);
}

function getOptions(field: Record<string, any>): IProfileField['options'] {
  const attributeItems: Array<{ id: number; value: any }> = get(field, 'attrItem');
  if (attributeItems) {
    return attributeItems.map(item => ({
      text: item.value,
      value: String(item.id),
    }));
  }
  return [];
}

function getName(field: Record<string, any>): IProfileField['name'] | undefined {
  const { attributeKey, attributeId } = field;
  return attributeKey || (attributeId as number).toString() || undefined;
}

function getDefaultValue(
  field: Record<string, any>,
): IProfileField['defaultValue'] {
  const DEFAULT_VALUE = {
    [DataType.PROVINCE]: new Array(4).fill({}),
    [DataType.ADDRESS]: new Array(4).fill({}),
    [DataType.MULTI_SELECT]: [],
    [DataType.GENDER]: '1',
  };
  const { dataType } = field;

  return DEFAULT_VALUE[dataType] || undefined;
}

function getRequired(
  field: Record<string, any>,
  applicableScene: number,
): Required<IProfileField>['required'] {
  const { attributeTitle } = field;
  if (applicableScene === 0) {
    // 如果适用场景数值为0
    const hasError = some(get(field, 'applicableScenes', []), rowData => get(rowData, 'required', false));
    return hasError && `${attributeTitle || '该资料项'}不能为空`;
  } else {
    const currentApplicableScene = find(get(field, 'applicableScenes', []), { applicableScene });
    if (currentApplicableScene) {
      const isRequired = currentApplicableScene.required || false;
      return isRequired && `${attributeTitle || '该资料项'}不能为空`;
    }
  }
  return false;
}

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import find from 'lodash/find';
import {
  differenceInCalendarMonths,
  differenceInCalendarYears,
  differenceInCalendarDays,
} from 'date-fns';

import { IProfileField, DataType, ObjectLike, idCardTest } from '../index';

// 获取多少岁
export function getAge(birthday) {
  const now = new Date();
  const yearAge = differenceInCalendarYears(now, birthday);
  if (yearAge >= 1) {
    return `${yearAge}岁`;
  }
  const monthAge = differenceInCalendarMonths(now, birthday);
  if (monthAge >= 1) {
    return `${monthAge}个月`;
  }
  const dayAge = differenceInCalendarDays(now, birthday);
  if (dayAge >= 1) {
    return `${dayAge}天`;
  } else {
    return `0岁`;
  }
}

function throwError(msg: string) {
  throw new Error(msg);
}

function getOptions(field: IProfileField): IProfileField['options'] {
  const attributeItems: Array<{ id: number; value: any }> = get(field, 'attrItem');
  if (attributeItems) {
    return attributeItems.map(item => ({
      text: item.value,
      value: String(item.id),
    }));
  }
  return [];
}

function getName(field: IProfileField): IProfileField['name'] | undefined {
  const { attributeKey, attributeId } = field;
  return attributeKey || (attributeId as number).toString() || undefined;
}

function getValue(field: IProfileField, initialValue: ObjectLike[]): IProfileField['value'] {
  const DEFAULT_VALUE = {
    '3': [],
    '6': [],
    '8': [],
  };
  const { reflect, attributeId, dataType } = field;
  let { value } = field;

  const defaultValue = DEFAULT_VALUE[dataType] || undefined;
  const valueObject = find(initialValue, { attributeId });
  // 可能因为上一次更新的时候数据没有拉到，导致更新了一个默认值上去，从而时line: 57判断出错
  if (dataType === DataType.ADDRESS || dataType === DataType.PROVINCE) {
    if (Array.isArray(value) && value.length === 0) {
      value = '';
    }
  }
  if (dataType === DataType.MULTI_SELECT && valueObject) {
    const val = valueObject.value || '';
    if (typeof val === 'string') {
      value = (valueObject.value || '').split(',').map(v => String(v));
    } else {
      value = [];
    }
  }
  const val = value || (valueObject && (valueObject.value || '')) || defaultValue;
  if (reflect) {
    // 如果配置项设置了映射，并且映射为函数类型，将该函数返回的值作为value对comp进行初始化
    return reflect(val);
  }
  return val;
}

function getRequired(
  field: IProfileField,
  applicableScene: number,
): Required<IProfileField>['required'] {
  const currentApplicableScene = find(get(field, 'applicableScenes', []), { applicableScene });
  if (currentApplicableScene) {
    return currentApplicableScene.required || false;
  }
  return false;
}
export function formatAddress(
  address: [Array<{ code: string; name: string } | undefined>, string | undefined],
  getSource: boolean,
): [any[], string] {
  const provincePart = address[0];
  const streetPart = address[1] || '';
  if (provincePart.length === 0) {
    return [[] as any, streetPart];
  }
  if (getSource) {
    const provinces = provincePart;
    return [provinces, streetPart];
  } else {
    const provinces = provincePart.map(item => (item ? item.code : '0'));
    return [provinces, streetPart];
  }
}

export default function(
  fields: IProfileField[],
  initialValue: ObjectLike[],
  applicableScene: number,
): IProfileField[] {
  let duplicateFields = cloneDeep(fields);
  const birthdayConf = duplicateFields.filter(field => field.attributeKey === 'edu_stuBirth')[0];
  if (birthdayConf) {
    birthdayConf.value = getValue(birthdayConf, initialValue);
    birthdayConf.disabledDate = (dateObj) => {
      return dateObj.getTime() > Date.now();
    };
  }
  duplicateFields = duplicateFields.map(field => {
    if (!field) {
      throwError('field不能为空');
    }
    const { dataType, attributeTitle, attributeKey } = field;
    field.label = attributeTitle || throwError('找不到attributeTitle');
    field.name =
      getName(field) ||
      throwError('找不到可以用来作为自定义资料项的name，可能缺少attributeKey|attributeId');
    field.value = getValue(field, initialValue);
    field.required = getRequired(field, applicableScene);
    if (dataType !== undefined) {
      if (dataType === DataType.SELECT || dataType === DataType.MULTI_SELECT) {
        field.options = getOptions(field);
      }
    }
    // 身份证需要加上校验
    if (attributeKey === 'edu_idCard') {
      field.validations = Object.assign(
        {},
        {
          isIDCard(_, value) {
            return !value || idCardTest.test(value);
          },
        },
        field.validations || {},
      );
      field.validationErrors = Object.assign(
        {},
        {
          isIDCard: '身份证格式错误',
        },
        field.validationErrors || {},
      );
      // 配置校验时机
      field.validateOnChange = false;
    }
    if (birthdayConf && attributeKey === 'edu_stuAge') {
      field.disabled = true;
      field.placeholder = '选择生日后自动计算';
      field.value = getAge(get(birthdayConf, 'value'));
      // 🌺后端其实会返回年龄信息，不需要自己手动计算回填
      // const birthday = getValue(birthdayConf, initialValue);
      // if (birthday) {
      //   field.value = getAge(birthday);
      // }
    }
    return field;
  });

  return duplicateFields;
}

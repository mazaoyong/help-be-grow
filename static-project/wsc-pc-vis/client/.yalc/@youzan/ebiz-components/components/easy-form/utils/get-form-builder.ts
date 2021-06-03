import { FieldArrayBuilder, FieldBuilder, FieldSetBuilder, Form } from 'zent';
import isNil from 'lodash/isNil';
import get from 'lodash/get';

import { invariant } from './invariant';
import { EasyFormConfigType, EasyFormStatusModelType } from '../types';

interface IGetModelBuilder {
  name: string;
  type: 'normal' | 'group' | 'list';
  model: FieldSetBuilder<any> | FieldArrayBuilder<any> | FieldBuilder<any>;
  status: FieldSetBuilder<any> | FieldBuilder<any>;
}
interface IEasyFormStruct {
  value: Record<string, IGetModelBuilder['model']>;
  status: Record<string, IGetModelBuilder['status']>;
}
interface IGetFormBuilderConfig {}
const { form, field, set, array } = Form;
/**
 * 根据config构建form所需的form model
 */
export const getFormBuilder = (
  config: EasyFormConfigType[],
  _fieldConfig: IGetFormBuilderConfig
) => {
  const formRawBuilder: IEasyFormStruct = {
    value: {},
    status: {},
  };
  if (config.length) {
    config.forEach((fieldConfig) => {
      checkRequiredProps(fieldConfig);
      const { name, model, status } = getModelBuilder(fieldConfig);
      formRawBuilder.value[name] = model;
      formRawBuilder.status[name] = status;
    });
  }
  return {
    value: form(formRawBuilder.value),
    status: form(formRawBuilder.status),
  };
};

function getModelBuilder(fieldConfig: EasyFormConfigType): IGetModelBuilder {
  if (fieldConfig.type === '__internal_group__' || fieldConfig.type === '__internal_list__') {
    // 如果是需要渲染成数组或者是set
    if (fieldConfig.type === '__internal_group__') {
      invariant(
        () => fieldConfig.config.length > 0,
        '使用set方法构造form字段集合必须声明config属性并且config不能为空'
      );
      const innerGroupModelBuilder = fieldConfig.config.map(getModelBuilder);
      const fieldStatusModel: Record<string, any> = {};
      const fieldModels: Record<string, any> = {};
      innerGroupModelBuilder.forEach((model) => {
        fieldModels[model.name] = model.model;
        fieldStatusModel[model.name] = model.status;
      });
      return {
        type: 'group',
        name: fieldConfig.groupName,
        model: set(fieldModels),
        status: set({
          self: field(initModelStatus(fieldConfig)),
          ...fieldStatusModel,
        }),
      };
    } else {
      const listInnerModelBuilder = getModelBuilder(fieldConfig.repeatConfig);
      invariant(
        () => listInnerModelBuilder.type !== 'list',
        'EasyForm中两个list构造函数不能互相嵌套，如果执意如此，请使用Custom自行构造Field'
      );
      const { repeatConfig } = fieldConfig;
      invariant(() => !isNil(repeatConfig), 'list的repeatConfig属性不能为空');
      return {
        type: 'list',
        name: fieldConfig.listName,
        model: array(listInnerModelBuilder.model).defaultValue([initModelValue(repeatConfig)]),
        status: field(initModelStatus(repeatConfig)),
      };
    }
  } else {
    return {
      type: 'normal',
      name: fieldConfig.name,
      model: field(initModelValue(fieldConfig)),
      status: field(initModelStatus(fieldConfig)),
    };
  }
}

export function initModelValue(config: EasyFormConfigType) {
  return config.defaultValue || '';
}

function initModelStatus(config: any) {
  return {
    visible: get(config, 'visible', true),
    disabled: get(config, 'disabled', false),
    ...get(config, 'inheritProps', {}),
  };
}

function wrapValidator(validator: any, statusModel: EasyFormStatusModelType) {
  return (value: any, ctx: any) => {
    if (statusModel && !statusModel.getRawValue().visible) return null;
    return validator(value, ctx);
  };
}
/** 需要包裹一下，防止invisible的model被校验 */
export function initValidators(
  validators: EasyFormConfigType['validators'],
  statusModel: EasyFormStatusModelType
) {
  return (validators || []).map((validator) => wrapValidator(validator, statusModel));
}

function checkRequiredProps(config: EasyFormConfigType) {
  invariant(() => !isNil(config.name), 'EasyForm.config[x].name不能为空');
  invariant(() => !isNil(config.type), 'EasyForm.config[x].type不能为空');
  invariant(
    () => !(config.type === 'Custom' && isNil(config.renderField)),
    '自定义类型必须要声明renderField属性'
  );
}

// 从配置项中获取到modelBuilder
import { Form, FieldBuilder } from 'zent';
import get from 'lodash/get';

import {
  ICombinedFilterConf,
  ReservedType,
  IFilterProps,
  IStatusType,
  IFilterModelUnion,
} from '../../../types/filter';

const { form, field } = Form;
const valueType: Partial<Record<ReservedType, any>> = {
  DateRangeQuickPicker: [], // [[startTime, endTime], string],
};

export default function getModelFromConf(conf: IFilterProps['config']) {
  const formBuilder: Record<string, FieldBuilder<IFilterModelUnion>> = {};
  // 支持group分组的方式渲染model
  conf.forEach((c) => {
    if (!Array.isArray(c)) {
      const { name, model } = mapFieldValue(c);
      formBuilder[name] = model;
    } else {
      const configGroup = c;
      configGroup.forEach((ci) => {
        const { name, model } = mapFieldValue(ci);
        formBuilder[name] = model;
      });
    }
  });

  return form(formBuilder);
}

function mapFieldValue(conf: ICombinedFilterConf) {
  const { name, type, inheritProps } = conf;
  // 初始值的使用熟顺序
  // Filter组件props的value -> config.defaultValue -> 规定的默认类型
  const typeDefaultValue = get(valueType, type, '');
  const union = {
    fieldValue: get(conf, 'defaultValue', typeDefaultValue),
    status: {
      disabled: conf.disabled || get(inheritProps, 'disabled', false),
      visible: get(conf, 'visible', true),
    },
    props: inheritProps || {},
  };
  return {
    name,
    model: field<IFilterModelUnion>(union),
  };
}

const DEFAULT_STATUS: IStatusType = { visible: true, disabled: false };
const DEFAULT_PROPS = {};
interface IResponse {
  values: Record<string, any>;
  status: Record<string, IStatusType>;
  props: Record<string, any>;
}
export function splitValuesFromModel(
  models: Record<string, IFilterModelUnion>,
  updateStatus?: Record<string, Omit<IFilterModelUnion, 'fieldValue'>>
): IResponse {
  const keys = Object.keys(models);
  const res: IResponse = {
    values: {},
    status: {},
    props: {},
  };

  if (keys.length) {
    keys.forEach((key) => {
      const curModel = models[key];
      const curUpdateStatus = get(updateStatus, key, {
        status: DEFAULT_STATUS,
        props: DEFAULT_PROPS,
      });
      if (curModel) {
        const { fieldValue, status, props } = curModel;
        res.values[key] = fieldValue;
        res.status[key] = {
          ...curUpdateStatus.status,
          ...status,
        };
        res.props[key] = {
          ...curUpdateStatus.props,
          ...props,
        };
      }
    });
  }

  return res;
}

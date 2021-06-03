import React from 'react';
import get from 'lodash/get';

import {
  EasyFormConfigType,
  EasyFormConfigLabel,
  EasyFormInternalGroupType,
  EasyFormInternalListType,
} from '../types';
import { getFormBuilder } from '../utils/get-form-builder';
import { invariant } from '../utils/invariant';

interface IUseFormConfigProps {
  config: EasyFormConfigType[];
  overrideConfigs: any;
}
export const useFormConfigs = (params: IUseFormConfigProps) => {
  const { config, overrideConfigs } = params;
  /** 转存config，确保config只被调用一次 */
  const [dumpConfig] = React.useState(config);
  const [dumpOverrideCfg] = React.useState(overrideConfigs);

  const decoratedConfigs = React.useMemo(() => {
    return dumpConfig.map((fieldConfig) => {
      if (fieldConfig.type === 'Plain') return fieldConfig;
      const tempOverrideConfig = get(dumpOverrideCfg, fieldConfig.name, {});
      if (fieldConfig.type === '__internal_group__') {
        checkInternalType(fieldConfig);
        return formatGroupConfig(fieldConfig, tempOverrideConfig);
      } else if (fieldConfig.type === '__internal_list__') {
        checkInternalType(fieldConfig);
        return formatListConfig(fieldConfig, tempOverrideConfig);
      }
      return formatFieldConfig({ overrideConfig: tempOverrideConfig })(fieldConfig);
    });
  }, [dumpConfig, dumpOverrideCfg]);

  // 真正参与渲染的config不包含type=Plain的
  const formConfigs = React.useMemo(
    () => decoratedConfigs.filter((config) => config.type !== 'Plain') as EasyFormConfigType[],
    [decoratedConfigs]
  );

  const { value: valueBuilder, status: statusBuilder } = React.useMemo(
    () => getFormBuilder(formConfigs, {}),
    [formConfigs]
  );

  return {
    valueBuilder,
    statusBuilder,
    decoratedConfigs,
    formConfigs,
  };
};

function checkInternalType(internalConfig: any) {
  invariant(
    () => {
      if (!Object.getOwnPropertySymbols) return true;
      const internalSymbol = Symbol.for('internal');
      return Object.getOwnPropertySymbols(internalConfig).includes(internalSymbol);
    },
    `请使用list或者group函数包裹，不要直接使用带有__internal前缀的类型
[ERROR CONFIG]
${JSON.stringify(internalConfig, null, 4)}`
  );
}

function formatGroupConfig(groupConfig: EasyFormInternalGroupType, overrideConfig: any) {
  const { config: overrideInnerConfigs, ...otherConfig } = overrideConfig;
  const newGroupConfig: EasyFormInternalGroupType = {
    ...groupConfig,
    ...otherConfig,
    groupName: groupConfig.groupName,
    name: groupConfig.name,
  };
  const keyIdxMap: Record<string, number> = {};
  if (Array.isArray(overrideInnerConfigs) && overrideInnerConfigs.length) {
    overrideInnerConfigs.forEach((config, index) => (keyIdxMap[config.name] = index));
  }
  // 如果是group类型，需要改写一下config属性
  newGroupConfig.config = newGroupConfig.config.map((fieldConfig) => {
    const curIndex = keyIdxMap[fieldConfig.name];
    const overrideFieldConfig =
      curIndex !== undefined ? get(overrideInnerConfigs, `[${curIndex}]`, {}) : {};
    return formatFieldConfig({ overrideConfig: overrideFieldConfig })(fieldConfig);
  });
  return newGroupConfig;
}

function formatListConfig(listConfig: EasyFormInternalListType, overrideConfig: any) {
  const { repeatConfig: overrideRepeatConfig, ...otherConfig } = overrideConfig;
  const newListConfig: EasyFormInternalListType = {
    ...listConfig,
    ...otherConfig,
    listName: listConfig.listName,
    name: listConfig.name,
  };
  if (overrideRepeatConfig) {
    newListConfig.repeatConfig = formatFieldConfig({
      overrideConfig: overrideRepeatConfig,
    })(listConfig.repeatConfig);
  }
  return newListConfig;
}

interface IFormatFieldParams {
  overrideConfig?: Record<string, any>;
}
function formatFieldConfig(params: IFormatFieldParams) {
  const { overrideConfig } = params;
  return (fieldConfig: EasyFormConfigType) => {
    const narrowMeldConfig: EasyFormConfigType = {
      /** default values */
      fieldProps: {},
      ...fieldConfig,
      /** override configs */
      ...overrideConfig,
    };
    return narrowMeldConfig;
  };
}

interface IDecoratedLabelProps {
  fieldName?: string;
  addColon?: boolean;
  filedIndex?: number;
}
export function getDecoratedLabel(
  label: EasyFormConfigLabel | undefined,
  params: IDecoratedLabelProps
) {
  const { addColon = false, fieldName, filedIndex = 0 } = params;
  // @ts-ignore
  let _label: string = label;
  if (fieldName && typeof label === 'function') {
    _label = label(fieldName, filedIndex);
  }
  if (!_label) return undefined;
  if (!addColon) return _label;
  const hasColon = /[:：]$/.test(_label);
  return !hasColon ? _label + '：' : _label;
}

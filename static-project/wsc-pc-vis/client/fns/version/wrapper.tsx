import { ReactElement, isValidElement, cloneElement } from 'react';
import { IWrapperProps, TWrapper, IArrayConfig, IComponentConfig, IObjectConfig } from './types';
import { basicVersionConfig, proVersionConfig } from './config';
import { isObject, pick, omit, get, cloneDeep } from 'lodash';

const VersionWrapper: (props: IWrapperProps) => TWrapper = (props) => {
  const version = _global.versionStatus || {}; // todo: 获取版本信息；
  const config = version.versionCode === 'edu_base_version' ? basicVersionConfig[props.name] : proVersionConfig[props.name];
  if (config) {
    const configs: any = (props.downgrade && props.downgrade.from) ? config.downgradeConfigs : config.configs;
    switch (config.type) {
      case 'array':
        return arrayWrapper(configs, props.children as any[]);
      case 'component':
        return componentWrapper(configs, props.children as ReactElement);
      case 'object':
        return objectWrapper(configs, props.children as Record<string, any>);
    }
  }

  return props.children;
};

// 处理数组类型
const arrayWrapper: (configs: IArrayConfig['configs'], children: any[]) => any[] = (configs, children) => {
  if (configs && Array.isArray(children)) {
    let calChildren = [...children];
    configs.map(subConfig => {
      const { key = 'index', filter = 'include', value = [] } = subConfig;
      if (key === 'index') { // 按照下标过滤
        calChildren = calChildren.filter((_, index) => filter === 'include' ? value.includes[index] : !value.includes[index]);
      } else {
        calChildren = calChildren.filter((item) => { // 按照key，value键值对过滤
          const isInclude = value.some(config => Object.keys(config).some(key => config[key] === item[key]));
          return filter === 'include' ? isInclude : !isInclude;
        });
      }
    });
    return calChildren;
  }

  return children;
};

// 处理组件类型
const componentWrapper: (configs: IComponentConfig['configs'], children: ReactElement) => ReactElement | null =
(configs, children) => {
  if (configs) {
    let calChildren: ReactElement | ReactElement[] | null = children;
    configs.map(subConfig => {
      const { key = 'show', value = true } = subConfig;
      if (key === 'switch') { // 不同版本不同组件
        calChildren = Array.isArray(calChildren) ? calChildren.find(item => {
          const componentType = get(item, 'type');
          const componentName = typeof componentType === 'string' ? componentType : get(item, 'type.name') || '';
          return componentName === value;
        }) || calChildren : calChildren;
      } else if (key === 'attribute') {
        if (isValidElement(calChildren) && isObject(value)) {
          calChildren = cloneElement(calChildren, { ...calChildren.props, ...value });
        }
      } else { // 不同版本显示与否
        calChildren = value ? calChildren : null;
      }
    });
    return calChildren;
  }
  return children;
};

// 处理对象类型
const objectWrapper: (configs: IObjectConfig['configs'], children: Record<string, any>) => Record<string, any> =
(configs, children) => {
  if (configs && isObject(children)) {
    let calChildren = cloneDeep(children);
    configs.map(subConfig => {
      const { filter = 'include', value = [] } = subConfig;
      calChildren = filter === 'include' ? pick(calChildren, value) || {} : omit(calChildren, value) || {};
    });
    return calChildren;
  }

  return children;
};

export default VersionWrapper as any;

import { ReactElement } from 'react';

export type TWrapper = any[] | Record<string, any> | ReactElement | null;

interface IArrayConfigData {
  key: 'index' | 'key';
  filter?: 'include' | 'omit';
  value: number[] | Record<string, any>[];
}

interface IComponentConfigData {
  key: 'show' | 'switch' | 'attribute';
  value: string | boolean | Record<string, any>;
}

interface IObjectConfigData {
  key?: 'reduce';
  filter?: 'include' | 'omit';
  value: string[];
}

export interface IArrayConfig {
  type: 'array';
  desc: string;
  configs: IArrayConfigData[];
  downgradeConfigs?: IArrayConfigData[];
};

export interface IComponentConfig {
  type: 'component';
  desc: string;
  configs: IComponentConfigData[];
  downgradeConfigs?: IComponentConfigData[];
};

export interface IObjectConfig {
  type: 'object';
  desc: string;
  configs: IObjectConfigData[];
  downgradeConfigs?: IObjectConfigData[];
};

export interface IVersionConfigs {
  [index: string]: IArrayConfig | IComponentConfig | IObjectConfig;
};

export interface IWrapperProps {
  name: string;
  downgrade?: any; // 后续拓展降级逻辑
  children: TWrapper;
}

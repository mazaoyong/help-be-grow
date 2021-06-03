import { ComponentType } from 'react';
import { IValidators } from 'zent';
import { IApolloRes, IProfileField } from '../types';
import getBasicProps from './get-basic-props';
import getComponentNode from './get-component-node';
import getSpecialProps from './get-special-props';

interface IGetCompPropsRes {
  NodeConfig: { isField: boolean; component: ComponentType<any> };
  props: Record<string, any>;
  formRenderProps: {
    validators: IValidators<any>;
    asyncValidators: IValidators<any>;
  } & Record<string, any>;
}
export function getCompProps(field: IProfileField, params: IApolloRes): IGetCompPropsRes {
  const { placeholders, ...otherRemoteConfigs } = params;
  const NodeConfig = getComponentNode(field);
  const basicProps = getBasicProps(field, placeholders);
  const { validators, asyncValidators, watch, ...specialProps } = getSpecialProps(
    field,
    otherRemoteConfigs,
  );

  return {
    NodeConfig,
    props: {
      ...basicProps,
      ...specialProps,
    },
    formRenderProps: {
      validators: validators || [],
      asyncValidators: asyncValidators || [],
      watch,
    },
  };
}

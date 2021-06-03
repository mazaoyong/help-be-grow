import { EasyFormConfigType, EasyFormOptionsRequiredTypes } from '../types';
import { invariant } from './invariant';
import isNil from 'lodash/isNil';

export function isOptionsRequiredType(
  config: EasyFormConfigType
): config is EasyFormOptionsRequiredTypes {
  const res = ['Select', 'Checkbox', 'Radio'].includes(config.type);
  if (res) {
    invariant(() => !isNil((config as any).options), `类型${config.type}的options属性不能为空`);
  }
  return res;
}

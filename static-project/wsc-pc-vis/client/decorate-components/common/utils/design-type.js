import isArray from 'lodash/isArray';
import isString from 'lodash/isString';

export function isExpectedDesginType(component, expected) {
  const { type } = component;

  if (isString(type)) {
    return expected === type;
  }

  if (isArray(type)) {
    return type.indexOf(expected) !== -1;
  }

  return false;
}

export function serializeDesignType(designType) {
  if (isString(designType)) {
    return designType;
  }
  if (isArray(designType)) {
    return designType.join(' | ');
  }

  throw new TypeError('designType should be a string or an array of strings');
}

export const COMPONENT_GROUP_DESIGN_TYPE = '__zent-design-component-group__';

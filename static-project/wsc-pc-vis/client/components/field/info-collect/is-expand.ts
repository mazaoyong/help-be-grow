import { IAttributeDTO } from './types';

export default function isExpand(attributeItems: IAttributeDTO[], values: number[], expandLimit = 6): boolean {
  if (values.length === 0 || attributeItems.length === 0) return false;

  const stringifyValues = values.map(val => `%{${val}}`).join('');
  return attributeItems.some((item, index) => {
    const { attributeId } = item;
    const isInStringifyValues = stringifyValues.includes(`%{${attributeId}}`);
    return isInStringifyValues && index >= expandLimit;
  });
}

import find from 'lodash/find';

export const getTextFromVal = (list, val, valueKey = 'value', textKey = 'text') => {
  if (val === '' || val === undefined) {
    val = -1;
  }
  const item = find(list, o => o[valueKey] === val);
  if (item) {
    return item[textKey];
  }
  return '';
};

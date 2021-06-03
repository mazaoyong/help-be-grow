import isArray from 'lodash/isArray';

export default function getTypeWithoutWeapp(designType) {
  if (isArray(designType) && designType.length > 0) {
    for (let i = 0; i < designType.length; i++) {
      const item = designType[i];
      if (item.indexOf('weapp') === -1) {
        return item;
      }
    }
  }

  return designType;
}

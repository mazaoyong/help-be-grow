import pickBy from 'lodash/pickBy';
import accDiv from '@youzan/utils/number/accDiv';

export const getNillStringRemovedObj = (obj) => {
  return pickBy(obj, item => item !== undefined && item !== null && item !== '');
};

export const getNumberContent = (content: Number | String) => {
  const numberContent = Number(content);
  return numberContent < 0 ? '-' : numberContent;
};

export const getSafeCourseNumber = (content: Number | String) => {
  return accDiv(Number(content), 100);
};

import get from 'lodash/get';

export const isEduBasicVersion = () => {
  return get(_global, 'versionStatus.versionCode') === 'edu_base_version';
};

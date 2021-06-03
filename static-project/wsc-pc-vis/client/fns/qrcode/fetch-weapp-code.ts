import fetchWeappCode from '@youzan/react-components/es/components/fetch-weapp-code';
import { get } from 'lodash';

export default (page: string, alias: string, option: object = {}) => {
  return fetchWeappCode({
    kdtId: get(_global, 'shopInfo.rootKdtId') || _global.kdtId,
    scene: {
      page,
      alias,
      ...option,
      guestKdtId: _global.kdtId,
      hyaLine: true,
    },
  });
};

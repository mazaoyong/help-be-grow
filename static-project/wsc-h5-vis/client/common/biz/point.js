import { get } from 'lodash';
import { getUAKeyword } from 'common/utils/helper';

// 获取交易来源监控信息
export const getBizTracePoint = () => {
  let bizTracePoint = '';

  if (window.yzlogInstance) {
    try {
      const globalParams = window.yzlogInstance.getGlobal();
      const analytics = {
        ...get(globalParams, 'context'),
        ...get(globalParams, 'plat'),
        uuid: get(globalParams, 'user.uuid'),
        platform: 'h5',
        biz: 'wsc',
        client: getUAKeyword(['micromessenger', 'youzan', 'kdtunion']),
      };
      bizTracePoint = JSON.stringify({
        ...analytics,
        dc_ps: analytics.dc_ps || '',
        qr: analytics.qr || '',
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('order log error', err);
    }
  }

  return bizTracePoint;
};

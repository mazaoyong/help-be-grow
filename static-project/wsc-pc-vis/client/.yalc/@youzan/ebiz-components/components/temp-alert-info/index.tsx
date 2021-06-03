import React from 'react';
import { Alert } from 'zent';
import './style.scss';

export function IOSBuyAlert() {
  return (
    <Alert type="warning" style={{ marginBottom: 10 }}>
      iOS系统微信小程序内将无法购买和支付知识付费商品。
      <a
        href={`//bbs.youzan.com/forum.php?mod=viewthread&tid=678623`}
        target="_blank"
        rel="noopener noreferrer"
      >
        查看产品优化调整详情
      </a>
    </Alert>
  );
}

export function PunchAlert() {
  return (
    <Alert type="warning" style={{ marginBottom: 10 }}>群打卡现已支持在H5商城中访问，建议通过H5商城进行群打卡活动。新版小程序（2.45及以上）暂不支持使用群打卡。
      {/* <a
        href={`${_global.url.bbs}/forum.php?mod=viewthread&tid=678623`}
        target="_blank"
        rel="noopener noreferrer"
      >
        了解详情
      </a> */}
    </Alert>
  );
}

export default {
  IOSBuyAlert,
  PunchAlert
};

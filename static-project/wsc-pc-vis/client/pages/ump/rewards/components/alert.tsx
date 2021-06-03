import React from 'react';
import { Alert } from 'zent';

export default () => {
  const chainShopDesc = _global.isYZEdu ? '校区' : '网店';

  return (
    <Alert className="certificates-alert" type="warning">
      奖励活动由总部统一配置，{chainShopDesc}无法对内容进行修改，仅可查看
    </Alert>
  );
};

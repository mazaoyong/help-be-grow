/* !
 * 微页面-链接-自定义链接 提示组件
 */
import React from 'react';

import './style.scss';

function testCus() {
  return (
    <div className="custom-link-notice-component">
      小程序已支持跳转至关联的公众号的文章，其他链接暂不支持跳转。（专享版小程序 v2.10
      及以上版本支持）
    </div>
  );
}

export default testCus();

import React from 'react';
import { Sweetalert } from 'zent';
import get from 'lodash/get';

// 风控锁定微面创建提示
export function checkIsLock() {
  const isShowcaseLock = get(_global, 'lock_create_showcase', false); // 是否锁定新建微页面

  if (isShowcaseLock) {
    Sweetalert.alert({
      title: '提示',
      content: (
        <p>
          你的微页面功能已被锁定，详情请至
          <a href={`${window._global.url.www}/notice/dashboard#2`}>商家后台通知中心</a>
          查看！
        </p>
      ),
      closeBtn: true,
      parentComponent: this,
    });
  }
  return isShowcaseLock;
}

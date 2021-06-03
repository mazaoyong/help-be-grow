import React from 'react';
import get from 'lodash/get';
import { setUrlDomain } from '@youzan/retail-utils';

import './style.scss';

export default props => {
  const mobile = props.mobile || get(window, '_global.userInfo.account', '');
  return (
    <div className="create-header">
      <a href={window._global.url.youzan}>
        <div className="create-header__img" />
      </a>
      <div className="create-header__title">
        <span className="create-header__divider"> | </span>
        <span>创建教育店铺</span>
      </div>
      <div className="create-header__action">
        <span>{mobile} - </span>
        {window.location.href.indexOf('upgrade') > -1 && (
          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={setUrlDomain('/forum.php?mod=viewthread&tid=674369', 'bbs')}
            >
              帮助
            </a>
            &nbsp;-&nbsp;
          </span>
        )}
        <a href={setUrlDomain('/account/user/logout', 'www')}>退出</a>
      </div>
    </div>
  );
};

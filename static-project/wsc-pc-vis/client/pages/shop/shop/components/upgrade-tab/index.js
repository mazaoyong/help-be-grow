import React from 'react';
import cx from 'classnames';

import './style.scss';

const renderSimpleTab = () => {
  return (
    <div className="create-tab__nav">
      <a
        href="#/createsingle"
        className={cx({ 'create-tab__nav-active': !window.location.hash.includes('upgrade') }, 'new-btn')}
      >
        创建新店铺
      </a>

      <a
        href="#/upgrade"
        className={cx({ 'create-tab__nav-active': window.location.hash.includes('upgrade') }, 'upgrade-btn')}
      >
        将微商城更换为有赞教育
      </a>

    </div>
  );
};

export default function(_props) {
  return <div className="create-tab">{renderSimpleTab()}</div>;
}

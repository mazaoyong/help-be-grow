import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Tabs, Alert } from 'zent';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';

import { TAB_DATA } from '../constants';
import '../style/index.scss';

export default class Tab extends Component {
  onTabChange = id => {
    hashHistory.replace(`/list/${id}`);
  };

  render() {
    const chainShopDesc = _global.isYZEdu ? '校区' : '网店';
    const isEditPage = /add|edit/.test(this.props.location.pathname || '');
    return (
      <div className="poster-wrapper">
        <Alert type="warning" className="poster-alert">
          <ShowWrapper isInStoreCondition={isInStoreCondition({ supportBranchStore: true })}>
            公众号海报活动由总部统一配置，{chainShopDesc}无法对内容进行修改，仅可查看
            <br />
          </ShowWrapper>
          温馨提示：微信平台有可能会限制海报活动在朋友圈的分享，建议引导粉丝把海报更多分享到微信群里。
        </Alert>
        <div style={{ display: isEditPage ? 'none' : 'unset' }}>
          <Tabs tabs={TAB_DATA} activeId={this.props.params.type} onChange={this.onTabChange} />
        </div>
        {this.props.children}
      </div>
    );
  }
}

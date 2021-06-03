import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Tabs, Alert } from 'zent';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';

import { TAB_DATA } from '../constants';

export default class Tab extends Component {
  onTabChange = id => {
    hashHistory.replace(`/list/${id}`);
  };

  render() {
    const { location: { pathname } } = this.props;
    const showTabs = pathname.startsWith('/list/');
    const chainShopDesc = _global.isYZEdu ? '校区' : '网店';

    return (
      <div className="freebie-wrapper">
        <ShowWrapper
          isInStoreCondition={isInStoreCondition({ supportBranchStore: true })}
        >
          <Alert className="text-tip" type="warning">
            买赠活动由总部统一配置，{chainShopDesc}无法对内容进行修改，仅可查看
          </Alert>
        </ShowWrapper>
        {showTabs && <Tabs tabs={TAB_DATA} activeId={this.props.params.type} onChange={this.onTabChange} />}
        {this.props.children}
      </div>
    );
  }
}

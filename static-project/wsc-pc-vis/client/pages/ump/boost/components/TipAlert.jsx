import React, { Component } from 'react';
import { Alert } from 'zent';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';

export default class TipAlert extends Component {
  render() {
    const chainShopDesc = _global.isYZEdu ? '校区' : '网店';
    return (
      <div>
        <Alert className="text-tip" type="warning">
          2019年11月26日起，有赞将结合微信规范优化好友助力插件相关功能。
          <a
            style={{ marginLeft: '20px' }}
            target={'_blank'}
            rel="noopener noreferrer"
            href="https://bbs.youzan.com/thread-678284-1-1.html"
          >
            查看详情
          </a>
        </Alert>
        <ShowWrapper isInStoreCondition={isInStoreCondition({ supportBranchStore: true })}>
          <Alert className="text-tip" type="warning">
            好友助力活动由总部统一配置，{chainShopDesc}无法对内容进行修改，仅可查看
          </Alert>
        </ShowWrapper>
      </div>
    );
  }
}

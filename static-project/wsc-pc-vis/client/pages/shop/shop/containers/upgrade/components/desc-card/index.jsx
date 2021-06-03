/**
 * 底部解释说明模块
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const DESC = [
  '如未订购「微商城扩展包」，则切换后的教育店铺不支持售卖实物、电子卡券等商品，你还需下架现有店铺内的实物商品，不下架将会导致用户端下单失败；',
  '根据现有更换流程，需先订购有赞教育，再对微商城店铺剩余价值退款；原微商城店铺将折算成未消耗的费用（不包括赠送的礼包）退至付费的账户；',
  '更换为有赞教育后，原微商城的店铺、资产、数据等信息支持同步至教育店铺；数据同步非即时同步，请你合理把握预期；',
  '店铺更换行为为不可逆行为，不支持撤销；',
  '微商城升级教育版本，升级后存在部分功能不可直接使用，如多网点插件，请联系销售申请退款；',
  '如当前店铺经营类目不含教育/培训，需要你在「设置-店铺设置-主体信息」修改类目后进行订购；',
  '请在订购前需充分阅读并理解以下协议，或拨打有赞客户经理 0571-8685 7988 咨询。',
];

export default class DescCard extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { className } = this.props;
    return (
      <ul className={`desc-card ${className}`}>
        {DESC.map((text, i) => (
          <li className="desc-card__text" key={i}>
            {text}
          </li>
        ))}
      </ul>
    );
  }
}

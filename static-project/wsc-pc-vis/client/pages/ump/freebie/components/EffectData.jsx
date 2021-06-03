// 效果数据
import React, { Component } from 'react';
import { DisplayBoard } from '@youzan/react-components';
import { Notify } from 'zent';

import { getEffectData } from '../api';

const content = {
  keys: ['订单实付金额', '付款商品件数', '活动笔单价', '新成交客户数', '老成交客户数'],
  tooltips: [
    '买赠活动带来的总付款金额（包含退款）',
    '参加买赠活动购买的商品数量',
    '使用买赠活动的平均每笔订单的实付金额',
    '参加买赠活动且首次在店铺成交的客户数',
    '在店铺有过付款订单，参与该买赠活动的客户数',
  ],
};

export default class EffectData extends Component {
  state = {
    values: [1, 2, 3, 4, 5].map(key => (
      <div className="loading" key={key} style={{ height: '30px' }} />
    )),
  };

  constructor(props) {
    super(props);
    this.getEffectData();
  }

  getEffectData() {
    getEffectData({
      promotionId: this.props.id,
      promotionTypeId: 101,
    })
      .then(res => {
        const result = Array.isArray(res) ? res[0] : {};
        let { payAmount = 0, payCount = 0, goodsNum = 0, newCustomerNum = 0, oldCustomerNum = 0 } =
          result || {};
        // 成交金额
        payAmount = (payAmount / 100).toFixed(2);
        // 活动笔单价
        const unitPrice = payCount !== 0 ? parseFloat(payAmount / payCount, 10).toFixed(2) : 0;

        this.setState({
          values: [
            `¥ ${Number(payAmount).toLocaleString()}`,
            goodsNum,
            `¥ ${Number(unitPrice).toLocaleString()}`,
            newCustomerNum,
            oldCustomerNum,
          ],
        });
      })
      .catch(msg => {
        Notify.error(msg);
      });
  }

  render() {
    const { name } = this.props;

    return (
      <div className="freebie__dialog--effect">
        <p className="freebie-dialog-title">
          <span>活动名称：</span>
          <span>{name}</span>
        </p>
        <DisplayBoard keys={content.keys} values={this.state.values} tooltips={content.tooltips} />
      </div>
    );
  }
}

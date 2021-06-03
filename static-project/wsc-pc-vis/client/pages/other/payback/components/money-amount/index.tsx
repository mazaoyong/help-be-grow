import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { Icon, BlockHeader } from 'zent';
import { connect } from 'react-redux';
import formatMoney from 'zan-utils/money/format';
import { DisplayBoard } from '../display-board';
import toString from 'lodash/toString';
import { MainState } from '../../states';
import './index.scss';

class MoneyAmount extends Component<MainState & { title: string }> {
  public render() {
    const { title, status } = this.props;
    const { orderCount, totalAmount } = this.props.calcOrders;

    // 待加入状态下，保证金单数为0不显示
    if (!status && !orderCount) return null;

    const datasets = [
      {
        key: (
          <span>
            课程快速回款订单数&nbsp;
            <Pop
              trigger="hover"
              content="包含符合课程快速回款条件的单个、组合课程订单，数据更新截止到昨天"
            >
              <Icon type="help-circle" />
            </Pop>
          </span>
        ),
        value: toString(orderCount),
      },
      {
        key: (
          <span>
            课程快速回款金额(元)&nbsp;
            <Pop
              trigger="hover"
              content="包含符合课程快速回款条件的订单金额，数据更新截止到昨天"
            >
              <Icon type="help-circle" />
            </Pop>
          </span>
        ),
        value: formatMoney(totalAmount || 0),
      },
    ];

    const component = (
      <div className="amount-wrapper">
        <BlockHeader className="amount-title" title={title} />
        <DisplayBoard className="money-mount" divides={12} datasets={datasets} />
      </div>
    );
    return component;
  }
}

export default connect((state: MainState, ownState: { title: string }) => ({
  ...state,
  ...ownState,
}))(MoneyAmount);

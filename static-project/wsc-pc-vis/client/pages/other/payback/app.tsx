import React, { Component } from 'react';
import { Actions } from 'zan-shuai';
import { connect } from 'react-redux';
import Join from './components/join';
import MoneyAmount from './components/money-amount';
import ImgText from './components/img-text-block';
import TextBlock from './components/text-block';
import History from './components/history';
import { serviceContentArr, requirements } from './constant';
import { MainState } from './states';
import { EffectTypes } from './effects';

import './index.scss';

class App extends Component<MainState> {
  private $$ = Actions as EffectTypes;

  public componentDidMount() {
    this.$$.fetchInfoData();
  }

  public render() {
    const {
      recordsLoading,
      records,
    } = this.props;

    return (
      <>
        <Join />
        <MoneyAmount title="数据概览" />
        <ImgText title="课程快速回款" items={serviceContentArr}>
          <div className="payback-img-tips">
            <div>
              <span>注：加入后，教育店铺里线下课订单即可享受课程回款服务。<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;专栏、直播课程，分销、供货、送礼订单不支持课程快速回款，支付完成后，T+7交易完成。</span>
            </div>
          </div>
        </ImgText>
        <TextBlock items={requirements} title="开通条件" />
        <History
          title="操作记录"
          emptyLabel="暂无任何操作记录"
          data={records}
          loading={recordsLoading}
        />
      </>
    );
  }
}

export default connect((state: MainState) => state)(App);

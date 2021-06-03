import React, { Component } from 'react';
import switchBreadcrumb from 'fns/switch-breadcrumb';
import { Tabs, Notify } from 'zent';
import fetchWeappQrcode from 'fns/qrcode/fetch-weapp-code';
import PunchBoard from './components/PunchBoard';
import QrcodePromote from './components/QrcodePromote';
import SignSetting from './components/sign';

import { PROMOTE_TABS, SIGN_DEFAULT_BG } from './constants';

import { getPunchBriefAPI, getPunchPromotionAPI } from './api';
import LongSetting from './components/long/LongSetting';

let time = 0;

export default class PromotePage extends Component {
  state = {
    gciAlias: this.props.params.alias,
    activeTab: 'qrcode',
    boardData: {
      name: '',
      coverUrl: '',
      proceedStatus: 0, // 打卡状态
      completeRatio: 0, // 打卡完成率
      participateWay: 0, // 参与方式
      participatePrice: 0, // 价格
    },
    settingData: {
      gciId: '',
      focusQrBase64: '', // 公众号二维码
      popType: 1, // 打卡后自动弹出设置 0 无 1 日签 2 长图
      daySignBgPicSetting: 1, // 日签背景图片设置 1系统图片 2自定义图片
      daySignBgPicUrl: SIGN_DEFAULT_BG, // 背景图
      openDaySignQuotes: 1, // 是否开启金句
      daySignQuotes: '', // 日签金句
      daySignLinkSetting: 1, // 日签链接设置 1小程序码 2公众号二维码 3自定义二维码
      daySignCustomQr: '',
      weappQrcode: '', // 小程序二维码
    },
  };

  componentDidMount() {
    switchBreadcrumb('推广配置', 'v4/vis/pct/page/tabs#/punch');
    this.getPunchBrief();
    this.getPunchPromotion();
    this.getWeappQrCode();
  }

  onTabChange = id => {
    this.setState({
      activeTab: id,
    });
  };

  onSignChange = value => {
    this.setState({
      settingData: Object.assign({}, this.state.settingData, value),
    });
  };

  getWeappQrCode() {
    fetchWeappQrcode('packages/new-punch/introduction/index', this.state.gciAlias)
      .then((qrcode) => {
        this.setState({
          settingData: Object.assign({}, this.state.settingData, {
            weappQrcode: `data:image/png;base64,${qrcode}`,
          }),
        });
      })
      .catch(err => {
        // 重试三次
        if (time < 3 && this.state.settingData.weappQrcode === '') {
          this.getWeappQrCode();
        } else {
          Notify.error(err || '获取二维码失败');
        }
        time++;
      });
  }

  // 获取打卡简要信息
  getPunchBrief() {
    getPunchBriefAPI(this.props.params.alias)
      .then(res => {
        const boardData = Object.assign({}, this.state.boardData, res);

        this.setState({
          boardData,
        });
      })
      .catch(msg => {
        Notify.error(msg || '网络错误！');
      });
  }

  // 获取打卡配置
  getPunchPromotion() {
    getPunchPromotionAPI(this.props.params.alias)
      .then(res => {
        res.focusQrBase64 = `data:image/png;base64,${res.focusQrBase64}`;
        this.setState({
          settingData: Object.assign({}, this.state.settingData, res),
        });
      })
      .catch(msg => {
        Notify.error(msg || '网络错误！');
      });
  }

  renderContent() {
    const contents = {
      qrcode: (
        <QrcodePromote data={this.state.settingData} onChange={value => this.onSignChange(value)} />
      ),
      sign: (
        <SignSetting
          data={this.state.settingData}
          alias={this.props.params.alias}
          onSubmit={() => this.getPunchPromotion()}
        />
      ),
      long: (
        <LongSetting
          data={this.state.settingData}
          alias={this.props.params.alias}
          onSubmit={() => this.getPunchPromotion()}
        />
      ),
    };

    return contents[this.state.activeTab];
  }

  render() {
    const { gciAlias, boardData } = this.state;
    return (
      <div className="punch-promote">
        <PunchBoard gciAlias={gciAlias} data={boardData} />
        <Tabs
          activeId={this.state.activeTab}
          onChange={id => this.onTabChange(id)}
          tabs={PROMOTE_TABS}
        />
        {this.renderContent()}
      </div>
    );
  }
}

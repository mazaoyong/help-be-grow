import get from 'lodash/get';
import React, { Component } from 'react';
import { isPureWscSingleStore } from '@youzan/utils-shop';
import YZlocalstorage from '@youzan/utils/browser/local_storage';
import { Dialog, BlockLoading, Notify, Sweetalert } from 'zent';
import { ILocalDeliveryFormData } from 'definitions/local-delivery';
import { IDeliveryConfig } from 'definitions/local-delivery/config';

import * as api from './api';
import Board from './components/board';
import SopIntroDialog from './components/sop-intro-dialog';
import { showWeappWarning } from './constants/global';
import Form from './container/Form';
import { formatInputData, formatOutputData } from './format';
const { openDialog } = Dialog;

interface IState extends ILocalDeliveryFormData {
  saving: boolean;
  loading: boolean;
  fetching: boolean;
  hasCap: boolean;
}

export default class App extends Component<{}, IState> {
  /**
   * 保存原始服务端数据
   */
  private origin!: IDeliveryConfig;

  constructor(props) {
    super(props);
    this.state = ({
      saving: false,
      fetching: true,
      loading: false,
      hasCap: true,
      /**
       * 开启第三方配送
       * isOpenThird: 开启或关闭
       * businessType: 业务类型
       * address: 取货地址
       * lng, lat: 取货地址经纬度（提供在配送方式模式为 1 和 2 下生成默认config数据）
       */
      deliveryWay: {
        lng: '',
        lat: '',
        address: '',
        isOpenThird: false,
        businessType: 0,
      },
      /**
       * 配送方式
       * 1: 不同区域不同配送费
       * 2: 不同距离不同配送费
       * 3: 简易版
       */
      mode: 1,
      /**
       * 配送区域设置
       * config: 必须设置（具体使用方式参考multi-region业务组件）
       */
      seniorData: {
        focus: 0,
        baseDist: '',
        basePrice: '',
        gradDist: '',
        gradPrice: '',
        regions: [],
        covers: [],
        config: {},
      },
      valuationRules: [],
      /**
       * 简易版数据
       */
      intro: '',
      img: '',
      startPrice: '',
      deliveryPrice: '',
      /**
       * 定时达开关
       */
      timingArrive: false,
      /**
       * 配送时段
       */
      deliveryTimes: {
        mode: 1,
        dailyValue: [],
        weeklyValue: [],
      },
      /**
       * 时段细分
       */
      divideUnit: 'hour',
      /**
       * 预约下单类型
       * type: none, day, hour, minute
       */
      appointmentOrder: {
        ruleType: 'none',
        aheadMinType: 'hour',
        aheadMin: 2,
        cutOffRuleModel: {
          hour: 12,
          minute: 0,
          beforeAheadMinType: 'hour',
          beforeAheadMin: 2,
          afterAheadMinType: 'day',
          afterAheadMin: 1,
        },
        inventoryRuleModel: {
          materialAheadMinType: 'hour',
          materialAheadMin: 2,
          planAheadMinType: 'day',
          planAheadMin: 1,
        },
      },
      /**
       * 最长预约
       * type: none, day
       */
      appointmentLong: {
        type: 'none',
        day: 7,
      },
      /**
       * 自动打单
       */
      ticketPrintConfig: {
        needAutoPrint: 0,
        autoPrintOption: 0,
        // 默认 15 分钟（900秒）
        aheadTime: 900,
      },
    } as any) as IState;
  }

  componentDidMount() {
    if (isPureWscSingleStore) {
      this.setState({
        loading: true,
      });
      api.getSameCityCap().then(val => {
        if (!val) {
          this.setState({
            hasCap: false,
          });
          Notify.error('当前店铺不支持同城配送能力', 1000, () => {
            window.location.href = '/v4/trade/express';
          });
        } else {
          this.fetchFormConfig().then(this.openSopIntroDialog);
        }
      });
    } else {
      this.fetchFormConfig().then(this.openSopIntroDialog);
    }
  }

  /**
   * 打开功能使用教程弹框
   */
  openSopIntroDialog() {
    const showSopBoard = YZlocalstorage.getItem('sop_show_board');

    if (showSopBoard === true || showSopBoard === 'true') {
      const dialogId = 'sop_intro_dialog';

      openDialog({
        dialogId,
        maskClosable: false,
        closeBtn: false,
        title: '同城配送',
        children: <SopIntroDialog dialogId={dialogId} />,
      });
    }
  }

  /**
   * 获取同城配送设置
   */
  fetchFormConfig() {
    return api
      .getConfig()
      .then(res => {
        this.origin = res;
        // @ts-ignore
        this.setState({
          fetching: false,
          loading: false,
          ...formatInputData(res),
        });
      })
      .catch(err => {
        Notify.error(err);
      });
  }

  /**
   * 保存同城配送设置
   */
  saveFormConfig = () => {
    const { config, autoCallConfig, ticketPrintConfig } = formatOutputData(this.origin, this.state);
    this.setState({
      saving: true,
    });

    api
      .saveConfig({
        config,
        autoCallConfig,
        ticketPrintConfig,
      })
      .then(() => {
        Notify.success('修改成功');
        setTimeout(() => {
          window.location.reload(true);
        }, 50);
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.setState({
          saving: false,
        });
      });
  };

  /**
   * 去升级小程序
   */
  upgradeWeapp() {
    window.location.href = `${_global.url.www}/weapp/setting#/setting`;
  }

  handleSubmit = () => {
    const isValid = get(window._global, ['weappStatusInfo', 'isValid'], false);

    if (isValid) {
      if (showWeappWarning) {
        // @ts-ignore
        Sweetalert.confirm({
          closeBtn: true,
          maskClosable: true,
          content: (
            <p>
              你的小程序版本过低，需要将小程序升级成最新版本，否则本次同城送设置修改在小程序中不会生效。是否继续保存？
            </p>
          ),
          onConfirm: this.upgradeWeapp,
          onCancel: this.saveFormConfig,
          confirmText: '先去升级小程序',
          cancelText: '继续保存',
        });
      } else {
        this.saveFormConfig();
      }
    } else {
      this.saveFormConfig();
    }
  };

  handleChange = data => {
    this.setState(data);
  };

  render() {
    const { fetching, loading, saving, hasCap, ...formData } = this.state;

    // 拿到数据在render
    if (fetching || loading) {
      return <BlockLoading loading height={500} />;
    }

    return (
      <div>
        {hasCap && (
          <>
            <Board />
            <Form
              saving={saving}
              data={formData}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
            />
          </>
        )}
      </div>
    );
  }
}

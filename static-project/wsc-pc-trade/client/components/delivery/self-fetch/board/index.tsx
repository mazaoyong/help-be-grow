import React, { Component } from 'react';
import { Switch, Notify, Sweetalert } from 'zent';
import ScanCode from 'components/delivery/self-fetch/scan-code';
import { checkWscBranchStore, isWscHqStore } from '@youzan/utils-shop';
import * as api from '../api';

import './styles.scss';

interface IState {
  loading: boolean;
  switchStatus: boolean; // 上门自提功能是否开启
}

/**
 * 顶部功能状态面板
 */
export default class Board extends Component<{}, IState> {
  state: IState = {
    loading: false,
    switchStatus: false,
  };
  componentDidMount() {
    this.fetchSetting();
  }
  /**
   * 获取上门自提状态isSelf
   */
  fetchSetting = () => {
    return api
      .getSettingInfo()
      .then(res => {
        this.setState({
          switchStatus: res.isSelf,
        });
      })
      .catch(err => {
        Notify.error(err);
      });
  };
  /**
   * 上门自提功能请求
   */
  toggleSettingRequest = (status: boolean) => {
    return api
      .updateSettingInfo({
        isSelf: status,
      })
      .then(() => {
        this.setState({ switchStatus: status }, () => {
          Notify.success('保存成功');
          const shopInfo = _global.shopInfo;
          const isWscBranchStore = checkWscBranchStore(shopInfo);
          // 关闭上门自提功能后，弹框提示
          if (!status && !isWscBranchStore) {
            // @ts-ignore
            Sweetalert.alert({
              title: '系统提示',
              content: (
                <div className="setting-close-dialog">
                  关闭此开关不会影响多网点内的商品配送方式，如有需要请前往多网点插件内检查的配送方式设置，路径：『多网点-网点管理-编辑-线下门店-是否支持上门自提』。
                </div>
              ),
            });
          }
        });
      })
      .catch(err => {
        if (status) {
          Notify.error(err);
        } else {
          // @ts-ignore
          Sweetalert.alert({
            title: '系统提示',
            content: err,
            parentComponent: this,
          });
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };
  /**
   * 开启或关闭上门自提功能
   */
  toggleSetting = (status: boolean) => {
    this.setState({ loading: true });
    const shopInfo = _global.shopInfo;
    const isWscBranchStore = checkWscBranchStore(shopInfo);
    // 连锁网店不需要检查是否有自提点
    if (status && !isWscBranchStore) {
      api
        .fetchHasSelfFetchPoints()
        .then(hasSelfFetchPoints => {
          if (hasSelfFetchPoints) {
            return this.toggleSettingRequest(status);
          } else {
            Notify.error('需新增自提点后，才能开启上门自提开关');
          }
        })
        .catch(error => {
          Notify.error(error);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } else {
      return this.toggleSettingRequest(status);
    }
  };

  render() {
    const { loading, switchStatus } = this.state;
    return (
      <div>
        <div className="self-fetch-board">
          <div className="self-fetch-board__info">
            <h3>买家上门自提功能</h3>
            <p className="tip">
              启用上门自提功能后，买家可以就近选择你预设的自提点，下单后你需要尽快将商品配送至指定自提点。
            </p>
            <p>
              <a
                href={`${_global.url.help}/qa#/menu/2119/detail/992?_k=n6gegk`}
                target="_blank"
                rel="noopener noreferrer"
              >
                查看【上门自提】功能使用教程
              </a>
              {isWscHqStore ? null : <ScanCode />}
            </p>
          </div>
          <div className="self-fetch-board__switch">
            <Switch loading={loading} checked={switchStatus} onChange={this.toggleSetting} />
          </div>
        </div>
      </div>
    );
  }
}

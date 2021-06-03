import React, { Component } from 'react';
import { Alert, Notify, Sweetalert, Switch } from 'zent';

import * as api from '../../api';
import { showWeappWarning } from '../../constants/global';
import { checkWscBranchStore } from '@youzan/utils-shop';
import { Announcement } from '@youzan/react-components';

import './styles.scss';

interface IState {
  loading: boolean;
  switchStatus: boolean; // 功能是否开启
}

/**
 * 顶部功能状态面板
 */
export default class Board extends Component<{}, IState> {
  state: IState = {
    loading: false,
    switchStatus: false,
  };

  componentWillMount() {
    this.fetchSetting();
  }

  /**
   * 获取配送功能状态
   */
  fetchSetting = () => {
    return api
      .getSetting()
      .then(res => {
        this.setState({
          switchStatus: res.isLocal,
        });
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  /**
   * 开启或关闭配送功能
   */
  toggleSetting = (status: boolean) => {
    this.setState({ loading: true });

    return api
      .updateSetting({
        isLocal: status,
      })
      .then(() => {
        this.setState({ switchStatus: status }, () => {
          Notify.success('保存成功');
          const shopInfo = _global.shopInfo;
          const isWscBranchStore = checkWscBranchStore(shopInfo);
          // 关闭配送功能后，弹框提示
          if (!status && !isWscBranchStore) {
            // @ts-ignore
            Sweetalert.alert({
              title: '系统提示',
              content: (
                <div className="setting-close-dialog">
                  关闭此开关不会影响多网点内的商品配送方式，如有需要请前往多网点插件内检查的配送方式设置，路径：『多网点-网点管理-编辑-线下门店-是否支持同城配送』。
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

  render() {
    const { loading, switchStatus } = this.state;

    return (
      <div>
        <Announcement url={'/v4/trade/announcement/apollo'} name="local-delivery" type="warning" />
        {showWeappWarning && (
          <Alert className="local-delivery-weapp" type="warning">
            同城送已升级，请将小程序升级成最新版本，否则新同城送设置在小程序中不会生效。{' '}
            <a href={`${_global.url.www}/weapp/setting#/setting`}>去升级</a>
          </Alert>
        )}
        <div className="local-delivery-board">
          <div className="local-delivery-board__info">
            <h3>同城配送功能</h3>
            <p className="tip">启用后，买家下单可以选择同城配送，由你提供上门配送服务。</p>
            <a
              href={`${_global.url.help}/qa#/menu/2119/detail/993?_k=9bxyam`}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看【同城配送】功能使用教程
            </a>
          </div>
          <div className="local-delivery-board__switch">
            <Switch loading={loading} checked={switchStatus} onChange={this.toggleSetting} />
          </div>
        </div>
      </div>
    );
  }
}

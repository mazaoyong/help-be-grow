import React, { Component } from 'react';
import { Switch, Radio, Notify, Sweetalert } from 'zent';
import {
  getSetting,
  updateSetting,
  updateExpressDeliveryTicket,
  queryExpressDeliveryTicket,
} from '../apis';
import { checkWscBranchStore, isRetailSingleStore } from '@youzan/utils-shop';
import { IExpressSetting } from 'definitions/delivery/express';
import { IUpdateExpressSettingReq } from 'definitions/delivery/express/api';
import TicketPrintConfig from 'components/delivery/common/ticket-print-config';
import './style.scss';

const { help } = _global.url;
const RadioGroup = Radio.Group;
// 是否开启履约备货提醒，零售单店白名单生效
const isShowAutoPrintTicket = isRetailSingleStore && window._global.isShowAutoPrintTicket;

type IState = IExpressSetting & {
  loading: boolean;
};

export default class extends Component<{}, IState> {
  state: IState = {
    loading: false,
    isExpress: true,
    calcType: 0,
    needAutoPrint: 0,
  };

  handleChange = value => {
    this.setState({ loading: true });
    this.updateSetting({ isExpress: value });
  };

  handelAutoPrintChange = e => {
    const checked = e.target.checked;
    updateExpressDeliveryTicket({
      needAutoPrint: checked ? 1 : 0,
      autoPrintOption: 0,
    })
      .then(() => {
        this.setState({
          needAutoPrint: checked ? 1 : 0,
        });
        Notify.success('设置成功');
      })
      .catch(({ msg }) => {
        Notify.error(msg || '设置失败');
      });
  };

  getSetting = () => {
    getSetting()
      .then(({ calcType, isExpress }) => {
        this.setState({
          isExpress,
          calcType,
        });
      })
      .catch(err => {
        Notify.error(err);
      });

    queryExpressDeliveryTicket()
      .then(({ ticketConfigPrintVO }) => {
        this.setState({
          needAutoPrint: ticketConfigPrintVO.needAutoPrint,
        });
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  updateSetting = (data: IUpdateExpressSettingReq) => {
    updateSetting(data)
      .then(() => {
        Notify.success('保存成功');
        this.setState(prevState => ({
          ...prevState,
          ...data,
          loading: false,
        }));
        const shopInfo = _global.shopInfo;
        const isWscBranchStore = checkWscBranchStore(shopInfo);
        if (data.isExpress === false && !isWscBranchStore) {
          Sweetalert.alert({
            title: '系统提示',
            content:
              '关闭此开关不会影响多网点内的商品配送方式，如有需要请前往多网点插件内检查的配送方式设置，路径：『多网点-网点管理-编辑-线下门店-是否支持快递发货』。',
            className: 'delivery-board__alert',
          });
        }
      })
      .catch(err => {
        if (data.isExpress) {
          Notify.error(err);
        } else {
          Sweetalert.alert({
            title: '系统提示',
            content: err,
            parentComponent: this,
          });
        }
        this.setState({ loading: false });
      });
  };

  render() {
    const { isExpress, calcType, needAutoPrint, loading } = this.state;

    return (
      <div>
        <div className="delivery-board__block">
          <div className="delivery-board__info">
            <h3>快递发货功能</h3>
            <p>
              启用后，买家下单可以选择快递发货，由你安排快递送货上门。
              <a href={`${help}/qa#/menu/2119/detail/994?_k=2izz9b`}>查看【运费模板】使用教程</a>
            </p>
          </div>
          <Switch checked={isExpress} onChange={this.handleChange} loading={loading} />
        </div>
        {isShowAutoPrintTicket && (
          <div className="delivery-board__block">
            <div className="delivery-board__info">
              <TicketPrintConfig.Panel
                checked={needAutoPrint}
                onChange={this.handelAutoPrintChange}
              />
            </div>
          </div>
        )}
        <div className="delivery-board__block">
          <div className="delivery-board__info">
            <h3>运费模板</h3>
            <div className="calc-type">
              计费方式:
              <RadioGroup
                value={calcType}
                onChange={e => this.updateSetting({ calcType: e.target.value })}
              >
                <Radio value={0}>按商品累加运费</Radio>
                <Radio value={1}>组合运费（推荐使用）</Radio>
              </RadioGroup>
              <a href="https://help.youzan.com/displaylist/detail_4_4-2-995">运费计费规则</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getSetting();
  }
}

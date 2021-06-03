import React from 'react';
import { Notify, Sweetalert, Dialog, Button } from 'zent';
import { Form } from '@zent/compat';
import DeliveryInfo from './DeliveryInfo';
import DeliveryTypeSelection from './DeliveryTypeSelection';
import Intracity from './express/Intracity';
import NormalExpress from './express/NormalExpress';
import SelfPickup from './express/SelfPickup';
import { makeRequest } from './utils';
import { IModel, IDeliveryWindowItemDetailInfo, IDeliveryInfo } from './type';

const { createForm } = Form;
const { openDialog, closeDialog } = Dialog;

const MULTI_PERIOD_DELIVERY_ID = 'multi_period_delivery_info_can_not_send';

interface IProps extends ZENTFORM<{}> {
  model: IModel;
  selectedItems: IDeliveryWindowItemDetailInfo[];
  isWholeSend: boolean;
  handleExpressSuccess: (totalSent: number) => void;
  orderNo: string;
  deliveryUrl: string;
  calculateFeeUrl: string;
  onClose: () => void;
  callSource: number;
  kdtId: number;
}

interface IState {
  deliveryType: number;
  balance: number;
  submitting: boolean;
}

class ExpressForm extends React.Component<IProps, IState> {
  static defaultProps = {
    model: {},
  };

  isMultiPeriod: boolean;
  isNoramlExpress: boolean;
  isSelfPickup: boolean;
  isIntracity: boolean;
  constructor(props) {
    super(props);
    const model = props.model || {};
    const {
      balance, // 店铺余额
      dist_type: distType,
    } = model;
    this.isMultiPeriod = !!model.multi_period_delivery_info;
    this.isNoramlExpress = +distType === 0 || this.isMultiPeriod;
    this.isSelfPickup = +distType === 1 && !this.isMultiPeriod;
    this.isIntracity = +distType === 2 && !this.isMultiPeriod;
    this.state = {
      deliveryType: this.getDefaultDeliveryType(model),
      balance,
      submitting: false,
    };
  }

  // 根据不同的 发货类型 选择默认的 配送方式
  getDefaultDeliveryType = (model: IModel) => {
    /**
     * 发货方式 deliveryType
     * 12, "快递 - 商家呼叫快递"
     * 13, "快递 - 无需物流"
     * 14, "快递 - 电子面单"
     * 21, "同城送 - 商家呼叫三方配送"
     * 22, "同城送 - 商家自主配送"
     */
    let deliveryType;
    const isMultiPeriod = !!model.multi_period_delivery_info;
    const distType = +model.dist_type!;
    if (distType === 0 || isMultiPeriod) {
      // 发货方式 - 快递，默认为电子面单
      deliveryType = 14;
    } else if (distType === 2 && !isMultiPeriod) {
      // 发货方式 - 同城，北美版默认商家自行配送
      deliveryType = 22;
    } else if (distType === 1) {
      // 发货方式 - 自提，默认为商家自己联系快递
      deliveryType = 12;
    }
    return deliveryType;
  };

  getSelectedItems = () => {
    return this.props.selectedItems.map(item => {
      return {
        itemId: item.item_id, // 订单商品Id
        num: item.num, // 需要发货的商品数量
        weight: item.weight, // 需要发货的商品重量
      };
    });
  };

  handleDeliveryTypeChange = (type: number) => {
    this.setState({
      deliveryType: type,
    });
  };

  getRefundItems = () => {
    const { selectedItems } = this.props;
    const refundItems = selectedItems.filter(
      item => item.refund_status_code === 'hadProcessRefund',
    );
    // 如果选择的商品中有退款中的商品，则弹窗提示
    return refundItems;
  };

  handleSubmit = (deliveryInfo: IDeliveryInfo) => {
    const { isWholeSend } = this.props;

    // 如果是整单发货，不需要校验是否选中商品
    if (isWholeSend) {
      this.submitData(deliveryInfo);
      return;
    }
    try {
      const { selectedItems, model = {} as IModel } = this.props;

      // 针对周期购订单
      if (this.isMultiPeriod) {
        const now = Date.now();
        const {
          last_estimate_delivery_time: lastDeliveryTime,
          period,
        } = model.multi_period_delivery_info!;
        // 期数大于1期，且最近一期的预计后货时间大于当前时间，不能发货
        if (period > 1 && lastDeliveryTime) {
          const lastDeliveryTimestamp = new Date(lastDeliveryTime).getTime();
          if (lastDeliveryTimestamp > now) {
            this.showMultiPeriodNotInTimeWarning();
            return;
          }
        }
      }

      if (selectedItems.length === 0) {
        Notify.error('请至少选择一件商品');
        return;
      }

      if (this.state.deliveryType === -1) {
        Notify.error('请选择发货方式');
        return;
      }

      const refundItems = this.getRefundItems();

      if (refundItems.length > 0) {
        this.showHasRefundItemsAlert(refundItems, deliveryInfo);
        return;
      }

      this.submitData(deliveryInfo);
    } catch (error) {
      // console.log(error);
    }
  };

  submitData(deliveryInfo: IDeliveryInfo) {
    const {
      deliveryUrl,
      selectedItems,
      handleExpressSuccess,
      orderNo,
      isWholeSend,
      callSource,
    } = this.props;
    const deliveryItems = this.getSelectedItems();
    // 对单品多运订单需要单独处理
    const { isSingleGoodsMultiExpress, itemPackList, ...rest } = deliveryInfo;
    if (isSingleGoodsMultiExpress && itemPackList!.length > 0) {
      // @ts-ignore
      deliveryItems[0].itemPackList = itemPackList;
    }

    const postData = {
      orderNo,
      deliveryItems,
      deliveryInfo: rest,
      wholeOrderDeliverTag: !!isWholeSend,
      callSource,
    };

    this.setState({
      submitting: true,
    });

    return makeRequest('POST', deliveryUrl, postData)
      .then(() => {
        Notify.success('发货成功');
        handleExpressSuccess(selectedItems.length);
        this.setState({
          submitting: false,
        });
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({
          submitting: false,
        });
      });
  }

  showHasRefundItemsAlert(
    refundItems: IDeliveryWindowItemDetailInfo[],
    deliveryInfo: IDeliveryInfo,
  ) {
    Sweetalert.confirm({
      confirmType: 'danger',
      confirmText: '确定发货',
      cancelText: '取消',
      content: (
        <div>
          <div>发货后，以下商品的退款申请都将自动关闭，操作带来的后果由商家自行承担。</div>
          <div>是否确认发货？</div>
          <div className="gray" style={{ marginTop: '15px' }}>
            {refundItems.map(item => {
              return <div key={item.item_id}>{item.name}</div>;
            })}
          </div>
        </div>
      ),
      title: '提醒',
      onConfirm: () => {
        this.submitData(deliveryInfo);
      },
    });
  }

  showMultiPeriodNotInTimeWarning() {
    const { onClose, model } = this.props;
    onClose && onClose();
    const { last_estimate_delivery_time: lastDeliveryTime } = model.multi_period_delivery_info!;
    openDialog({
      title: '周期购发货提示',
      dialogId: MULTI_PERIOD_DELIVERY_ID,
      style: { width: 420 },
      children: (
        <div className="multi-period-limit-dialog">
          <div className="multi-period-limit-dialog--content">
            上一期发货预计 <span>{lastDeliveryTime}</span>{' '}
            送达。当天零点后，才能填写本期发货物流信息，完成发货。
          </div>
          <div className="multi-period-limit-dialog--footer">
            <Button
              type="primary"
              onClick={() => {
                closeDialog(MULTI_PERIOD_DELIVERY_ID);
              }}
            >
              稍后发货
            </Button>
            <Button onClick={() => closeDialog(MULTI_PERIOD_DELIVERY_ID)}>关闭</Button>
          </div>
        </div>
      ),
      footer: null,
    });
  }

  renderDeliveryInfo() {
    const model = this.props.model || {};
    const {
      dist_type: distType,
      consignee_info: consigneeInfo, // 收货人信息
      dist_type_desc: distTypeDesc,
      self_fetch: selfFetchInfo,
    } = model;
    if (+(distType as number) === 1) {
      return null;
    }
    return (
      <DeliveryInfo
        distType={distType}
        distTypeDesc={distTypeDesc}
        consigneeInfo={consigneeInfo}
        selfFetchInfo={selfFetchInfo}
      />
    );
  }

  renderDeliveryTypeSelection() {
    const { deliveryType } = this.state;
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { no_need_to_deliver } = this.props.model;
    let type = 'express';
    if (this.isIntracity) {
      type = 'intracity';
    } else if (this.isSelfPickup) {
      type = 'selfPick';
    }
    return (
      <DeliveryTypeSelection
        type={type}
        deliveryType={deliveryType}
        // eslint-disable-next-line @typescript-eslint/camelcase
        noNeedToDeliver={no_need_to_deliver}
        onChange={this.handleDeliveryTypeChange}
      />
    );
  }

  renderRestFields() {
    const { deliveryType, balance, submitting } = this.state;
    const {
      model,
      orderNo,
      calculateFeeUrl,
      selectedItems,
      zentForm,
      handleSubmit,
      callSource,
      kdtId,
    } = this.props;
    if (this.isNoramlExpress) {
      // 普通快递发货
      return (
        <NormalExpress
          deliveryType={deliveryType}
          model={model}
          balance={balance}
          orderNo={orderNo}
          selectedItems={selectedItems}
          zentForm={zentForm}
          onSubmit={this.handleSubmit}
          handleSubmit={handleSubmit}
          submitting={submitting}
        />
      );
    }

    if (this.isIntracity) {
      // 同城送
      return (
        <Intracity
          deliveryType={deliveryType}
          model={model}
          balance={balance}
          orderNo={orderNo}
          calculateFeeUrl={calculateFeeUrl}
          callSource={callSource}
          zentForm={zentForm}
          handleSubmit={handleSubmit}
          onSubmit={this.handleSubmit}
          submitting={submitting}
          kdtId={kdtId}
        />
      );
    }

    if (this.isSelfPickup) {
      // 自提订单
      return (
        <SelfPickup
          deliveryType={deliveryType}
          model={model}
          orderNo={orderNo}
          zentForm={zentForm}
          handleSubmit={handleSubmit}
          onSubmit={this.handleSubmit}
          submitting={submitting}
        />
      );
    }
  }

  render() {
    return (
      <Form className="action-area" horizontal>
        {this.renderDeliveryInfo()}
        {this.renderDeliveryTypeSelection()}
        {this.renderRestFields()}
      </Form>
    );
  }
}

export default createForm()(ExpressForm);

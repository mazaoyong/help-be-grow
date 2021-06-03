import React, { Component } from 'react';
import { Notify, Dialog, BlockLoading } from 'zent';
import noop from 'lodash/noop';
import get from 'lodash/get';
import { makeRequest } from './utils';
import { fetchExpressInfo } from 'fns/fetch-express-info';
import ExpressForm from './ExpressForm';
import Title from './Title';
import GoodsList from './GoodsList';
import { closeDialog } from './open';
import mapKeysToSnakeCase from '@youzan/utils/string/mapKeysToSnakeCase';
import { OrderContextProvider } from './order-context';
import { IModel, IDeliveryWindowItemDetailInfo } from './type';
import { Announcement } from '@youzan/react-components';

interface IProps {
  itemId: string;
  orderNo: string;
  callback: () => void;
  callSource: number;
  dialogId: string;
  visible: boolean;
  deliveryDetailUrl: string; // 获取订单信息
  caculateFeeUrl: string; // 计算运费
  deliveryUrl: string; // 发货
  onClose: () => void;
  kdtId: number;
  orderInfo: any;
}

interface IState {
  model: IModel;
  loading: boolean;
  submiting: boolean;
  selectedItemIds: string[];
  selectedItems: IDeliveryWindowItemDetailInfo[];
  isWholeSend: boolean;
}

class ExpressDialog extends Component<IProps, IState> {
  static defaultProps = {
    callback: noop,
    visible: false,
    callSource: 1, // 调用来源 1、订单列表 2、订单详情-售后
    deliveryDetailUrl: '/v4/trade/api/order/deliveryWindow.json',
    caculateFeeUrl: '/v4/trade/delivery/fee.json',
    deliveryUrl: '/v4/trade/api/order/delivery.json',
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      submiting: false,
      isWholeSend: false,
      model: {} as IModel,
      selectedItemIds: [],
      selectedItems: [],
    };
  }

  componentDidMount = () => {
    this.getDeliveryDetail();
    if (!get(window._global, 'optimizedExpress')) {
      fetchExpressInfo();
    }
  };

  // 获取发货弹窗详情
  getDeliveryDetail = () => {
    const { deliveryDetailUrl, orderNo, itemId } = this.props;
    this.setState({ loading: true });
    return makeRequest('GET', deliveryDetailUrl, {
      orderNo,
      itemId,
      callSource: this.props.callSource,
    })
      .then(data => {
        // 字段的驼峰命名方式格式化为下划线方式
        data = {
          ...data,
          ...mapKeysToSnakeCase(data),
        };
        // 未发货数
        let unDeliveryCount = 0;
        // 已发货数
        let deliveryCount = 0;
        // 是否有退款
        data.hasRefund = false;
        // eslint-disable-next-line @typescript-eslint/camelcase
        data.item_detail_info_list = (data.item_detail_info_list || []).map(item => {
          const newItem = {
            ...item,
          };
          if (newItem.refund_status_code === 'hadProcessRefund') {
            data.hasRefund = true;
          }
          // 用第三方配送发过货
          newItem.isLocalDelivery = !!newItem.dist_company_id;
          newItem.isSend = false;
          if (item.delivery_status !== 0) {
            // 状态是已发货
            newItem.isSend = true;
          } else if (newItem.delivery_status === 0 && !newItem.dist_company_id) {
            // 状态是未发货、且没有记录第三方快递公司
            newItem.isSend = false;
          } else if (
            newItem.delivery_status === 0 &&
            newItem.dist_company_id &&
            newItem.dist_status !== 5
          ) {
            // 状态是未发货、有记录第三方快递公司、第三方记录不是已取消
            newItem.isSend = true;
          }
          return newItem;
        });
        const itemList = data.item_detail_info_list;
        itemList.forEach(item => {
          if (!item.isSend) {
            unDeliveryCount += 1;
          } else {
            deliveryCount += 1;
          }
        });
        // eslint-disable-next-line @typescript-eslint/camelcase
        data.un_delivery_count = unDeliveryCount;
        // eslint-disable-next-line @typescript-eslint/camelcase
        data.delivery_count = deliveryCount;

        const selectedItems = [];
        const selectedItemIds = [];

        // 是否整单发货
        const isWholeSend = data.is_whole_send;

        this.setState({
          model: {
            ...this.state.model,
            ...data,
          },
          selectedItemIds,
          selectedItems,
          isWholeSend,
          loading: false,
        });
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({ loading: false });
      });
  };

  /**
   * 发货成功后处理方法
   * @param {number} totalSent 发货成功的数量
   */
  handleExpressSuccess = (totalSent: number) => {
    const model = this.state.model || {};
    const { isWholeSend } = this.state;
    /**
     * 检查所有商品是否发货完成
     */
    const checkIsEmpty = () => {
      return +totalSent === +model.un_delivery_count!;
    };
    const isEmpty = checkIsEmpty();
    if (isEmpty || isWholeSend) {
      // 所有商品已发货，关闭弹窗，刷新列表数据
      this.handleCloseDialog();
      this.props.callback();
    } else {
      this.refreshDeliveryDetail(); // 部分发货完成后，重新加载数据
    }
  };

  // 重新加载弹窗数据
  refreshDeliveryDetail = () => {
    this.setState({
      model: {} as IModel,
      selectedItemIds: [],
      selectedItems: [],
    });
    this.getDeliveryDetail();
  };

  onSelect = (selectedRowKeys: string[], selectedItems: IDeliveryWindowItemDetailInfo[]) => {
    this.setState({
      selectedItemIds: selectedRowKeys,
      selectedItems,
    });
  };

  handleCloseDialog = () => {
    closeDialog(this.props.dialogId);
  };

  renderContent() {
    const { loading, selectedItems, selectedItemIds, model, isWholeSend } = this.state;
    const { orderNo, deliveryUrl, caculateFeeUrl, onClose, callSource, kdtId } = this.props;
    if (loading) {
      return <BlockLoading loading />;
    }
    return (
      <div className="express-modal-content">
        <Announcement url={'/v4/trade/announcement/apollo'} name="order-express" type="warning" />
        <GoodsList
          onSelect={this.onSelect}
          model={model}
          selectedItemIds={selectedItemIds}
          selectedItems={selectedItems}
          orderNo={orderNo}
          isWholeSend={isWholeSend}
        />
        <ExpressForm
          handleExpressSuccess={this.handleExpressSuccess}
          orderNo={orderNo}
          deliveryUrl={deliveryUrl}
          calculateFeeUrl={caculateFeeUrl}
          selectedItems={selectedItems}
          model={model}
          onClose={onClose}
          callSource={callSource}
          isWholeSend={isWholeSend}
          kdtId={kdtId}
        />
      </div>
    );
  }

  render() {
    const { model } = this.state;
    const { visible, onClose, orderInfo } = this.props;
    return (
      <OrderContextProvider value={{ orderInfo }}>
        <Dialog
          title={
            <Title
              multiPeriodDeliveryInfo={model.multi_period_delivery_info}
              distType={model.dist_type}
            />
          }
          visible={visible}
          onClose={onClose}
          className="order-express-dialog-wrap"
          closeBtn
        >
          {this.renderContent()}
        </Dialog>
      </OrderContextProvider>
    );
  }
}

export default ExpressDialog;

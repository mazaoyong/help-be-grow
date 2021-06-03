import React, { PureComponent } from 'react';
import { Notify, Dialog, BlockLoading, Button, Select } from 'zent';
import { IOrderCancelReason } from './type';
import { IDeliveryListItem } from 'definitions/order/list';
import api from './api';

const { openDialog, closeDialog } = Dialog;

const DIALGO_ID = 'cancel-delivery-dialog-id';

type DeliveryListItem = Pick<
  IDeliveryListItem,
  'appId' | 'deliveryChannel' | 'packId' | 'orderNo' | 'deliveryChannelName'
>;
interface IOptionProps extends DeliveryListItem {
  stateCode: number;
  callback: () => void;
}

interface IProps extends IOptionProps {
  action: string;
}

interface IState {
  loading: boolean;
  submiting: boolean;
  deductFee: number;
  cancelReasonList: IOrderCancelReason[];
  reason: number | '';
  reasonText: string;
}

class CancelDialog extends PureComponent<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      submiting: false,
      deductFee: 0,
      cancelReasonList: [],
      reason: '',
      reasonText: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({
      loading: true,
    });
    Promise.all([
      api.queryCancelReason({
        appId: this.props.appId,
        deliveryChannel: this.props.deliveryChannel,
        isCloudTag: this.props.appId ? true : false,
      }),
      api.getCancelDeductFee({
        orderId: this.props.packId,
      }),
    ])
      .then(([reasons, res]) => {
        this.setState({
          deductFee: res.deductFee,
          cancelReasonList: reasons,
        });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  handleReasonChange = (_, data: IOrderCancelReason) => {
    this.setState({
      reason: data.id,
      reasonText: data.reason,
    });
  };

  // 配送取消
  handleConfirm = () => {
    if (this.state.reason === '') {
      return Notify.error('请选择取消配送原因');
    }
    this.setState({
      submiting: true,
    });
    api
      .cancelCall({
        orderNo: this.props.orderNo,
        packId: this.props.packId,
        cancelReasonId: this.state.reason,
        cancelReason: this.state.reasonText,
        currentStatus: this.props.stateCode,
      })
      .then(() => {
        this.handleClose();
        this.props.callback();
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          submiting: false,
        });
      });
  };

  handleClose() {
    closeDialog(DIALGO_ID);
  }

  render() {
    if (this.state.loading) {
      return <BlockLoading loading />;
    }
    const channel =
      this.props.deliveryChannelName || ['达达', '蜂鸟', '点我达'][this.props.deliveryChannel - 1];
    return (
      <div>
        <Select
          placeholder={`请选择${this.props.action}原因`}
          className="delivery-cancel-dialog-select"
          onChange={this.handleReasonChange}
          data={this.state.cancelReasonList || []}
          optionValue="id"
          optionText="reason"
          autoWidth
        />
        {!!this.state.deductFee && (
          <div style={{ marginTop: '10px' }} className="red">
            {channel}
            已接单，取消将扣除
            {(this.state.deductFee / 100).toFixed(2)}
            元违约金
          </div>
        )}
        <div className="overwrite-dialog-r-footer">
          <Button loading={this.state.submiting} onClick={this.handleConfirm} type="primary">
            确定
          </Button>
          <Button onClick={this.handleClose}>取消</Button>
        </div>
      </div>
    );
  }
}

export default function openDetailDialog(options: IOptionProps) {
  let title = '取消配送';
  if (options.stateCode <= 1) {
    title = '取消呼叫';
  }
  openDialog({
    dialogId: DIALGO_ID,
    title,
    children: <CancelDialog action={title} {...options} />,
    style: { width: '360px' },
  });
}

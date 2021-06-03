import React from 'react';
import noop from 'lodash/noop';
import { Table, Alert, Icon, ITableColumn } from 'zent';
import cx from 'classnames';
import { BlankLink } from '@youzan/react-components';
import { getRefundDetailUrl } from 'fns/utils';
import { IModel, IDeliveryWindowItemDetailInfo } from './type';

const Category = (props: { list: string[] }) => {
  const { list } = props;
  return (
    <div className="c-gray">
      {list.map((text, index) => {
        return <span key={`c-${index}`}>{text}&nbsp;&nbsp;</span>;
      })}
    </div>
  );
};

interface IProps {
  callSource: number;
  model: IModel;
  selectedItemIds: string[];
  selectedItems: IDeliveryWindowItemDetailInfo[];
  onSelect: (selectedRowKeys: string[], selectedItems: IDeliveryWindowItemDetailInfo[]) => void;
  orderNo: string;
  isWholeSend: boolean;
}

class GoodsList extends React.Component<IProps> {
  static defaultProps = {
    callSource: 1, // 调用来源 1、订单列表 2、订单详情-售后
    selectedItemIds: [],
    selectedItems: [],
    model: {},
    onSelect: noop,
  };

  getRowConf = rowData => {
    return {
      canSelect: rowData.allow_check,
      rowClass: '',
    };
  };

  onSelect = (selectedRowKeys: string[], selectedItems: IDeliveryWindowItemDetailInfo[]) => {
    this.props.onSelect(selectedRowKeys, selectedItems);
  };

  getCols() {
    return [
      {
        title: '商品',
        name: 'goodsName',
        width: 40,
        bodyRender: (data: IDeliveryWindowItemDetailInfo) => {
          const categoryList: string[] = [];
          if (data.category) {
            categoryList.push(data.category);
          }
          // 如果有餐饮商品加料，就加入展示列表
          if (Array.isArray(data.cy_ingredient_items)) {
            data.cy_ingredient_items.forEach(items => {
              if (items) {
                categoryList.push(items.name!);
              }
            });
          }
          return (
            <div className="goods-item">
              <img className="goods-img" src={data.img_url} alt="" />
              <div>
                <a href={data.url} rel="noopener noreferrer" target="_blank">
                  {data.name}
                </a>
                <Category list={categoryList} />
              </div>
            </div>
          );
        },
      },
      {
        title: '数量',
        name: 'num',
        width: 20,
      },
      {
        title: '状态',
        name: 'status',
        width: 20,
        bodyRender: (data: IDeliveryWindowItemDetailInfo) => {
          const { orderNo } = this.props;
          let refundText = '';
          let refundLink: React.ReactNode = null;
          if (data.refund_status_code === 'hadProcessRefund') {
            refundText = this.props.callSource === 1 ? '有退款' : '退款中';
            refundLink =
              this.props.callSource === 1 ? (
                <BlankLink href={getRefundDetailUrl(orderNo, data.item_id)}>处理退款</BlankLink>
              ) : null;
          }
          const isSuccessStatus = !data.allow_check;
          const isErrorStatus = data.dist_status === 5; // 已取消呼叫配送员
          const style = {
            green: isSuccessStatus,
            red: isErrorStatus,
          };
          if (refundLink) {
            return (
              <div>
                <div className="orange">{refundText}</div>
                {refundLink}
              </div>
            );
          }
          if (data.isLocalDelivery) {
            return (
              <div>
                <div className="orange">{refundText}</div>
                <div className={cx(style)}>{data.dist_status_desc}</div>
              </div>
            );
          }
          return (
            <div>
              <div className="orange">{refundText}</div>
              <div className={cx(style)}>{data.delivery_status_desc}</div>
            </div>
          );
        },
      },
      {
        title: '运单号',
        width: 20,
        name: 'expressNo',
        textAlign: 'left',
        bodyRender: (data: IDeliveryWindowItemDetailInfo) => {
          return (
            <div>
              {data.express_no ? (
                <div className="express-row">
                  <div>{data.dist_company_name}</div>
                  <div>{data.express_no}</div>
                  {!!data.other_num && <div>等{data.other_num + 1}个运单</div>}
                </div>
              ) : (
                <div>-</div>
              )}
            </div>
          );
        },
      },
    ] as ITableColumn[];
  }

  // 有退款时候的提示文案
  renderHasRefund() {
    const { callSource } = this.props;
    let content: React.ReactNode = null;
    if (callSource === 1) {
      /* 有退款、通用提示 */
      content = (
        <Alert type="warning">
          部分商品有发生退款申请，需商家处理完结或买家撤销退款后才能进行发货，其他商品仍能正常发货。
        </Alert>
      );
    }
    if (callSource === 2) {
      /* 有退款、在维权详情打开的弹窗，展示这个提示 */
      content = (
        <Alert type="warning">
          <Icon type="error-circle" />
          订单中包含退款中的商品，对其进行发货将撤销退款申请。
        </Alert>
      );
    }
    return <div className="tips-row">{content}</div>;
  }

  render() {
    const { selectedItemIds = [], isWholeSend, model } = this.props;

    const {
      un_delivery_count: unDeliveryCount,
      delivery_count: deliveryCount,
      item_detail_info_list: itemDetailInfoList = [],
    } = model;

    let selectionOption = {
      getRowConf: this.getRowConf,
      selection: {
        selectedRowKeys: selectedItemIds,
        onSelect: this.onSelect,
      },
    };

    // 整单发货就不用展示选择商品的 selection
    if (isWholeSend) {
      selectionOption = {} as any;
    }

    return (
      <div className="express-modal-content">
        {this.props.model.hasRefund && this.renderHasRefund()}
        {!isWholeSend && (
          <p className="items-table-title">
            <span className="item item-label">选择商品</span>
            <span className="item">待发货 {unDeliveryCount}</span>
            <span className="item">已发货 {deliveryCount}</span>
          </p>
        )}
        <Table
          className="items-table"
          columns={this.getCols()}
          datasets={itemDetailInfoList}
          rowKey="item_id"
          {...selectionOption}
        />
      </div>
    );
  }
}

export default GoodsList;

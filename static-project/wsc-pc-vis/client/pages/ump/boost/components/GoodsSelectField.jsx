
import { Form, Table } from '@zent/compat';
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Notify } from 'zent';
import { CHANNELS } from '@youzan/react-components/es/components/goods-selector/constant';
import ajax from 'fns/ajax';
import PaidContentSelect from '../../../../components/good-selector';
import './paidcontent-select/style.scss';
import isEqual from 'lodash/isEqual';

const { getControlGroup } = Form;
const TABLE_REQ_SIZE = 5;

class GoodsSelectWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNum: props.value.length,
      showGoodsSelect: false,
      goodsList: [],
      initGoodList: [],
      tableLoading: false,
      current: 1,
      disabled: false,
      initIds: this.props.value.itemIds || [],
      customChannels: CHANNELS,
    };
  }

  componentDidMount() {
    const customManageUrl = _global.isYZEdu ? `${_global.url.v4}/vis/course/column/list` : `${_global.url.v4}/vis/pct/page/tabs#/column`;
    const customChannels = [
      {
        ...CHANNELS[0],
        manageURL: {
          wsc: customManageUrl,
          retail: customManageUrl,
        },
      },
      ...CHANNELS.slice(1),
    ];

    this.setState({
      customChannels,
    });
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        selectedNum: (nextProps.value.goodsIds || []).length,
        initGoodList: nextProps.value.goodsIds || [],
        disabled: nextProps.disabled,
      });
      const prevRangeValue = this.props.value.goodsIds || [];
      const currRangeValue = nextProps.value.goodsIds || [];

      if (!isEqual(currRangeValue, prevRangeValue) && currRangeValue.length > 0) {
        this.fetchSelectedGoods(
          {
            rangeValue: currRangeValue.map(v => v.id),
          },
          true,
        );
      }
      if (currRangeValue.length === 0) {
        const selected = this.getInitData(null, true);
        this.setState({ goodsList: [], selected });
      }
    }
  }

  fetchSelectedGoods = ({ rangeValue = [] }, forceRefetch = false) => {
    this.setState({
      tableLoading: true,
    });
    const { current, allGoods = [] } = this.state;
    const pageSize = TABLE_REQ_SIZE;
    if (!forceRefetch && allGoods.length) {
      const first = (current - 1) * pageSize;
      const last = +first + +pageSize;
      this.setState({
        goodsList: allGoods.slice(first, last),
        tableLoading: false,
      });
    } else {
      const zanQuery = {
        productIds: rangeValue.join(','),
      };
      ajax({
        url: `${window._global.url.v4}/vis/pct/boost/selectedGoodsList.json`,
        data: zanQuery,
      })
        .then((data = []) => {
          const selected = this.getInitData(data);
          const first = (current - 1) * pageSize;
          const last = +first + +pageSize;
          const dataSortByTime = (() => {
            if (data[0].publish_at) {
              return data.sort((pre, next) => next.publish_at - pre.publish_at);
            }
            return data;
          })();
          this.setState({
            allGoods: dataSortByTime,
            goodsList: dataSortByTime.slice(first, last),
            tableLoading: false,
            selected,
          });
        })
        .catch(msg => {
          Notify.error(msg);
        })
        .finally(() => {
          this.setState({
            tableLoading: false,
          });
        });
    }
  };

  handleGoodsSelectModal = e => {
    e.preventDefault();
    this.setState({
      showGoodsSelect: true,
    });
  };

  handleRemoveGoods = itemId => {
    const goodsIds = this.props.value.goodsIds.filter(val => val.id !== itemId);
    if (goodsIds.length % TABLE_REQ_SIZE === 0 && this.state.current !== 1) {
      this.setState({ current: this.state.current - 1 }, () => {
        this.props.onChange({ goodsIds });
      });
    } else {
      this.props.onChange({ goodsIds });
    }
  };

  getSkusByGoodsId = (value, id) => {
    const obj = Object.keys(value || {}).reduce(
      (arr, key) => arr.concat((value[key] || {}).value || []),
      [],
    );
    let skuInfo = (obj.find(v => v.id === id) || {}).skuInfo;
    if (!skuInfo) {
      skuInfo = [];
    } else if (!Array.isArray(skuInfo)) {
      skuInfo = [skuInfo];
    }
    return skuInfo.map(skuItem => skuItem.value);
  };

  getSelectedGoodsColumns = () => {
    const { disabled } = this.state;
    const selectedGoodsColumns = [
      {
        title: '商品',
        width: '60%',
        bodyRender: data => (
          <div className="modal__goods-info">
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              <img alt="" src={data.image_url || data.cover} />
            </a>
            <div className="content">
              <a className="ellipsis" href={data.url} target="_blank" rel="noopener noreferrer">
                {data.title}
              </a>
              <span className="modal__goods-price">￥{(data.price / 100).toFixed(2)}</span>
            </div>
          </div>
        ),
      },
      {
        title: '规格',
        width: disabled ? '40%' : '20%',
        bodyRender: data => {
          const skus = this.getSkusByGoodsId(this.state.selected, data.product_id);
          return <div className="modal__goods-info">{skus.filter(sku => sku).join(',')}</div>;
        },
      },
    ];
    if (!disabled) {
      selectedGoodsColumns.push({
        title: '操作',
        width: '20%',
        bodyRender: data => {
          return (
            <div className="modal__goods-info">
              <a rel="noopener noreferrer" onClick={() => this.handleRemoveGoods(data.product_id)}>
                取消参加
              </a>
            </div>
          );
        },
      });
    }
    return selectedGoodsColumns;
  };

  handleTableChange = ev => {
    const { initGoodList } = this.state;
    this.setState({ current: ev.current }, () => {
      this.fetchSelectedGoods({
        rangeValue: initGoodList,
      });
    });
  };

  renderTable = () => {
    const { tableLoading, current, allGoods = [], goodsList = [], selectedNum = 0 } = this.state;
    return selectedNum > 0 ? (
      <Table
        columns={this.getSelectedGoodsColumns()}
        onChange={this.handleTableChange}
        emptyLabel="没有选择商品"
        loading={tableLoading}
        datasets={goodsList}
        rowKey="item_id"
        className="selected-goods-list"
        pageInfo={selectedNum > 5 ? { current, total: allGoods.length, pageSize: TABLE_REQ_SIZE } : null}
      />
    ) : null;
  };

  /**
   * 因为组件会返回三个分类的选中的商品信息用于合并选中的参加活动的商品信息
   *
   * @memberof GoodsSelectWrap
   * @param {any} data - goods list
   */
  handleMergeGoodList = data => {
    const keys = Object.keys(data);
    const goodsIds = [];
    keys.forEach(key => {
      const { value = [] } = data[key] || Object.create(null);
      goodsIds.push(...value);
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange({ rangeType: 'part', goodsIds });
    }
  };

  getInitData = (data, reset = false) => {
    const res = {
      distribution: {
        type: 'part',
        value: [],
      },
      offline: {
        type: 'part',
        value: [],
      },
      online: {
        type: 'part',
        value: [],
      },
    };
    if (reset) {
      return res;
    }
    const { initGoodList } = this.state;
    data.forEach(item => {
      const { biz_type, product_id: id } = item;
      const newItem = Object.assign(
        {},
        item,
        initGoodList.find(goodItem => goodItem.id === id) || { id },
      );
      if (biz_type === 0) {
        res.online.value.push(newItem);
      }
      if (biz_type === 1) {
        res.distribution.value.push(newItem);
      }
    });
    return res;
  };

  render() {
    const { activityId } = this.props;
    const { disabled, selected, customChannels } = this.state;
    return (
      <div className="goods-select-wrapper">
        {this.renderTable()}
        <PaidContentSelect
          selected={selected}
          maxSelectedNum={30}
          disabled={disabled}
          btnTxt="添加知识商品"
          activityType={4}
          customChannels={customChannels}
          activityId={Number(activityId)}
          onChange={this.handleMergeGoodList}
          ignoreGroup={{
            online: {
              value: [4],
            },
          }}
        />
      </div>
    );
  }
}

export default getControlGroup(GoodsSelectWrap);

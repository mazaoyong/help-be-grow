
import { Form, Table } from '@zent/compat';
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Radio, Notify } from 'zent';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import GoodsSelect from '../../../../components/good-selector';
import { getSelectedGoods } from '../api';
import './paidcontent-select/style.scss';

const { getControlGroup } = Form;
const RadioGroup = Radio.Group;

const TABLE_REQ_SIZE = 5;

class GoodsSelectWrap extends Component {
  static defaultProps = {
    value: {},
    activityId: '',
  };

  state = {
    selectedNum: get(this.props, 'value.goodsItemList', []).length,
    showGoodsSelect: false,
    goodsList: [], // 当前页需要展示的数据
    initGoodList: [], // 所有已选的数据
    tableLoading: false,
    current: 1,
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        selectedNum: get(nextProps, 'value.goodsItemList', []).length,
        initGoodList: get(nextProps, 'value.goodsItemList', []),
      });
      const prevRangeValue = get(this.props, 'value.goodsItemList');
      const currRangeValue = get(nextProps, 'value.goodsItemList');
      if (!isEqual(currRangeValue, prevRangeValue) && currRangeValue.length > 0) {
        this.fetchSelectedGoods(
          {
            rangeValue: currRangeValue,
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
    let { current, allGoods = [] } = this.state;
    const pageSize = TABLE_REQ_SIZE;
    if (rangeValue.length <= (current - 1) * pageSize) {
      this.setState({
        current: this.state.current - 1,
      });
      current -= 1;
    }
    // 如果已经存在所有商品的数据，那么就从state中取用
    if (!forceRefetch && allGoods.length) {
      const first = (current - 1) * pageSize;
      const last = +first + +pageSize;
      this.setState({
        goodsList: allGoods.slice(first, last),
        tableLoading: false,
      });
    } else {
      getSelectedGoods(rangeValue.map(item => item.goodsId))
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

  handleRadioChange = e => {
    // 改变 type 值
    this.props.onChange({ rangeType: e.target.value }, { merge: true });
  };

  // handleCLoseListModal = () => {
  //   this.setState({
  //     showGoodsSelect: false,
  //   });
  // };

  handleGoodsSelectModal = e => {
    e.preventDefault();
    this.setState({
      showGoodsSelect: true,
    });
  };

  // handleModalSubmit = val => {
  //   this.props.onChange({ rangeType: 'part', goodsItemList: val });
  //   this.handleCLoseListModal();
  // };

  handleRemoveGoods = itemId => {
    const goodsItemList = this.props.value.goodsItemList.filter(val => val !== itemId);
    this.props.onChange({
      rangeType: 'part',
      goodsItemList,
    });
  };

  getSelectedGoodsColumns = () => {
    return [
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
        title: '操作',
        width: '40%',
        bodyRender: data => (
          <div className="modal__goods-info">
            {!this.props.disabled && (
              <a rel="noopener noreferrer" onClick={() => this.handleRemoveGoods(data.product_id)}>
                删除
              </a>
            )}
          </div>
        ),
      },
    ];
  };

  handleTableChange = ev => {
    const { initGoodList } = this.state;
    this.setState(
      {
        current: ev.current,
      },
      () => {
        this.fetchSelectedGoods({
          rangeValue: initGoodList,
        });
      },
    );
  };

  renderTable = () => {
    const { tableLoading, goodsList, current, selectedNum } = this.state;
    const { value } = this.props;
    return (
      value.rangeType === 'part' && (
        <Table
          columns={this.getSelectedGoodsColumns()}
          onChange={this.handleTableChange}
          pageInfo={{
            limit: TABLE_REQ_SIZE,
            current,
            total: selectedNum,
          }}
          emptyLabel="没有选择商品"
          loading={tableLoading}
          datasets={goodsList}
          rowKey="item_id"
          className="selected-goods-list"
        />
      )
    );
  };

  /**
   * 因为组件会返回三个分类的选中的商品信息用于合并选中的参加活动的商品信息
   *
   * @memberof GoodsSelectWrap
   * @param {any} data - 参数
   * @return {undefined}
   */
  handleMergeGoodList = data => {
    const keys = Object.keys(data);
    const goodsItemList = [];
    keys.forEach(key => {
      const { value = [] } = data[key] || {};
      goodsItemList.push(...value.map(item => ({
        goodsId: item.id,
        skuIdList: item.skuInfo ? [item.skuInfo.id] : [],
      })));
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange({ rangeType: 'part', goodsItemList });
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
    data.forEach(d => {
      const { biz_type, product_id } = d;
      if (biz_type === 0) {
        res.online.value.push({ id: product_id });
      }
      if (biz_type === 1) {
        res.distribution.value.push({ id: product_id });
      }
    });
    return res;
  };

  render() {
    const { value, disabled, activityId } = this.props;
    const { selectedNum, selected } = this.state;
    return (
      <div className="goods-select-wrapper">
        <RadioGroup disabled={disabled} onChange={this.handleRadioChange} value={value.rangeType}>
          <Radio value="all">全部课程商品（含线下课/专栏/内容/直播）</Radio>
          <Radio value="part">
            指定课程商品
          </Radio>
          {value.rangeType === 'part' && (
            <GoodsSelect
              hasFx
              selected={selected}
              disabled={disabled}
              className="pct-freebie-goods-btn"
              btnTxt="选择指定商品"
              activityType={1001}
              activityId={Number(activityId)}
              onChange={this.handleMergeGoodList}
              ignoreGroup={{
                online: {
                  value: [4],
                },
              }}
            />
          )}
        </RadioGroup>
        {selectedNum > 0 ? this.renderTable() : null}
      </div>
    );
  }
}

export default getControlGroup(GoodsSelectWrap);


import { Form, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Radio } from 'zent';
import { CouponSelector } from '@youzan/react-components';
import { getCouponListAPI, listCouponListByIdsAPI } from '../api';

const RadioGroup = Radio.Group;
const getControlGroup = Form.getControlGroup;

class BoostRewardAdapter extends Component {
  state = {
    selected: [],
  };

  handleTypeChange = e => this.handleChange({ prizeChannel: e.target.value });

  handleCouponOpen = () => {
    if (this.props.disabled) {
      return;
    }
    const { selected } = this.state;
    const amountMap = {};
    this.state.selected.forEach(selectedItem => {
      amountMap[selectedItem.id] = selectedItem.amount;
    });
    CouponSelector.open({
      fetchApi: this.fetchCouponList,
      onChange: this.handleCouponChange,
      btnLink: `${window._global.url.v4}/ump/coupon/list`,
      isSingleSelection: true,
      amountMap,
      selected,
    });
  };

  handleCouponChange = data => {
    this.setState({ selected: data || [] });
    if (data && data[0]) {
      this.handleChange({
        prizeNum: data[0].amount,
        prizeId: data[0].id,
        prizeTitle: data[0].title,
      });
    }
  };

  handleCouponDelete = () => {
    if (this.props.disabled) {
      return;
    }
    this.setState({ selected: [] });
    this.handleChange({ prizeNum: 0, prizeId: 0, prizeTitle: '' });
  };

  handleChange = value => this.props.onChange(Object.assign({}, this.props.value, value));

  componentWillReceiveProps(nextProps) {
    if (
      !this.selectedInitialized &&
      nextProps.value.prizeChannel === 1 &&
      this.state.selected.length === 0
    ) {
      this.selectedInitialized = true;
      this.fetchCouponById(nextProps.value.prizeId).then(data => {
        ((data && data[0]) || {}).amount = nextProps.value.prizeNum;
        this.setState({ selected: data });
      });
    }
  }

  render() {
    const { selected } = this.state;
    const { disabled } = this.props;
    const { prizeChannel } = this.props.value;
    return (
      <>
        <RadioGroup disabled={disabled} onChange={this.handleTypeChange} value={prizeChannel}>
          <Radio className="boost-reward_radio" value={0}>
            所选知识商品免费送
          </Radio>
          <Radio className="boost-reward_radio" value={1}>
            赠送优惠券&nbsp;
            {prizeChannel === 1 && !disabled && (
              <a href="javascript: void(0);" onClick={this.handleCouponOpen}>
                选择优惠券
              </a>
            )}
          </Radio>
        </RadioGroup>
        {prizeChannel === 1 && selected.length > 0 && (
          <Table
            key="table"
            datasets={selected}
            columns={this.getColumns()}
            className="coupon-select-result"
          />
        )}
      </>
    );
  }

  async fetchCouponList({ keyword, pageNo, pageSize }) {
    return getCouponListAPI({ keyword, pageNo, pageSize });
  }

  async fetchCouponById(id) {
    return listCouponListByIdsAPI({ ids: [id] });
  }

  getColumns() {
    const columns = [
      {
        title: '优惠券',
        name: 'title',
        width: '150px',
      },
      {
        title: '优惠内容',
        name: 'preferentialDesc',
        width: '150px',
      },
      {
        title: '数量',
        name: 'amount',
        width: '50px',
      },
    ];
    if (!this.selectedInitialized) {
      columns.push({
        title: '操作',
        name: 'opt',
        width: '50px',
        bodyRender: row => <a onClick={this.handleCouponDelete}>删除</a>,
      });
    }
    return columns;
  }
}

export default getControlGroup(BoostRewardAdapter);

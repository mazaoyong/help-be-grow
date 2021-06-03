
import { Form, Table } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Notify } from 'zent';
import cn from 'classnames';
import { CouponSelector } from '@youzan/react-components';
import { getCouponListAPI } from '../../common/api';
import { getColumns } from './column-config';
const { getControlGroup } = Form;

class CouponSKU extends PureComponent {
  onCouponHandler = () => {
    if (!this.props.disabled) {
      const { value } = this.props;
      const amountMap = {};
      value.forEach(selectedItem => {
        amountMap[selectedItem.id] = selectedItem.amount;
      });
      CouponSelector.open({
        fetchApi: this.fetchCouponList,
        onChange: this.onCouponSelected,
        btnLink: `${window._global.url.v4}/ump/coupon/list`,
        isCanSelect: this.filterRandomCoupon.bind(this),
        isSingleSelection: false,
        amountMap,
        selected: value,
      });
    }
  };

  filterRandomCoupon = item => {
    return !item.isRandom;
  };

  onCouponSelected = data => {
    if (data.length > 10) {
      Notify.error('最多选取10种优惠券');
    } else {
      this.props.onChange(data);
    }
  };

  handleNumberChange = (e, id) => {
    const { value } = this.props;
    if (value && value.length) {
      const coupon = [].concat(value);
      coupon.find(item => item.id === id).amount = e;
      this.props.onChange(coupon);
    }
  };

  handleCouponRemove = id => {
    if (!this.props.disabled) {
      const { value } = this.props;
      if (value && value.length) {
        const coupon = [].concat(value.filter(item => item.id !== id));
        this.props.onChange(coupon);
      }
    }
  };

  fetchCouponList = ({ keyword, pageNo, pageSize }) => {
    return getCouponListAPI({ keyword, pageNo, pageSize, type: 'card' })
      .then(data => {
        const items = [].concat(data.items);
        const total = data.paginator.totalCount;
        items.forEach(item => {
          if (item.isRandom) {
            item.unSelectReason = '随机券不可选';
            item.isCanSelect = false;
          }
          if (item.isExchange) {
            item.unSelectReason = '商品交换券不可选';
            item.isCanSelect = false;
          }
        });
        return {
          items,
          paginator: { totalCount: total },
        };
      })
      .catch(e => Notify.error(e));
  };

  render() {
    const { value, disabled } = this.props;

    return (
      <>
        <span
          className={cn('coupon-add-btn', {
            disabled: disabled,
          })}
          onClick={this.onCouponHandler}
        >
          添加优惠券
        </span>
        {value.length > 0 && (
          <Table
            className="coupon-table"
            datasets={value}
            rowKey="id"
            columns={getColumns.call(this)}
          ></Table>
        )}
      </>
    );
  }
}

export default getControlGroup(CouponSKU);

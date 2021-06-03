
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio } from 'zent';

import Coupon from './coupon';

const RadioGroup = Radio.Group;
const { getControlGroup } = Form;

class RewardSettingField extends Component {
  state = {};

  onChange = data => {
    const { value } = this.props;
    const returnData = Object.assign(value, {
      prizeChannel: data.target.value,
    });
    this.props.onChange(returnData);
  };

  handleCouponChange = data => {
    const { value } = this.props;

    const returnData = Object.assign(value, {
      couponId: data.couponId,
      couponNum: data.couponNum,
    });
    this.props.onChange(returnData);
    this.props.onBlur(returnData);
  };

  render() {
    const { value = {}, disabled } = this.props;
    const { prizeChannel, couponId, couponNum } = value;

    return (
      <>
        <RadioGroup
          className="poster__reward-setting-radio"
          value={prizeChannel}
          onChange={this.onChange}
          disabled={disabled}
        >
          <Radio className="poster__reward-setting-item" value={0}>
            所选课程商品免费送
          </Radio>
          <Radio className="poster__reward-setting-item" value={1}>
            <div className="poster__reward-setting-coupon">
              <span>赠送优惠券</span>
            </div>
          </Radio>
        </RadioGroup>
        {prizeChannel === 1
          ? <Coupon
            className="poster__reward-setting-coupon-item"
            disabled={disabled}
            value={{
              couponRequired: prizeChannel === 1,
              couponId,
              couponNum,
            }}
            onChange={this.handleCouponChange}
          />
          : null
        }
      </>
    );
  }
}

export default getControlGroup(RewardSettingField);

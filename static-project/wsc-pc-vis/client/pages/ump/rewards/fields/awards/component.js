
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio, LayoutRow as Row } from 'zent';
import CouponSKU from '../coupon-sku';
const { getControlGroup, FormNumberInputField } = Form;
const RadioGroup = Radio.Group;

class Awards extends PureComponent {
  onAwardTypeChange = (e) => {
    this.props.onChange(e.target.value);
  }

  getPointValidations = () => {
    const { value: radioValue, rewardType } = this.props;
    const validations = {};
    validations['required'] = (formatValue, value) => {
      if ((!value && rewardType === 'processing') || (rewardType !== 'processing' && radioValue === 2 && !value)) {
        return `积分数不能为空`;
      }
      return true;
    };
    return validations;
  }

  render() {
    const { value, coupon, pointNumber, isView, rewardType } = this.props;
    return rewardType !== 'processing' ? (
      <RadioGroup
        onChange={this.onAwardTypeChange.bind(this)}
        value={value}
        disabled={isView}>
        <Row className='coupon-row'>
          <Radio value={1}>
            <span className="tip-link">送优惠券/码</span>
          </Radio>
          {value === 1 && <CouponSKU coupon={coupon} disabled={isView} />}
        </Row>
        <Row className='member-pointer-row'>
          <Radio value={2}>送
            <FormNumberInputField
              width='130px'
              className='pointnumber-field'
              name='pointNumber'
              value={pointNumber}
              validateOnChange={false}
              min={1}
              max={9999}
              disabled={isView}
              validations={this.getPointValidations()}
            />
            积分
          </Radio>
          <div className='awards-helpdesc'>
            发放积分需注意使用的渠道，避免用户获取后无法核销。积分规则可在
            <a className="tip-link" onClick={() => window.open('https://www.youzan.com/v4/scrm/points/rule#/')}>积分管理</a>
            中设置
          </div>
        </Row>
        <Row className='coupon-row'>
          <Radio value={3}>送线下课赠品</Radio>
          <div className='awards-helpdesc'>获得奖励的用户可免费学习此线下课</div>
        </Row>
      </RadioGroup>) : (
      <>
        <span className="processing-award__node">
            送
          <FormNumberInputField
            width='130px'
            className='pointnumber-field'
            name='pointNumber'
            value={pointNumber}
            min={1}
            max={9999}
            disabled={isView}
            validateOnChange={false}
            validations={this.getPointValidations()}
          />
              积分
        </span>
        <div className='awards-helpdesc'>
          发放积分需注意使用的渠道，避免用户获取后无法核销。积分规则可在
          <a className="tip-link" onClick={() => window.open('https://www.youzan.com/v4/scrm/points/rule#/')}>积分管理</a>
          中设置
        </div>
      </>
    );
  }
}

export default getControlGroup(Awards);

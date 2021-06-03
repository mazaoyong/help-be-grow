
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import component from './component.js';
import './index.scss';
const { Field } = Form;

class CouponSKUWrap extends PureComponent {
  getValidations = () => {
    const validations = {};
    const { coupon } = this.props;
    validations['required'] = (_, value) => {
      if (!coupon.length) {
        return '请选择优惠券';
      }
      return true;
    };
    return validations;
  }

  render() {
    const { coupon, ...props } = this.props;
    return (
      <Field
        name='coupon'
        value={coupon}
        className='coupon-wrap'
        component={component}
        validations={this.getValidations()}
        {...props}>
      </Field>
    );
  }
}

export default CouponSKUWrap;

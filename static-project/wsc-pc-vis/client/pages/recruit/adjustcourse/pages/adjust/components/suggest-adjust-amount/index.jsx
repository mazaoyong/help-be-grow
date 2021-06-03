
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';

const { getControlGroup } = Form;

export default class SuggestAdjustAmount extends PureComponent {
  render() {
    const { value } = this.props;
    return <div>
      {value ? `建议转出金额￥${value}` : '-'}
    </div>;
  }
}

export const SuggestAdjustAmountField = getControlGroup(SuggestAdjustAmount);


import { Form } from '@zent/compat';
import { PureComponent } from 'react';

const { getControlGroup } = Form;

export default class UnitPrice extends PureComponent {
  render() {
    const { value } = this.props;
    return value ? `￥${value}` : '-';
  }
}

export const UnitPriceField = getControlGroup(UnitPrice);

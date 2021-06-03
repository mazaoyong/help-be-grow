
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Input } from 'zent';
import omit from 'lodash/omit';
import unknownProps from 'components/form/unknown-props';

const { getControlGroup } = Form;

class MobileField extends PureComponent {
  handleChange = e => {
    const { value } = e.target;
    if (/^.{0,11}$/.test(value)) {
      this.props.onChange(value);
    }
  }

  render() {
    const { value, onChange, ...restProps } = this.props;
    const passableProps = omit(restProps, unknownProps);
    return (
      <Input
        value={value}
        onChange={this.handleChange}
        {...passableProps}
      />
    );
  }
}

export default getControlGroup(MobileField);

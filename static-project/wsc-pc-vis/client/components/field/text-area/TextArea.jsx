
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Input } from 'zent';
import omit from 'lodash/omit';

const { getControlGroup, unknownProps } = Form;

class TextareaField extends Component {
  onChange = val => {
    this.props.onChange(val);
  };

  render() {
    const { placeholder, value, className, style, maxLength } = this.props;
    const passibleProps = omit(this.props, unknownProps);
    return (
      <Input
        type="textarea"
        className={className}
        placeholder={placeholder}
        style={style}
        maxLength={maxLength}
        autoSize
        value={value}
        onChange={this.onChange}
        {...passibleProps}
      />
    );
  }
}

export default getControlGroup(TextareaField);

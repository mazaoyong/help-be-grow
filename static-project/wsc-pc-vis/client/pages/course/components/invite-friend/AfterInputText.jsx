
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Input } from 'zent';
import omit from 'lodash/omit';

const { getControlGroup, unknownProps } = Form;

class InputWrap extends Component {
  render() {
    const { type = 'text', afterText, ...rest } = this.props;
    const passableProps = omit(rest, unknownProps);
    return (
      <div className="after-text-input-wrap">
        <Input {...passableProps} type={type} />
        <p className="after-text">{afterText}</p>
      </div>
    );
  }
}

const AfterTextInputField = getControlGroup(InputWrap);

export default AfterTextInputField;

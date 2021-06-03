import React, { Component } from 'react';
import { Form } from '@zent/compat';

const { getControlGroup } = Form;

class Text extends Component {
  render() {
    return <div style={{ maxWidth: '500px' }}>{this.props.text}</div>;
  }
}

const TextField = getControlGroup(Text);

export default TextField;

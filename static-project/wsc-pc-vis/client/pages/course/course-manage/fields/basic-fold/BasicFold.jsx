
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import FoldToggle from '../../components/fold-toggle';

const { Field } = Form;

export default class BasicFoldWrap extends Component {
  render() {
    let { label, basicChildInfoExtra } = this.props;
    return (
      <Field
        name="basicChildInfoExtra"
        className="no-control-label"
        label={label}
        value={basicChildInfoExtra}
        component={FoldToggle}
        // onChange={this.props.onChange}
      />
    );
  }
}

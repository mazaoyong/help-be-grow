
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import component from './component';

const { Field } = Form;

export default class StoreList extends Component {
  render() {
    const { label, addressList } = this.props;
    return (
      <Field
        name="addressList"
        className="store-list"
        label={label}
        component={component}
        value={addressList}
      />
    );
  }
}

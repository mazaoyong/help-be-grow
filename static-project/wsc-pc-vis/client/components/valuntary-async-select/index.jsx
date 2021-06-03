
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import VoluntaryAsyncSelect from './ValuntaryAsyncSelect';

const { Field } = Form;

export default class AsyncSelectField extends Component {
  render() {
    return <Field {...this.props} component={VoluntaryAsyncSelect} />;
  }
}

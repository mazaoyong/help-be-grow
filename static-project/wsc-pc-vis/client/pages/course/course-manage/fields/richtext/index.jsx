
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import richtext from 'components/field/rich-text';

const { Field } = Form;

export default class RichText extends Component {
  render() {
    let { label, intro } = this.props;
    return <Field name="intro" label={label} value={intro} editorConfig={{ topOffset: 61 }} component={richtext} ckt={true}/>;
  }
}

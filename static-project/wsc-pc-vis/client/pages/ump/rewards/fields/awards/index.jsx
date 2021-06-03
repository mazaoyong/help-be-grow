
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import component from './component.js';
import './index.scss';
const { Field } = Form;

class AwardsWrap extends PureComponent {
  render() {
    const { label, awardType, ...props } = this.props;
    return (
      <Field
        label={label}
        required
        name='awardType'
        value={awardType}
        className='awards-wrap'
        component={component}
        {...props}>
      </Field>
    );
  }
}

export default AwardsWrap;

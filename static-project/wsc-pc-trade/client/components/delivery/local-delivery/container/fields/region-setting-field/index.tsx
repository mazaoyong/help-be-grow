import React, { PureComponent } from 'react';
import { Form } from '@zent/compat';
import RegionSetting from './RegionSetting';
import './styles.scss';

const { Field } = Form;

export default class RegionSettingField extends PureComponent<ZENT_FIELD> {
  render() {
    // @ts-ignore
    return <Field {...this.props} component={RegionSetting} />;
  }
}

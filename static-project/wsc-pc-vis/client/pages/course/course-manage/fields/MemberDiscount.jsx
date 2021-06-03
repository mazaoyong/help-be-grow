
import { Form } from '@zent/compat';
import React, { Component } from 'react';

const { FormCheckboxField } = Form;

export default class MemberDiscount extends Component {
  render() {
    const { label, joinLevelDiscount } = this.props;
    return (
      <FormCheckboxField name="joinLevelDiscount" label={label} value={joinLevelDiscount}>
        <span>参加会员折扣 &nbsp;</span>
        <p className="help-inline">
          <a href="/v4/scrm/membercard" target="_blank" rel="noopener noreferrer">配置会员折扣</a>
        </p>
      </FormCheckboxField>
    );
  }
}

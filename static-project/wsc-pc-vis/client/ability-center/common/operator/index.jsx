
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { desensitivePhone } from 'fns/text/caculate';

import './index.scss';
const { getControlGroup } = Form;

export default class Operator extends PureComponent {
  render() {
    const { userInfo } = _global;
    return (
      <>
        <span className='operator-info-item'>
          {userInfo.nickName || ''}
        </span>
        <span className='operator-info-item'>
          {desensitivePhone(userInfo.mobile) || ''}
        </span>
      </>
    );
  }
}

export const OperatorField = getControlGroup(Operator);

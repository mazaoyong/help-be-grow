import { Pop } from '@zent/compat';
import React from 'react';
import { Icon } from 'zent';

export default function helpPopupTips(content) {
  return (
    <Pop trigger="hover" content={content}>
      <Icon style={{ marginLeft: '5px', color: 'grey' }} type="help-circle-o" />
    </Pop>
  );
}

import { Pop } from '@zent/compat';
import React, { FC } from 'react';
import { Icon } from 'zent';
import { IAbnormalCodePopProps, IAbnormalCodeCofnig } from './types';
import { get } from 'lodash';
import AbnormalCodeConfig from './abnormal-code-config';

const AbnormalCodePop: FC<IAbnormalCodePopProps> = (props) => {
  const { joinState } = props;
  const code: number = get(joinState, 'check.checkCode') || 0;
  const abnormalState: IAbnormalCodeCofnig =
  AbnormalCodeConfig.find((item) => item.code === code) || AbnormalCodeConfig[0];
  return <div className='abnormal__code__text'>
    <div className='abnormal__code__desc'>{abnormalState.desc}</div>
    { abnormalState.popTips(props) && <Pop trigger='hover' position="bottom-right" content={abnormalState.popTips(props)}>
      <Icon type="help-circle" />
    </Pop>}
  </div>;
};

export default AbnormalCodePop;

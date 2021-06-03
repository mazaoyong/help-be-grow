import React, { FC, useState, useEffect } from 'react';
import { Form } from '@zent/compat';
import Args from 'zan-utils/url/args';
import style from './index.m.scss';
import { PAGE_TYPE } from './constants';
import InitTip from './components/init-tip';
import UpdateTip from './components/update-tip';
import AuthForm from './components/auth-form';
import { getPolyvAuth } from './api';

const { Fieldset } = Form;

const helpTip = {
  [PAGE_TYPE.INIT]: InitTip,
  [PAGE_TYPE.UPDATE]: UpdateTip,
};

const Polyv: FC = () => {
  const [defaultValue, setDefaultValue] = useState({});

  const type = Args.get('type');
  const Tip = helpTip[type];

  useEffect(() => {
    if (type === PAGE_TYPE.UPDATE) {
      getPolyvAuth()
        .then(res => {
          setDefaultValue(res);
        });
    }
  }, [type]);

  return (
    <div className={style.polyv}>
      <Fieldset legend="开发授权" />
      <Tip />
      <AuthForm defaultValue={defaultValue} />
    </div>
  );
};

export default Polyv;

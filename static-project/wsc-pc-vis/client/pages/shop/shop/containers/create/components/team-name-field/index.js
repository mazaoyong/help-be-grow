
import { Form as ZentForm } from '@zent/compat';
/**
 * 店铺名称组件
 */
import React from 'react';
import { Input } from 'zent';
import forEach from 'lodash/forEach';
import omit from 'lodash/omit';

const { getControlGroup, unknownProps } = ZentForm;

const TeamNameField = getControlGroup(props => {
  const passableProps = omit(props, unknownProps);
  const teamNameTips =
    '店铺类型：旗舰店、专卖店、直营店 需等创建成功后通过店铺认证才可添加到店铺名称中';
  let isOfficialShop = false;

  const nameOnChange = evt => {
    props.onChange(evt.target.value);
  };

  forEach(['旗舰', '专卖', '直营'], value => {
    if (props.value.indexOf(value) > -1) {
      isOfficialShop = true;
      return false;
    }
  });

  return (
    <div>
      <Input {...passableProps} value={props.value} onChange={nameOnChange} />
      {isOfficialShop && <p className="zent-form__help-desc">{teamNameTips}</p>}
    </div>
  );
});

export default TeamNameField;

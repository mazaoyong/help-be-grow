import React from 'react';
import { Checkbox } from 'zent';
import { booleanToString, numberToBoolean } from '../../common/utils';
import { ControlGroup, Divider } from '../../common';

const prefix = 'decorate-official-account-editor';

const onBooleanToStringChange = (onChange, name) => e => {
  const value = e.target.checked;

  onChange({
    [name]: booleanToString(value),
  });
};

export const OfficialPanel = props => {
  const { value, validation, showError, onChange } = props;
  const { isWeappSupport = '1', isWeappContactSupport = '0', isH5Support = '0' } = value;

  const _isWeappSupport = numberToBoolean(isWeappSupport);
  const _isWeappContactSupport = numberToBoolean(isWeappContactSupport);
  const _isH5Support = numberToBoolean(isH5Support);

  return (
    <div className={`${prefix}-text`}>
      <p>选择访问途径</p>

      <ControlGroup
        className={`${prefix}-check`}
        showError={showError}
        error={validation.support}
      />

      <ControlGroup label="" value="小程序关注">
        <Checkbox
          checked={_isWeappSupport}
          name="isWeappSupport"
          onChange={onBooleanToStringChange(onChange, 'isWeappSupport')}
        />
      </ControlGroup>

      <p>
        仅在用户扫码进入微页面时可展示，用户可一键关注公众号，需要在微信后台开启 去配置{' '}
        <a href="https://mp.weixin.qq.com" target="_blank" rel="noopener noreferrer">
          去配置
        </a>
      </p>

      <ControlGroup label="" value="小程序客服消息关注">
        <Checkbox
          checked={_isWeappContactSupport}
          name="isWeappContactSupport"
          onChange={onBooleanToStringChange(onChange, 'isWeappContactSupport')}
        />
      </ControlGroup>

      <p>支持所有访问方式，用户点击后通过客服消息获取二维码，长按识别关注公众号</p>

      <ControlGroup label="" value="H5">
        <Checkbox
          checked={_isH5Support}
          name="isH5Support"
          onChange={onBooleanToStringChange(onChange, 'isH5Support')}
        />
      </ControlGroup>

      <p>支持所有访问方式，长按识别二维码关注</p>

      <Divider />

      <p>若在小程序一个页面内同时选择了两款组件，用户扫码访问该页面时，仅展示微信官方组件。</p>
    </div>
  );
};

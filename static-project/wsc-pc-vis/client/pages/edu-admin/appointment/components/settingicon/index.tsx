import { Popover } from '@zent/compat';
import React, { FC } from 'react';
import './index.scss';
import VersionWrapper from 'fns/version';

const SettingIcon: FC<{}> = () => {
  return (
    <Popover
      className="zent-doc-popover"
      position={Popover.Position.BottomRight}
      display="inline"
      cushion={5}
    >
      <Popover.Trigger.Click showDelay={200} hideDelay={200}>
        <span className="panel__toolbar__link" >设置</span>
      </Popover.Trigger.Click>
      <Popover.Content>
        <div className="panel__toolbar__link-options">
          <a
            className="panel__toolbar__link-option"
            target="_blank"
            rel="noopener noreferrer"
            href={`${_global.url.v4}/message/messagepush#/setting/AppointmentSucessRemind`}
          >
            预约提醒设置
          </a>
          <VersionWrapper name="appointment-panel-setting-timerange">
            <a
              className="panel__toolbar__link-option"
              target="_blank"
              rel="noopener noreferrer"
              href={`${_global.url.v4}/vis/edu/page/settings`}
            >
              看板时间区间设置
            </a>
          </VersionWrapper>
        </div>
      </Popover.Content>
    </Popover>
  );
};

export default SettingIcon;

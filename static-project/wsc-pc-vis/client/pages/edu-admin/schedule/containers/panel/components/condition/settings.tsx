import { Popover } from '@zent/compat';
import React, { FC } from 'react';

export interface ISettingIcon {
  project: string;
}

const SettingIcon: FC<ISettingIcon> = (props) => {
  const { project } = props;
  return project !== 'educlass' ? (
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
            href={`${_global.url.v4}/message/messagepush#/setting/EduLessonStartRemind`}
          >
            上课提醒设置
          </a>
          <a
            className="panel__toolbar__link-option"
            target="_blank"
            rel="noopener noreferrer"
            href={`${_global.url.v4}/vis/edu/page/settings`}
          >
            看板时间区间设置
          </a>
        </div>
      </Popover.Content>
    </Popover>
  ) : null;
};

export default SettingIcon;

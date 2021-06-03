import React, { useCallback, useState } from 'react';
import { Icon } from 'zent';
import { Form } from '@zent/compat';
import selectChannel from './select-channel';
import style from './index.m.scss';

const { getControlGroup } = Form;

function PolyvChannel(props) {
  const { onChange } = props;
  const isEdit = Boolean(props.self.state.alias);
  const [selectedName, setSelectedName] = useState(props.channelName);

  const handleClick = useCallback(() => {
    selectChannel()
      .then(data => {
        onChange(data);
        setSelectedName(data.name);
      })
      .catch(() => {});
  }, [onChange]);

  if (isEdit) {
    if (!selectedName) {
      return (
        <p className={style['polyv-channel']}>
          <Icon className={style['error-icon']} type="error-circle-o" />
          频道信息获取失败，请刷新页面重试
        </p>
      );
    }
  }

  if (selectedName) {
    return (
      <span className={style['polyv-channel']}>
        {selectedName}
        {!isEdit && <a className={style['re-select']} onClick={handleClick} href="javascript:;">重新选择</a>}
      </span>
    );
  }

  return <a className={style['polyv-channel']} onClick={handleClick} href="javascript:;">选择频道</a>;
}

export default getControlGroup(PolyvChannel);

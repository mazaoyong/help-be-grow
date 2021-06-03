import React, { FC } from 'react';
import { Icon } from 'zent';

import { ElementType } from '../../../../../types';
import './styles.scss';

interface IElementAppendButton {
  type: ElementType;
  onClick?: () => void;
}

const elementFragmentMap = {
  [ElementType.RichText]: {
    icon: <Icon className="icon" type="photo" />,
    desc: '图文',
  },
  [ElementType.Audio]: {
    icon: <Icon className="icon" type="voice" />,
    desc: '语音',
  },
  [ElementType.Video]: {
    icon: <Icon className="icon" type="video-guide-o" />,
    desc: '视频',
  },
  [ElementType.Document]: {
    icon: <Icon className="icon" type="text-guide-o" />,
    desc: '文档',
  },
};

const AddButton: FC<IElementAppendButton> = ({ type, onClick }) => {
  const { icon = null, desc = '' } = elementFragmentMap[type];
  return (
    <div className="append-button" onClick={onClick}>
      {icon}
      <span className="desc">{desc}</span>
    </div>
  );
};

export default AddButton;

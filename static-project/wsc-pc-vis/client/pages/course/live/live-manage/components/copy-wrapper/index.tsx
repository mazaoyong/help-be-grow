import React from 'react';
import { Notify } from 'zent';

import './style.scss';
import copy from './copy-to-clipboard';

export interface ICopyWrapperProps {
  /** 复制的内容 */
  text: string;
  onSuccess?: (() => void) | string;
  onError?: (() => void) | string;
}

export const CopyWrapper: React.FC<ICopyWrapperProps> = (props) => {
  const { text, children, onSuccess, onError } = props;

  const handleCopy = () => {
    const success = copy(text);
    if (success) {
      if (onSuccess) {
        typeof onSuccess === 'function'
          ? onSuccess()
          : Notify.success(onSuccess);
      } else {
        Notify.success('复制成功');
      }
    } else {
      if (onError) {
        typeof onError === 'function'
          ? onError()
          : Notify.error(onError);
      } else {
        Notify.error('复制失败');
      }
    }
  };

  return (
    <div onClick={handleCopy} className="copy-wrapper">
      { children }
    </div>
  );
};

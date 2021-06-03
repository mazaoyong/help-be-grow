import React from 'react';
import { Input, CopyButton, Notify } from 'zent';

import style from '../style.m.scss';

interface IProps {
  url?: string;
  label: String;
  showQuickLink?: boolean;
}

const ShareUrl: React.FC<IProps> = props => {
  const { url = '', label, showQuickLink = true } = props;
  return (
    <div className={style['share-url']}>
      <span className={style.label}>{label}</span>
      <Input className="share-url__input" value={url} inline disabled />
      <span>
        <CopyButton
          text={url}
          onCopySuccess={() => {
            Notify.success('复制成功');
          }}
          onCopyError={() => {
            Notify.error('复制失败');
          }}
        >
          <a className="ui-link--split" href="javascript:void(0);">
            复制
          </a>
        </CopyButton>
        {showQuickLink && (
          <a className="ui-link--split" href={url} target="_blank" rel="noopener noreferrer">
            访问链接
          </a>
        )}
      </span>
    </div>
  );
};

export default ShareUrl;

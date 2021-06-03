import React, { FC } from 'react';
import { hashHistory } from 'react-router';
import { Button as SamButton } from '@youzan/sam-components';
import { fullfillImage } from '@youzan/utils';
import { clickTracker, EventTypeEnum } from 'components/logger';
import { ENROLLMENT_POSTER_LIST } from '../contants';

export interface IPosterTemplateItem {
  /** 模板缩略图 */
  thumbUrl: string;
  /** 模板标题 */
  title: string;
}

const PosterTemplateItem: FC<IPosterTemplateItem> = ({ thumbUrl, title }) => {
  return (
    <div className="template-item">
      <div>
        <div className="template-item-title">{title}</div>
        <div className="template-item-img">
          <img src={fullfillImage(thumbUrl, '!304x480.jpg')} />
        </div>
      </div>
      <div className="template-item-mask">
        <SamButton name="编辑" type="primary" size="large" onClick={() => {
          hashHistory.push('/create');
          clickTracker({
            eventName: '去使用模板',
            eventSign: 'use_template',
            pageType: ENROLLMENT_POSTER_LIST,
            otherParams: {
              title,
              thumbUrl,
              eventType: EventTypeEnum.ADD,
            },
          });
        }}>
          立即新建
        </SamButton>
      </div>
    </div>
  );
};

export default PosterTemplateItem;

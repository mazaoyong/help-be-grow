import React from 'react';
import { Button } from 'zent';
import { COURSE_TYPE } from '../../constants';

import { isInStoreCondition } from 'fns/chain';
const isEduChainStore = isInStoreCondition({ supportEduChainStore: true });

export default function Footer({ selectedInfo, onOk, onCancel }) {
  const getCount = type => selectedInfo.filter(item => item.type === type).length;
  return (
    <div className="page-course-group-list__course__footer">
      <div className="page-course-group-list__course__footer__text">
        已选：线下课({getCount(COURSE_TYPE.COURSE)})、专栏({getCount(COURSE_TYPE.COLUMN)}）、内容({getCount(COURSE_TYPE.CONTENT)}){ !isEduChainStore && `、直播(${getCount(COURSE_TYPE.LIVE)})`}
      </div>
      <div className="page-course-group-list__course__footer__btn">
        <Button type="primary" onClick={onOk}>
          确定
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </div>
    </div>
  );
}

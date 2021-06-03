import React, { useMemo } from 'react';
import { Dialog } from '@youzan/ebiz-components';
import RecordDetail from './RecordDetail';
import { isEduChainStore } from '@youzan/utils-shop';
import './source.scss';
import { format } from 'date-fns';

const { openDialog } = Dialog;

export interface IActiveDetail {
  groupName: string;
  name: string;
  sourceType: number;
  courseName?: string;
  attendTime?: string;
  attendAddress?: string;
  schoolName?: string;
  operation?: string; // 线索来源操作，例“查看报名详情”，为空则代表无操作
  regInfo?: any[];
}

const ActiveDetail = ({ data }) => {
  const {
    groupName,
    name,
    sourceType,
    courseName,
    attendTime,
    attendAddress,
    schoolName = '',
    operation = '',
    regInfo = [],
  } = data;

  const dialogTitle = operation && operation.replace(/查看/, '');

  const openDetailDialog = () => {
    openDialog(RecordDetail, {
      title: dialogTitle,
      className: 'clue-detail-active-dialog',
      data: {
        attributes: regInfo,
      },
    });
  };

  const getContent = () => {
    switch (sourceType) {
      case 3:
        break;
      case 4: // 体验课报名
        return (
          <>
            <dl>
              <dt>意向体验时间</dt>
              <dd>{attendTime ? format(attendTime, 'YYYY-MM-DD hh:mm:ss') : '-'}</dd>
            </dl>
            <dl>
              <dt>意向体验地点</dt>
              <dd>{attendAddress || '-'}</dd>
            </dl>
          </>
        );
      case 5: // 好友助力
      case 6: // 公众号海报
        return (
          <dl>
            <dt>报名课程</dt>
            <dd>{courseName || '-'}</dd>
          </dl>
        );
    }
  };

  const origin = useMemo(() => {
    let str = `${groupName}-${name}`;
    if (isEduChainStore && !!schoolName) {
      str += `(${schoolName})`;
    }
    return str || '-';
  }, [groupName, name, schoolName]);

  return (
    <div className="source-info">
      <dl>
        <dt>来源</dt>
        <dd>
          <p>{origin}</p>
          {dialogTitle && (
            <span className="cursor-link" onClick={openDetailDialog}>
              {operation}
            </span>
          )}
        </dd>
      </dl>
      {getContent()}
    </div>
  );
};

export default ActiveDetail;

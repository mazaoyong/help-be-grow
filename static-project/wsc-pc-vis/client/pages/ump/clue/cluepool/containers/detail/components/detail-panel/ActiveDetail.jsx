import React, { useMemo } from 'react';
import { Dialog } from '@youzan/ebiz-components';
import RecordDetail from './RecordDetail';
import { isEduChainStore } from '@youzan/utils-shop';

const { openDialog } = Dialog;

const dialogTitles = {
  3: '报名详情',
  7: '表单详情',
  9: '报名详情',
};

const ActiveDetail = ({ data }) => {
  const {
    groupName,
    name,
    sourceType,
    courseName,
    attendTime,
    attendAddress,
    schoolName = '',
    regInfo = [],
  } = data;

  const dialogTitle = dialogTitles[sourceType];

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
              <dd>{attendTime || '-'}</dd>
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
            <dt>报名线下课</dt>
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
    <>
      <dl>
        <dt>来源</dt>
        <dd>
          <p>{origin}</p>
          {dialogTitles[sourceType] && (
            <span className="cursor-link" onClick={openDetailDialog}>
              查看{ dialogTitle }
            </span>
          )}
        </dd>
      </dl>
      {getContent()}
    </>
  );
};

export default ActiveDetail;

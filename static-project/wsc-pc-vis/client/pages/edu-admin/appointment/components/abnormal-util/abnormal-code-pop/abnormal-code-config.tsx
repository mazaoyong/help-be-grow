import React from 'react';
import { format } from 'date-fns';
import openLockedDialog from '../lock-course-dialog';
import { IAbnormalCodeCofnig, IAbnormalCodePopProps } from './types';
import get from 'lodash/get';

const abnormalCodeConfig: IAbnormalCodeCofnig[] = [
  {
    code: 0,
    desc: '-',
    popTips: () => ''
  },
  {
    code: 1,
    desc: '已在本日程',
    popTips: () => ''
  },
  {
    code: 2,
    desc: '已在本班',
    popTips: () => ''
  },
  {
    code: 11,
    desc: '按期报班',
    popTips: ({ onMoveClass = () => {} }) => <span>学员通过按期报班，不支持直接添加。请通过调班加入本班 <a href="javascript: void(0);" onClick={onMoveClass}>立即调班</a></span>
  },
  {
    code: 40,
    desc: '名额不足',
    popTips: ({ appointNumLeft = 0, onNumberChange = () => {} }) =>
      <span>日程剩余名额为{appointNumLeft}, <a href="javascript: void(0);" onClick={onNumberChange}>修改名额</a></span>
  },
  {
    code: 21,
    desc: '课程已到期',
    popTips: ({ joinState, mode = 'schedule' }: IAbnormalCodePopProps) => {
      const lessonEndTime = get(joinState, `check.${mode === 'educlass' ? 'classCheckInfo' : 'lessonCheckInfo'}.endTime`);
      const assertEndTime = get(joinState, 'check.assetCheckInfo.endTime');
      return <span>学员课程在{mode === 'educlass' ? '开班' : '上课'}日期（{lessonEndTime ? format(lessonEndTime, 'MM月DD日') : '-'}）前已到期，到期日：{assertEndTime ? format(assertEndTime, 'YYYY-MM-DD') : '-'}</span>;
    }
  },
  {
    code: 10,
    desc: '课程未生效',
    popTips: ({ student }: IAbnormalCodePopProps) => <span>学员课程未生效，需手动生效学员课程。<a target="_blank" rel="noopener noreferrer" href={`${window._global.url.v4}/vis/edu/page/student#/detail/${student &&
      student.id}`}>立即生效</a></span>
  },
  {
    code: 20,
    desc: '课程未生效',
    popTips: ({ joinState }: IAbnormalCodePopProps) => {
      const lessonStartTime = get(joinState, 'check.lessonCheckInfo.startTime');
      const assertStartTime = get(joinState, 'check.assetCheckInfo.startTime');
      return <>
        <div>学员课程在上课日期（{lessonStartTime ? format(lessonStartTime, 'MM月DD日') : '-'}）前未</div>
        <div>生效，生效日：{assertStartTime ? format(assertStartTime, 'YYYY-MM-DD') : '-'}</div>
      </>;
    }
  },
  {
    code: 22,
    desc: '课程未生效',
    popTips: ({ joinState }: IAbnormalCodePopProps) => {
      const courseEndTime = get(joinState, `check.classCheckInfo.endTime`);
      const assertStartTime = get(joinState, 'check.assetCheckInfo.startTime');
      return <><div>学员课程在开班日期（{courseEndTime ? format(courseEndTime, 'MM月DD日') : '-'}）前未</div>
        <div>生效，生效日：{assertStartTime ? format(assertStartTime, 'YYYY-MM-DD') : '-'}</div></>;
    }
  },
  {
    code: 30,
    desc: '课时不足',
    popTips: ({ joinState, mode = 'schedule' }: IAbnormalCodePopProps) => {
      const availableNum = get(joinState, 'check.assetCheckInfo.available') || 0;
      const consumeNum = get(joinState, `check.lessonCheckInfo.consumeNum`) || 0;
      return <span>可用课时为{availableNum / 100}{mode === 'educlass' ? '' : `，本节课需扣除${consumeNum / 100}课时`}</span>;
    }
  },
  {
    code: 31,
    desc: '课时不足',
    popTips: ({ joinState, kdtId = _global.kdtId, onConfirm = () => {}, mode = 'schedule', studentLessonNo, isEdit }: IAbnormalCodePopProps) => {
      const availableNum = get(joinState, 'check.assetCheckInfo.available') || 0;
      const consumeNum = get(joinState, 'check.lessonCheckInfo.consumeNum') || 0;
      const lockedNum = get(joinState, 'check.assetCheckInfo.locked') || 0;
      const assetNo = get(joinState, 'check.assetCheckInfo.assetNo') || '';
      const needRemoved = get(joinState, 'check.assetCheckInfo.needRemoved') || 0;
      // eslint-disable-next-line max-len
      return <><div>可用课时为{availableNum / 100}{mode === 'educlass' ? '' : `，本节课需扣除${consumeNum / 100}课时`}，</div>
        <div>有{lockedNum / 100}课时已被其他日程冻结，可<a href="javascript: void(0);" onClick={() => {
          openLockedDialog({
            available: availableNum,
            needRemoved: needRemoved,
            isEdit: isEdit,
            consumeNum: consumeNum,
            locked: lockedNum,
            kdtId,
            assetNos: [ assetNo ],
            onConfirm,
            studentLessonNo: studentLessonNo || '',
          });
        }}>前往取消日程</a></div></>;
    }
  }
];

export default abnormalCodeConfig;

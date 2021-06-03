import { Pop } from '@zent/compat';
import React, { ReactNode } from 'react';
import { TSiginTipProps, assetCourseType } from '../types';
import { format } from 'date-fns';
import openCourseDialog from '../../course-list-dialog';

export const getTitle: (type: number) => string = (type) => {
  let title: string = '';
  switch (type) {
    case 0:
      title = '签到';
      break;
    case 1:
      title = '标记请假';
      break;
    case 2:
      title = '标记未到';
      break;
  }

  return title;
};

const popNum: (type: number, activeStudentNames: string[]) => ReactNode = (type, activeStudentNames) => {
  return <Pop trigger='hover' position='bottom-center' content={<div>
    <div style={{ marginBottom: '15px' }}>以下为{getTitle(type)}生效的学员：</div>
    {activeStudentNames.map((item, index) => {
      return <div key={index}>{index + 1}. {item}</div>;
    })}
  </div>}><a>{activeStudentNames.length}</a></Pop>;
};

export const signinTips: TSiginTipProps[] = [
  { // 签到生效，触发资产生效，需扣课时，需移除日程
    code: 1,
    bodyRender: ({ consumeNum, activeTime, kdtId, cancelStudentLessonNum, isbatch, activeStudentNames = [], assetNos = [], assetNo = '', type = 0 }) => {
      return <span>确定后需扣除{consumeNum / 100}课时，同时{isbatch ? <span>
        {popNum(type, activeStudentNames)}名学员的</span> : ''}课程{format(activeTime, 'MM月DD日')}开始生效，此前的 <a href="javascript: void(0);" onClick={() => {
        openCourseDialog({ isbatch, endTime: parseInt(activeTime), kdtId, assetNos: isbatch ? assetNos : [ assetNo ] });
      }}>{cancelStudentLessonNum}</a> 个日程将自动失效</span>;
    },
  },
  { // 签到生效，触发资产生效，需扣课时，不需移除日程
    code: 2,
    bodyRender: ({ consumeNum, activeTime, activeStudentNames = [], isbatch, type = 0 }) => {
      return <span>确定后需扣除{consumeNum / 100}课时, 同时{isbatch ? <span>
        {popNum(type, activeStudentNames)}名学员的</span> : ''}课程{format(activeTime, 'MM月DD日')}开始生效</span>;
    },
  },
  { // 签到生效，不触发资产生效，需扣课时，需移除日程
    code: 3,
    bodyRender: ({ activeStudentNames = [], kdtId, activeTime, cancelStudentLessonNum, isbatch, assetNos = [], assetNo = '', type = 0 }) => {
      return <span>确定后{isbatch ? <span>
        {popNum(type, activeStudentNames)}名学员的</span> : ''}课程{format(activeTime, 'MM月DD日')}开始生效，此前的 <a href="javascript: void(0);" onClick={() => {
        openCourseDialog({ isbatch, endTime: parseInt(activeTime), kdtId, assetNos: isbatch ? assetNos : [ assetNo ] });
      }}>{cancelStudentLessonNum}</a> 个日程将自动失效</span>;
    },
  },
  { // 签到生效，触发资产生效，不需扣课时，不需移除日程
    code: 4,
    bodyRender: ({ activeTime, isbatch, activeStudentNames = [], type = 0 }) => {
      return <span>确定后{isbatch ? <span>
        {popNum(type, activeStudentNames)}名学员的</span> : ''}课程{format(activeTime, 'MM月DD日')}开始生效</span>;
    },
  },
  { // 签到生效，不触发资产生效，需扣课时，不需移除日程
    code: 5,
    bodyRender: ({ consumeNum, courseType, isbatch }) => {
      return !isbatch && courseType === assetCourseType.trial
        ? null // 体验课签到，不扣课时。单个体验课签到时不展示下方文案
        : <span>确定后需扣除{consumeNum / 100}课时</span>;
    },
  },
  { // 签到生效，不触发资产生效，不需扣课时，不需移除日程
    code: 6,
    bodyRender: () => {
      return '';
    },
  },
];

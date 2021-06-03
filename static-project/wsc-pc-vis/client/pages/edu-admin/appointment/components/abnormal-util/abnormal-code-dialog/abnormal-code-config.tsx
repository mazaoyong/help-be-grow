import React from 'react';
import { format } from 'date-fns';

import { IAbnormalCodeDialogCofnig } from './types';

export const SIGNINTYPES: string[] = ['签到', '标记请假', '标记未到'];

const abnormalCodeConfig: IAbnormalCodeDialogCofnig[] = [
  {
    code: 0,
    desc: '',
    tips: () => ''
  },
  {
    code: 1,
    desc: '已经本日程',
    tips: () => '学员已预约过本节课'
  },
  {
    code: 40,
    desc: '名额不足',
    tips: () => '所选择的日程无剩余名额；请重新选择。'
  },
  {
    code: 21,
    desc: '课程到期',
    tips: (data, type = 0) => {
      const { timeCheckDetail = {} } = data || {};
      return <>
        <p style={{ fontWeight: 'bold' }}>{type >= 0 ? SIGNINTYPES[type] : '预约'}失败，学员的课程有效期已被变更为{timeCheckDetail.assetEndTime ? format(timeCheckDetail.assetEndTime, 'YYYY-MM-DD') : ''}。</p>
        <p> 学员课程在上课日期（{timeCheckDetail.lessonTime ? format(timeCheckDetail.lessonTime, 'MM月DD日') : ''}）前已到期 </p>
      </>;
    }
  },
  {
    code: 30,
    desc: '课时不足',
    tips: (data) => {
      const { numCheckDetail = {} } = data || {};
      return `可用课时为${numCheckDetail.availableNum / 100 || 0}，本节课需扣除${numCheckDetail.consumeNum / 100 || 0}课时`;
    }
  },
  {
    code: 31,
    desc: '课时不足',
    tips: (data) => {
      const { numCheckDetail = {} } = data || {};
      return `可用课时为${numCheckDetail.availableNum / 100 || 0}，本节课需扣除${numCheckDetail.consumeNum / 100 || 0}课时，有${numCheckDetail.lockedNum / 100 || 0}课时已被其他日程冻结，可前往取消日程`;
    }
  },
  {
    code: 100,
    desc: '学员已被移除',
    tips: (data) => {
      const { message = '' } = data || {};
      return `移除原因：${message}`;
    }
  }
];

export default abnormalCodeConfig;

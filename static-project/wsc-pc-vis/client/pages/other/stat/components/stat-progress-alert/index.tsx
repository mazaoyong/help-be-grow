import React from 'react';
import { Alert } from 'zent';
import startOfYesterday from 'date-fns/start_of_yesterday';
import format from 'date-fns/format';
import startOfToday from 'date-fns/start_of_today';
import isBefore from 'date-fns/is_before';
import addHours from 'date-fns/add_hours';
import { yesterdayReady } from '../../common/config';

const yesterday = startOfYesterday();
const today = startOfToday();
const now = new Date();
const isBeforeSevenOclock = isBefore(now, addHours(today, 7));

export default function StatProgressAlert() {
  if (yesterdayReady) return null;
  return (
    <div style={{ borderBottom: '10px solid #f7f8fa' }}>
      <Alert type="info">
        {format(yesterday, 'MM月DD日')}的数据还在整理中，{isBeforeSevenOclock ? '一般会在早上7:00准备好，' : ''}请稍后再来查看。
      </Alert>
    </div>
  );
}

import React from 'react';
import get from 'lodash/get';
import { getClassroomListWithConflict } from '../api';
import { formatValueToQuery } from '../format-value';

export default function getClassRoom(lessonNo, operateType, type, query = {}, pageRequest) {
  const q = formatValueToQuery({ ...this, operateType, keyword: query, type });
  if (lessonNo) {
    q.lessonNo = lessonNo;
  }
  return getClassroomListWithConflict({ query: q, pageRequest }).then(data => {
    const { content } = data;
    const options = [];
    content.forEach(item => {
      const { classroomName, maxStuNum, classroomNo, hasConflict } = item;
      let disabled = null;
      if (hasConflict) {
        const noRepeat = get(this, 'repeatConfig.noRepeat') || {};
        const { startDate, schoolTime } = noRepeat;
        let startTime = new Date().getTime();
        if (startDate && get(schoolTime, '[0]')) {
          startTime = new Date(`${startDate} ${schoolTime[0]}:00`).getTime();
        }
        disabled = {
          state: 'conflict',
          msg: [
            <span className="conflict-text" key="conflict" style={{ color: 'red' }}>
              日程冲突
            </span>,
            <a
              className="conflict-text"
              key="view"
              href={`https://www.youzan.com/v4/vis/edu/page/schedule#/panel/view?classroomNo=${classroomNo}&scheduleType=day&startTime=${startTime}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              查看
            </a>,
          ],
        };
      }
      const maxStuNumHint = maxStuNum > 0 ? `（${maxStuNum}人）` : '';
      options.push({
        value: { classroomNo, classroomName },
        text: `${classroomName}${maxStuNumHint}`,
        disabled,
        selected: item,
      });
    });
    return options;
  });
}

import React from 'react';
import { getClassListWithConflict } from '../api';
import { formatValueToQuery } from '../format-value';

export default function getCourseClass(operateType = 1, type, query = {}, pageRequest) {
  const q = formatValueToQuery({ ...this, operateType, keyword: query, type });
  if (this.eduCourseId) {
    q.eduCourseId = this.eduCourseId.eduCourseId;
  }

  // 上课班级筛选项不需要跟着 kdtId 联动
  delete q.kdtId;
  return getClassListWithConflict({ query: q, pageRequest }).then(data => {
    const { content = [] } = data;
    const options = [];
    content.forEach(item => {
      const { classNo, className, hasConflict, classStatus, startTime, endTime, kdtId, shopName } = item;
      let disabled = {};
      if (classStatus === 3) {
        disabled.state = 'disabled';
        disabled.msg = '已结班';
      } else if (hasConflict) {
        disabled = {
          state: 'conflict',
          msg: [
            <span key="conflict" style={{ color: 'red' }}>
              日程冲突
            </span>,
            <a
              key="view"
              href={`https://www.youzan.com/v4/vis/edu/page/schedule#/panel/view?classNo=${classNo}`}
            >
              查看
            </a>,
          ],
        };
      }
      options.push({
        value: {
          classNo,
          className,
          classStartTime: startTime,
          classEndTime: endTime,
          kdtId,
          shopName,
        },
        text: className,
        disabled,
      });
    });
    return options;
  });
}

import React from 'react';
import { getTeaOrAssWithConflict } from '../api';
import { formatValueToQuery } from '../format-value';

/*
<span key="conflict" style={{ color: 'red' }}>
  日程冲突
</span>,
<a key="view" href="#">
  查看
</a>
*/
function fetchTeacherOrAssistantList(query, pageRequest, namePrefix) {
  return getTeaOrAssWithConflict({ query, pageRequest }).then(data => {
    const { content = [] } = data;
    const options = [];
    content.forEach(item => {
      const { teacherNo, hasConflict } = item;
      let disabled = null;
      if (hasConflict) {
        disabled = {
          state: 'conflict',
          msg: [
            <span
              className="conflict-text"
              key="conflict"
              style={{ color: 'red' }}
            >
              日程冲突
            </span>,
            <a
              className="conflict-text"
              key="view"
              href={`https://www.youzan.com/v4/vis/edu/page/schedule#/panel/view?teacherNo=${teacherNo}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              查看
            </a>,
          ],
        };
      }
      const teacherShowName = item.teacherName ? item.teacherName : item.staffName;
      options.push({
        value: {
          teacherNo,
          [`${namePrefix}Name`]: teacherShowName,
        },
        text: teacherShowName,
        disabled: namePrefix === 'assistant' ? false : disabled, // 助教选择组件使用了新的select组件，disabled展示逻辑不同
        total: data.total,
        extra: disabled && namePrefix === 'assistant' ? (<span className="option-conflict">{disabled.msg}</span>) : '',
      });
    });
    return options;
  });
}

function getAssistantList(lessonNo, operateType, type, query, pageRequest) {
  const q = formatValueToQuery({ ...this, operateType, keyword: query, name: query, type });
  q.type = 1;
  if (lessonNo) {
    q.lessonNo = lessonNo;
  }
  return fetchTeacherOrAssistantList(q, pageRequest, 'assistant');
}

function getTeacherList(lessonNo, operateType, type, query, pageRequest) {
  const q = formatValueToQuery({ ...this, operateType, keyword: query, name: query, type });
  q.type = 1;
  if (lessonNo) {
    q.lessonNo = lessonNo;
  }
  return fetchTeacherOrAssistantList(q, pageRequest, 'teacher');
}

// 选择老师还是助教
export { getTeacherList, getAssistantList };

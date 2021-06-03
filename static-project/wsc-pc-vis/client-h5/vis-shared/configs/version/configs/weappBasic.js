export default {
  scheduleTab: {
    type: 'array',
    configs: [
      { key: 'reject', value: { name: 'lesson' } },
    ],
  },
  workTableBtns: {
    type: 'array',
    configs: [
      {
        key: 'reject',
        value(btn) {
          return btn.labelName === '家校圈' || btn.labelName === '查看课表';
        },
      },
    ],
  },
  scheduleFormFields: {
    configs: [
      {
        key: 'reject',
        value(field) {
          return [
            'teacherNo',
            'assistantNos',
            'classroomNo',
          ].indexOf(field.name) > -1;
        },
      },
    ],
  },
  scheduleSearchTypes: {
    configs: [
      { key: 'reject', value: { text: '课程' } },
    ],
  },
};

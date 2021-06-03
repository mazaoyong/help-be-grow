import React from 'react';
import { ITableColumn } from '@zent/compat';
import { desensitivePhone } from 'fns/text/caculate';

const columns: Array<ITableColumn> = [
  {
    title: '学员',
    name: 'name',
    bodyRender: ({ student = {} }) => {
      return <span>{student.name || ''}</span>;
    },
  },
  {
    title: '联系人手机',
    name: 'mobile',
    bodyRender: ({ student = {} }) => {
      return <span>{desensitivePhone(student.mobile || '')}</span>;
    },
  },
  {
    title: '家庭账号',
    textAlign: 'right',
    name: 'familyMemberNames',
    bodyRender: ({ familyMemberNames = [] }) => {
      return <span>{familyMemberNames.join('|')}</span>;
    },
  },
];

export { columns };

import React from 'react';
import { LinkGroup } from '@youzan/ebiz-components';

export default function(methods) {
  return [
    {
      title: '标签分组',
      bodyRender(row) {
        const { name, multiSelect } = row;
        return `${name}${multiSelect ? '(可多选)' : ''}`;
      },
    },
    {
      title: '操作',
      width: '90px',
      textAlign: 'right',
      bodyRender(row) {
        const { groupId, name, multiSelect } = row;
        return <LinkGroup data={[
          <a
            key={`edit-${groupId}`}
            onClick={methods.handleEditGroup(groupId, name, multiSelect)}
          >修改</a>,
          <a
            key={`delete-${groupId}`}
            onClick={methods.handleDeleteGroup(groupId, name, multiSelect)}
          >删除</a>,
        ]}/>;
      },
    },
  ];
}

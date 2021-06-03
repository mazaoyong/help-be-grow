import React, { useEffect, useState } from 'react';
import promiseCallback from 'fns/promise-callback';
import { Dialog, ClickTable, LinkGroup } from '@youzan/ebiz-components';
import { Button } from 'zent';

import { findSourceGroupList, deleteSourceGroup } from '../../api/group';
import { AddGroup, UpdateGroup, DeleteGroup } from '../dialogs';

import './styles.scss';

const { openDialog } = Dialog;
// 分组来源,点击分组来源之后切换相对应的来源页
const SourceGroups = ({ kdtId, clientHeight, currentGroup, onSwitchGroup }) => {
  const [groupList, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupList = keep => {
    setLoading(true);
    promiseCallback(
      findSourceGroupList({
        kdtId,
        needSystemDefault: true,
      }),
      data => {
        setGroups(data);
        if (!keep) {
          const customSourceGroup = data && data[0] && (data[0].sourceGroupType === 2);
          onSwitchGroup(customSourceGroup ? data[0] : { groupId: 0 });
        }
      }
    ).finally(() => setLoading(false));
  };

  const addSourceGroup = () => {
    openDialog(AddGroup, {
      title: '添加分组',
    }).afterClosed().then(fetchGroupList);
  };

  const handleEditGroup = (groupId, name) => e => {
    e.stopPropagation();
    openDialog(UpdateGroup, {
      title: '修改分组',
      data: {
        groupId,
        name,
      },
    }).afterClosed().then(() => fetchGroupList(true));
  };

  const handleDeleteGroup = (groupId, groupName) => e => {
    e.stopPropagation();
    openDialog(DeleteGroup, {
      title: '删除分组',
      className: 'deletedialog',
      data: {
        deleteSourceGroup,
        groupId,
      },
    }).afterClosed().then(fetchGroupList);
  };

  const columns = [
    {
      title: '来源分组',
      name: 'name',
    },
    {
      title: '操作',
      width: '90px',
      textAlign: 'right',
      bodyRender(row) {
        const { groupId, name, sourceGroupType } = row;
        if (sourceGroupType !== 2) {
          return <div className="edusource-group-disabled">系统默认，不可修改</div>;
        }
        return <LinkGroup data={[
          <a
            key={`edit-${groupId}`}
            onClick={handleEditGroup(groupId, name)}
          >修改</a>,
          <a
            key={`delete-${groupId}`}
            onClick={handleDeleteGroup(groupId, name)}
          >删除</a>,
        ]}/>;
      },
    },
  ];

  // didmount 获取分组信息
  useEffect(fetchGroupList, [kdtId]);

  const groupId = currentGroup && currentGroup.groupId;

  return (
    <div id="sourceGroups" className="source-groups">
      <Button outline type="primary" onClick={addSourceGroup}>添加来源分组</Button>
      <div className="source-groups-table">
        <ClickTable
          loading={loading}
          emptyLabel="暂无数据"
          scroll={{ y: clientHeight - 120 }}
          datasets={groupList}
          columns={columns}
          currentRow={row => row.groupId === groupId}
          disabledRow={row => row.sourceGroupType !== 2}
          onClickRow={row => onSwitchGroup(row)}
        />
      </div>
    </div>
  );
};

export default SourceGroups;

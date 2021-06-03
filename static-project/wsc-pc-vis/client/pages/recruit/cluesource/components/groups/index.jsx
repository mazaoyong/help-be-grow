import React, { useEffect, useState } from 'react';
import promiseCallback from 'fns/promise-callback';
import { Dialog, ClickTable, LinkGroup, EasyList } from '@youzan/ebiz-components';
import { Button, Notify } from 'zent';

import { findSourceGroupList, deleteSourceGroup } from '../../api/group';
import { AddGroup, UpdateGroup } from '../dialogs';

import './styles.scss';

const { GridPop } = EasyList;
const { openDialog } = Dialog;

const stopPropagation = (e) => {
  e.stopPropagation();
};

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

  const handleDeleteGroup = (groupId) => {
    if (!groupId) {
      Notify.error('缺少 groupId');
      return Promise.reject('');
    }
    const payload = { groupId };

    return deleteSourceGroup(payload).then(() => {
      Notify.success('删除分组成功');
      fetchGroupList();
    });
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
          <span
            key={`delete-${groupId}`}
            onClick={stopPropagation}
            className="source-group-delete-action"
          >
            <GridPop
              trigger="click"
              position="top-center"
              text="删除"
              content={<>如果删除分组，当前分组下的来源也会<br />被删除，你确认删除吗？</>}
              onConfirm={() => {
                return handleDeleteGroup(groupId);
              }}
              onCancel={() => {}}
            />
          </span>,
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

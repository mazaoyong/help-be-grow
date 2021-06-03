import React, { useEffect, useState } from 'react';
import { Dialog, ClickTable } from '@youzan/ebiz-components';
import { Button as SamButton } from '@youzan/sam-components';
import { Notify } from 'zent';
import { get } from 'lodash';

import { getTagGroupList, createTagGroup, updateTagGroup, deleteTagGroup } from '../../api/group';
import groupConfig from '../../utils/group-config';
import { AddGroup, ModifyGroup, DeleteGroup } from '../dialogs';
import './styles.scss';

const { openDialog } = Dialog;
// 分组标签,点击分组标签之后切换相对应的标签页
const TagGroups = props => {
  const [groupList, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupList = keep => {
    setLoading(true);
    getTagGroupList()
      .then(data => {
        setGroups(data);
        if (!keep) {
          props.onSwitchGroup(data[0]);
        }
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchGroupList, []);

  const addTagGroup = () => {
    openDialog(AddGroup, {
      title: '添加分组',
      data: { createTagGroup },
    }).afterClosed().then(fetchGroupList);
  };

  const handleEditGroup = (groupId, name, multiSelect) => e => {
    e.stopPropagation();
    openDialog(ModifyGroup, {
      title: '修改分组',
      data: {
        updateTagGroup,
        groupId,
        name,
        multiSelect,
      },
    }).afterClosed().then(() => fetchGroupList(true));
  };

  const handleDeleteGroup = (groupId, groupName, multiSelect) => e => {
    e.stopPropagation();
    openDialog(DeleteGroup, {
      title: '删除分组',
      className: 'deleteDialog',
      data: {
        deleteTagGroup,
        groupId,
      },
    }).afterClosed().then(fetchGroupList);
  };

  return (
    <div className="tag-groups">
      <SamButton name="编辑" onClick={addTagGroup}>添加标签分组</SamButton>
      <div className="tag-groups-table">
        <ClickTable
          loading={loading}
          emptyLabel="暂无数据"
          scroll={{ y: props.clientHeight - 120 }}
          datasets={groupList}
          columns={groupConfig({ handleEditGroup, handleDeleteGroup })}
          currentRow={row => row.groupId === get(props, 'currentGroup.groupId')}
          onClickRow={row => props.onSwitchGroup(row)}
        />
      </div>
    </div>
  );
};

export default TagGroups;

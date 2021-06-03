import React, { Component } from 'react';
import { Button, Grid, Notify, Checkbox } from 'zent';
import { get, isEqual } from 'lodash';
import { format } from 'date-fns';
import { Dialog, LinkGroup, ListPopupEditor } from '@youzan/ebiz-components';
import { Button as SamButton, Link as SamLink, checkAccess } from '@youzan/sam-components';

import { nonnegaIntValidator } from 'fns/validation/nonnega-int';
import promiseCallback from 'fns/promise-callback';

import {
  getTagList,
  createTag,
  updateTag,
  deleteTags,
  transTagGroup,
} from '../../api/list';
import { AddTag, ModifyTag, DeleteTags, TransGroup } from '../dialogs';
import './styles.scss';

const { openDialog } = Dialog;
const PAGESIZE = 20;
const initPageInfo = {
  current: 1,
  total: 0,
  pageSize: PAGESIZE,
};

class TagList extends Component {
  state = {
    loading: false,
    pageInfo: initPageInfo,
    datasets: [],
    selectedRowKeys: [],
  };

  componentDidUpdate(prevProps) {
    // 如果前后两个group不一致
    if (!isEqual(prevProps.currentGroup, this.props.currentGroup)) {
      this.fetchTagList(true);
    }
  }

  columns = [
    {
      title: '标签名称',
      name: 'name',
    },
    {
      title: '序号',
      width: '90px',
      bodyRender: row => {
        return (
          <ListPopupEditor
            type="NUM"
            samName="编辑"
            initialValue={row.serialNo}
            validate={nonnegaIntValidator}
            onSubmit={this.handleQuickEditSerialNo(row)}>
            {row.serialNo}
          </ListPopupEditor>
        );
      },
    },
    {
      title: '创建时间',
      width: '150px',
      bodyRender: ({ createdAt }) => {
        if (createdAt) {
          return format(createdAt, 'YYYY-MM-DD HH:mm:ss');
        }
        return '-';
      },
    },
    {
      title: '操作',
      width: '100px',
      textAlign: 'right',
      bodyRender: row => {
        const { tagId, name, serialNo } = row;
        return <LinkGroup data={[
          <SamLink
            name="编辑"
            key={`edit-${tagId}`}
            onClick={this.handleEditTag(tagId, name, serialNo)}
          >编辑</SamLink>,
          <SamLink
            name="编辑"
            key={`delete-${tagId}`}
            onClick={this.handleDeleteTag([tagId], name)}
          >删除</SamLink>,
        ]}/>;
      },
    },
  ];

  fetchTagList = resetPage => {
    const { groupId } = this.props.currentGroup || {};
    if (!groupId) {
      this.resetData();
      return;
    }
    if (resetPage) {
      this.resetPageNumber();
    }
    this.setState({ loading: true }, () => {
      getTagList({
        query: {
          groupId,
        },
        pageRequest: this.formatParams(this.state.pageInfo),
      }).then(data => {
        const { pageInfo } = this.state;
        const { total = 0 } = data;
        this.setState({
          // 删除原有选择的选项
          datasets: get(data, 'content') || [],
          selectedRowKeys: [],
          pageInfo: {
            ...pageInfo,
            total,
          },
        });
      }).catch(err => {
        Notify.error(err);
      }).finally(() => {
        this.setState({ loading: false });
      });
    });
  };

  resetData = () => {
    this.setState({
      datasets: [],
      pageInfo: {
        current: 1,
        total: 0,
        pageSize: 20,
      },
    });
  };

  resetPageNumber = () => {
    const pageInfo = {
      ...this.state.pageInfo,
      current: 1,
    };
    this.setState({
      pageInfo,
    });
  };

  // 表格变化
  handleTableChange = (tabConf) => {
    const { current } = tabConf;
    const { pageInfo } = this.state;
    this.setState(
      {
        pageInfo: Object.assign(pageInfo, { current }),
        loading: true,
      },
      this.fetchTagList,
    );
  };

  // 选中行的时候
  handleToggleSelectRows = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  // 新建标签
  handleAddTag = () => {
    const { currentGroup } = this.props;
    openDialog(AddTag, {
      title: '添加标签',
      data: { createTag, currentGroup },
    }).afterClosed().then(this.fetchTagList);
  };

  // 编辑标签
  handleEditTag = (tagId, name, serialNo) => () => {
    const groupId = this.props.currentGroup && this.props.currentGroup.groupId;
    openDialog(ModifyTag, {
      title: '编辑标签',
      data: { updateTag, serialNo, name, tagId, groupId },
    }).afterClosed().then(this.fetchTagList);
  };

  // 删除标签
  handleDeleteTag = (tagIds, name) => () => {
    openDialog(DeleteTags, {
      title: '删除标签',
      className: 'deletedialog',
      data: {
        deleteTagOrTags: deleteTags,
        tagIds,
      },
    }).afterClosed().then(this.fetchTagList);
  };

  // 获取选中的行的数据
  getSelectedRows = () => {
    const { selectedRowKeys, datasets } = this.state;
    return datasets.filter(data => selectedRowKeys.some(tagId => tagId === data.tagId));
  };

  // 批量删除
  handleBacthDelete = () => {
    const selectedRows = this.getSelectedRows();
    const tagIds = selectedRows.map(row => row.tagId);
    if (tagIds.length === 0) {
      Notify.error('请至少选择一个标签');
      return void 0;
    }
    openDialog(DeleteTags, {
      title: '批量删除标签',
      className: 'deletedialog',
      data: {
        deleteTagOrTags: deleteTags,
        tagIds,
      },
    }).afterClosed().then(this.fetchTagList);
  };

  formatParams = ({ pageSize = 20, current }) => {
    const res = {
      pageNumber: current || 1,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'serial_no',
          },
          {
            direction: 'DESC',
            property: 'created_at',
          },
        ],
      },
    };
    return res;
  };
  // 批量换组
  handleBatchChangeGroup = () => {
    const selectedRows = this.getSelectedRows();
    const tagIds = selectedRows.map(row => row.tagId);
    if (tagIds.length === 0) {
      Notify.error('请至少选择一个标签');
      return void 0;
    }
    openDialog(TransGroup, {
      title: '更换标签分组',
      data: {
        transTagGroup,
        tagIds,
      },
    }).afterClosed().then(() => {
      this.setState({ selectedRowKeys: [] });
      this.fetchTagList();
    });
  };

  // 绑定引用
  bindRef = (name, ref) => (this[name] = ref);

  // 快速编辑编号
  handleQuickEditSerialNo = row => serialNo => {
    const groupId = this.props.currentGroup && this.props.currentGroup.groupId;
    const payload = {
      name: row.name,
      serialNo: Number(serialNo || 0),
      tagId: row.tagId,
      groupId,
    };
    if (+serialNo > 99999999) {
      Notify.error('序号不能超过最大限制99999999');
    } else {
      promiseCallback(
        updateTag(payload),
        ['success', '修改序号成功', this.fetchTagList],
      );
    }
  };

  handleAllSelect = () => {
    const { datasets, selectedRowKeys } = this.state;
    const allSelected = selectedRowKeys.length === datasets.length;
    this.setState({
      selectedRowKeys: allSelected ? [] : datasets.map(item => item.tagId),
    });
  };

  render() {
    const { clientHeight } = this.props;
    const { loading, datasets, pageInfo, selectedRowKeys } = this.state;
    const groupId = this.props.currentGroup && this.props.currentGroup.groupId;
    const cannotSelected = !datasets.length;
    const isChecked = !cannotSelected && selectedRowKeys.length === datasets.length;
    const isIndeterminate = !cannotSelected && !isChecked && selectedRowKeys.length > 0;
    return (
      <div className="tag-list">
        <SamButton name="编辑" type="primary" disabled={!groupId} onClick={this.handleAddTag}>添加标签</SamButton>
        <Grid
          rowKey="tagId"
          className="tag-list-table"
          columns={this.columns}
          onChange={this.handleTableChange}
          loading={loading}
          scroll={{ y: clientHeight - 126 }}
          pageInfo={pageInfo}
          datasets={datasets}
          selection={{
            selectedRowKeys,
            onSelect: this.handleToggleSelectRows,
          }}
        />
        {
          checkAccess('编辑') ? (
            <div className="edu-clue-tags-select">
              <Checkbox
                onClick={this.handleAllSelect}
                indeterminate={isIndeterminate}
                checked={isChecked}
                disabled={cannotSelected}
              />
              <label className="edu-clue-tags-select-all">当页全选</label>
              <Button key="batch-delete" onClick={this.handleBacthDelete}>删除</Button>
              <Button key="batch-change" onClick={this.handleBatchChangeGroup}>换组</Button>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default TagList;

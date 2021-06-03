import { Select } from '@zent/compat';
import promiseCallback from 'fns/promise-callback';
import { Dialog, LinkGroup, ListPopupEditor } from '@youzan/ebiz-components';
import { Button, Grid, Notify, Checkbox } from 'zent';
import { Button as SamButton, Link as SamLink, checkAccess } from '@youzan/sam-components';
import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { format } from 'date-fns';
import { isInStoreCondition } from 'fns/chain';
import { nonnegaIntValidator } from 'fns/validation/nonnega-int';

import {
  findSourcePage,
  updateSource,
  changeGroup,
  findListAllCampus,
} from '../../api/list';
import { AddSource, UpdateSource, DeleteSources, TransGroup } from '../dialogs';
import './styles.scss';

const { openDialog } = Dialog;
const isChainMaster = isInStoreCondition({ supportHqStore: true });

const initPageInfo = {
  current: 1,
  total: 0,
  pageSize: 20,
};

class SourceList extends Component {
  state = {
    loading: false,
    pageInfo: initPageInfo,
    datasets: [],
    selectedRowKeys: [],
    kdtIds: [],
  }

  isOwner = checkAccess('编辑') && window._global.kdtId === this.props.kdtId;

  componentDidMount() {
    if (isChainMaster) {
      findListAllCampus().then(data => {
        const kdtIds = [{
          text: '总店',
          value: window._global.kdtId,
        }].concat(data.map(item => ({
          text: item.shopName,
          value: item.kdtId,
        })));
        this.setState({ kdtIds });
      });
    }
  }

  componentDidUpdate(prevProps) {
    // 如果前后两个group不一致
    const groupDifferent = !isEqual(prevProps.currentGroup, this.props.currentGroup);
    const kdtIdDifferent = !isEqual(prevProps.kdtId, this.props.kdtId);
    if (groupDifferent || kdtIdDifferent) {
      this.getSourceList(true);
    }
  }

  getSourceList = resetPage => {
    const { kdtId } = this.props;
    const { groupId } = this.props.currentGroup || {};
    if (!groupId) {
      this.resetData();
      return;
    }
    if (resetPage) {
      this.resetPageNumber();
    }
    this.setState({ loading: true }, () => {
      findSourcePage({
        query: {
          groupId,
          kdtId,
        },
        pageRequest: this.formatPagetRequest(this.state.pageInfo),
      }).then(data => {
        const { pageInfo } = this.state;
        const { total, content } = data;
        this.setState({
          datasets: content || [],
          pageInfo: {
            ...pageInfo,
            total,
          },
        });
      }).finally(() => this.setState({ loading: false }));
    });
  }

  resetData = () => {
    this.setState({
      datasets: [],
      pageInfo: {
        current: 1,
        total: 0,
        pageSize: 20,
      },
    });
  }

  resetPageNumber = () => {
    const pageInfo = {
      ...this.state.pageInfo,
      current: 1,
    };
    this.setState({
      pageInfo,
    });
  };

  formatPagetRequest = ({ pageSize = 20, current }) => {
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
  }

  // 表格变化
  handleTableChange = config => {
    const { current } = config;
    const { pageInfo } = this.state;
    this.setState(
      {
        pageInfo: Object.assign(pageInfo, { current }),
        loading: true,
      },
      this.getSourceList,
    );
  }

  // 选中行的时候
  handleToggleSelectRows = selectedRowKeys => this.setState({ selectedRowKeys });

  // 新建来源
  handleSourceAdd = () => {
    const currentGroup = this.props.currentGroup || {};
    openDialog(AddSource, {
      title: '添加来源',
      data: {
        groupId: currentGroup.groupId,
      },
    }).afterClosed().then(this.getSourceList);
  }

  // 编辑来源
  handleSourceEdit = (sourceId, name, serialNo) => () => {
    const groupId = this.props.currentGroup && this.props.currentGroup.groupId;
    openDialog(UpdateSource, {
      title: '编辑来源',
      data: {
        updateSource,
        serialNo,
        name,
        sourceId,
        groupId,
      },
    }).afterClosed().then(this.getSourceList);
  }

  // 删除来源
  handleSourceDelete = (sourceIds, name) => () => {
    openDialog(DeleteSources, {
      title: '删除来源',
      className: 'deletedialog',
      data: {
        sourceIds,
      },
    }).afterClosed().then(this.getSourceList);
  }

  // 获取选中的行的数据
  getSelectedRows = () => {
    const { selectedRowKeys, datasets } = this.state;
    return datasets.filter(data => selectedRowKeys.some(sourceId => sourceId === data.sourceId));
  }

  // 批量删除
  handleBacthDelete = () => {
    const selectedRows = this.getSelectedRows();
    const sourceIds = selectedRows.map(row => row.sourceId);
    if (sourceIds.length === 0) {
      Notify.error('请至少选择一个来源');
      return void 0;
    }
    openDialog(DeleteSources, {
      title: '批量删除来源',
      className: 'deletedialog',
      data: {
        sourceIds,
      },
    }).afterClosed().then(this.getSourceList);
  }

  // 批量换租
  handleBatchChangeGroup = () => {
    const selectedRows = this.getSelectedRows();
    const sourceIds = selectedRows.map(row => row.sourceId);
    if (sourceIds.length === 0) {
      Notify.error('请至少选择一个来源');
      return void 0;
    }
    openDialog(TransGroup, {
      title: '更换来源分组',
      data: {
        changeGroup,
        sourceIds,
      },
    }).afterClosed().then(() => {
      this.setState({ selectedRowKeys: [] });
      this.getSourceList();
    });
  }

  // 控制显示快速编辑
  toggleShowEditIcon = (ref, value = '') => () => {
    const ele = this[ref];
    ele.setAttribute('style', `visibility: ${value}`);
  }

  // 绑定引用
  ref = dom => name => (this[name] = dom);

  // 快速编辑编号
  handleQuickEditSerialNo = row => serialNo => {
    const { groupId } = this.props.currentGroup || {};
    const command = {
      name: row.name,
      serialNo: Number(serialNo || 0),
      sourceId: row.sourceId,
      groupId,
    };
    if (+serialNo > 99999999) {
      Notify.error('序号不能超过最大限制99999999');
    } else {
      promiseCallback(
        updateSource({ command }),
        ['success', '修改序号成功', this.getSourceList],
      );
    }
  }

  handleKdtIdSelect = (ev, data) => {
    this.props.onKdtIdChange(data.value);
  }

  handleAllSelect = () => {
    const { datasets, selectedRowKeys } = this.state;
    const allSelected = selectedRowKeys.length === datasets.length;
    this.setState({
      selectedRowKeys: allSelected ? [] : datasets.map(item => item.sourceId),
    });
  };

  render() {
    const { kdtId, clientHeight } = this.props;
    const { loading, datasets, pageInfo, selectedRowKeys, kdtIds } = this.state;
    const groupId = this.props.currentGroup && this.props.currentGroup.groupId;
    const cannotSelected = !datasets.length;
    const allSelected = selectedRowKeys.length === datasets.length;
    return (
      <div className="clue-source-list">
        <div className="clue-source-list-header">
          <SamButton name="编辑" type="primary" disabled={!groupId} onClick={this.handleSourceAdd}>添加来源</SamButton>
          {
            isChainMaster ? (
              <Select
                value={kdtId}
                onChange={this.handleKdtIdSelect}
                data={kdtIds}
                filter={(item, keyword) => item.text.indexOf(keyword) > -1}
              />
            ) : null
          }
        </div>
        <Grid
          className="clue-source-list-table"
          rowKey="sourceId"
          columns={this.columns}
          onChange={this.handleTableChange}
          loading={loading}
          scroll={{ y: clientHeight - 126 }}
          pageInfo={pageInfo}
          datasets={datasets}
          selection={this.isOwner ? {
            selectedRowKeys,
            onSelect: this.handleToggleSelectRows,
          } : null}
          batchComponents={this.isOwner ? [
            <label key="batch-hint">当页全选</label>,
            <Button key="batch-delete" onClick={this.handleBacthDelete}>删除</Button>,
            <Button key="batch-change" onClick={this.handleBatchChangeGroup}>换组</Button>,
          ] : null}
        />
        {this.isOwner ? (
          <div className="edu-clue-source-select">
            <Checkbox
              onClick={this.handleAllSelect}
              checked={(!cannotSelected) && allSelected}
              disabled={cannotSelected}
            />
            <label className="edu-clue-source-select-all">当页全选</label>
            <Button onClick={this.handleBacthDelete}>删除</Button>
            <Button onClick={this.handleBatchChangeGroup}>换组</Button>
          </div>
        ) : null}
      </div>
    );
  }

  columns = [
    {
      title: '来源名称',
      name: 'name',
    },
    {
      title: '序号',
      width: '90px',
      bodyRender: row => {
        return this.isOwner ? (
          <ListPopupEditor
            type="NUM"
            initialValue={row.serialNo}
            validate={nonnegaIntValidator}
            onSubmit={this.handleQuickEditSerialNo(row)}>
            {row.serialNo}
          </ListPopupEditor>
        ) : row.serialNo;
      },
    },
    {
      title: '创建时间',
      width: '120px',
      bodyRender: ({ createdAt }) => {
        if (createdAt) {
          return format(createdAt, 'YYYY-MM-DD HH:mm:ss');
        }
        return '-';
      },
    },
    {
      title: '操作',
      width: '120px',
      textAlign: 'right',
      bodyRender: row => {
        const { kdtId } = this.props;
        const { sourceId, name, serialNo } = row;
        if (isChainMaster && (kdtId !== window._global.kdtId)) {
          return null;
        }
        return <LinkGroup data={[
          <SamLink
            name="编辑"
            key={`edit-${sourceId}`}
            onClick={this.handleSourceEdit(sourceId, name, serialNo)}
          >编辑</SamLink>,
          <SamLink
            name="编辑"
            key={`delete-${sourceId}`}
            onClick={this.handleSourceDelete([sourceId], name)}
          >删除</SamLink>,
        ]}/>;
      },
    },
  ];
}

export default SourceList;

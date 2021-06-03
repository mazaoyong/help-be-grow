import React, { PureComponent } from 'react';
import { Button, Notify, Sweetalert } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import omit from 'lodash/omit';
import { VisList, VisFilterTable } from 'components/vis-list';
import { getFilterOptions, getColumns } from './config';
import { Dialog } from '@youzan/ebiz-components';

import { isEduHqStore } from '@youzan/utils-shop';

import RestoreClueDialog from '../cluepool/components/restore-clue-dialog';
import {
  findPagePowerStaffs,
  findTransferReasonPageByQueryAPI,
  findListAllCampusAPI,
  permanentlyDeleteCluesAPI,
} from '../cluepool/api';
import { findClueInRecycleBinByPage } from './api';

import './style.scss';
const { openDialog } = Dialog;

class ClueRecycle extends PureComponent {
  state = {
    staff: [],
    deleteReasons: [],
    campus: [],
    selected: [],
  };

  loadStaffs = () => {
    findPagePowerStaffs()
      .then(data => {
        const staff = [{ value: '', text: '全部' }].concat(
          data.map(item => ({ value: item.adminId, text: item.name })),
        );
        this.setState({ staff });
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  loadReasons = () => {
    findTransferReasonPageByQueryAPI({
      query: {
        applyTransferClue: 2,
        applyDeleteClue: 1,
        applyGiveUpClue: 2,
      },
      pageRequest: {
        countEnabled: true,
        pageNumber: 1,
        pageSize: 10000,
      },
    })
      .then(data => {
        const deleteReasons = [{ value: '', text: '全部' }].concat(
          data.content.map(item => ({ text: item.reason, value: item.reasonId })),
        );
        this.setState({ deleteReasons });
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  loadCampus = () => {
    findListAllCampusAPI().then(data => {
      const campus = [
        {
          value: '',
          text: '全部',
        },
        {
          value: window._global.kdtId,
          text: '总部',
        },
      ].concat(
        data.map(item => ({
          value: item.kdtId,
          text: item.shopName,
        })),
      );
      this.setState({ campus });
    });
  };

  componentDidMount() {
    // 加载员工列表
    this.loadStaffs();
    // 加载删除原因列表
    this.loadReasons();
    // 总部 加载校区列表
    if (isEduHqStore) {
      this.loadCampus();
    }
  }

  fetchData = ({ pageConditions, filterConditions }) => {
    const { pageNumber } = pageConditions;
    const recycleBinQuery = omit(filterConditions, ['recordDateRange']);

    if (filterConditions.recordDateRange) {
      recycleBinQuery.recordDateRange = {};
      if (filterConditions.recordDateRange[0]) {
        recycleBinQuery.recordDateRange.startTime =
          filterConditions.recordDateRange[0] + ' 00:00:00';
      }
      if (filterConditions.recordDateRange[1]) {
        recycleBinQuery.recordDateRange.endTime = filterConditions.recordDateRange[1] + ' 23:59:59';
      }
    }

    // 空值不要传入
    const queryKeys = Object.keys(filterConditions);
    for (let key of queryKeys) {
      if (recycleBinQuery[key] === '') {
        delete recycleBinQuery[key];
      }
    }

    const params = {
      request: pageConditions,
      recycleBinQuery,
    };

    return findClueInRecycleBinByPage(params)
      .then(data => {
        return {
          datasets: data.content,
          total: data.total,
          current: pageNumber,
          pageSize: 20,
        };
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  getBottomActions = ({ submit, reset }) => {
    return (
      <div>
        <Button type="primary" onClick={submit}>
          筛选
        </Button>
        <a href="javascript:;" onClick={reset} style={{ marginLeft: '15px' }}>
          重置筛选条件
        </a>
      </div>
    );
  };

  onSelect = data => {
    this.setState({ selected: data });
  };

  handleRestore = _data => () => {
    const kdtId = window._global.kdtId;
    const data = _data.filter(Boolean);
    const clueIds = data.filter(item => item.kdtId === kdtId).map(item => item.clueId);
    if (clueIds.length === 0) {
      if (data.length > 0 && isEduHqStore) {
        Notify.error('校区线索无法还原');
      } else {
        Notify.error('请至少选择一条线索');
      }
      return;
    }

    const hasBranch = isEduHqStore && data.length > clueIds.length;
    const dialogRef = openDialog(RestoreClueDialog, {
      dialogId: 'restore-clue-dialog',
      data: {
        clueIds,
        hasBranch,
      },
      title: '还原线索',
      style: {
        width: '515px',
      },
    });

    dialogRef
      .afterClosed()
      .then(() => {
        this.tableDom.refetchData.refresh();
      })
      .catch(err => {
        if (err) {
          Notify.error(err);
        }
      });
  };

  handleHardDelete = _data => () => {
    const kdtId = window._global.kdtId;
    const data = _data.filter(Boolean);
    const clueIds = data.filter(item => item.kdtId === kdtId).map(item => item.clueId);
    if (clueIds.length === 0) {
      if (data.length > 0 && isEduHqStore) {
        Notify.error('校区线索无法永久删除');
      } else {
        Notify.error('请至少选择一条线索');
      }
      return;
    }

    const hasBranch = isEduHqStore && data.length > clueIds.length;

    Sweetalert.confirm({
      content: <p>永久删除后，线索将无法恢复，确定永久删除吗？</p>,
      title: '删除线索',
      confirmText: '确定',
      closeBtn: true,
      onConfirm: () => {
        return permanentlyDeleteCluesAPI(clueIds).then(data => {
          this.tableDom.refetchData.refresh();
          if (data.failedCount > 0) {
            Notify.error(
              `${data.successCount}条线索删除成功，${data.failedCount}条删除失败，请重新处理`,
            );
          } else {
            if (hasBranch) {
              Notify.success(`成功删除${data.successCount}条总部线索，校区线索无法删除`);
            } else {
              Notify.success('删除成功');
            }
          }
        });
      },
    });
  };

  // 删除权限包含了删除和还原
  renderBatchComponents() {
    const batchComponents = [
      data => (
        <SamButton key="restore" name="还原" onClick={this.handleRestore(data)}>
          还原
        </SamButton>
      ),
      data => (
        <SamButton key="hardDelete" name="永久删除" onClick={this.handleHardDelete(data)}>
          永久删除
        </SamButton>
      ),
    ];

    return batchComponents;
  }

  render() {
    const columns = getColumns(this);
    const filterOptions = getFilterOptions(this);

    return (
      <VisList>
        <VisFilterTable
          filterProps={{
            options: filterOptions,
            bottomActions: this.getBottomActions,
          }}
          tableProps={{
            ref: dom => void (this.tableDom = dom),
            pageConfig: {
              pageSizeOptions: [20, 30],
            },
            rowKey: 'clueId',
            selectable: true,
            onSelect: this.onSelect,
            columns: columns,
            initQueries: {},
            batchComponents: this.renderBatchComponents(),
            fetchData: this.fetchData,
            defaultSortType: 'asc',
          }}
        />
      </VisList>
    );
  }
}

export default ClueRecycle;

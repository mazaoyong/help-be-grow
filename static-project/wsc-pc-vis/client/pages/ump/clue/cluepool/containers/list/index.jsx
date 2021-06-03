import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { hot } from 'react-hot-loader';
import { Button, Notify } from 'zent';
import querystring from 'querystring';
import { Button as SamButton } from '@youzan/sam-components';
import { Dialog } from '@youzan/ebiz-components';

import { VisList, VisFilterTable } from 'components/vis-list';
import openAddDialog from '../../components/add-dialog';
import DeleteClueDialog from '../../components/delete-clue-dialog';
import TransferCluesDialog from '../../components/transfer-clue-dialog';
import GiveupCluesDialog from '../../components/giveup-clue-dialog';
import DistributeCluesDialog from '../../components/distribute-clues-dialog';
import TagsFilter from '../../components/tags-filter';
import SourceFilter from '../../components/source-filter';
import OtherFilter from '../../components/other-filter';

import {
  findAll,
  findMine,
  findPool,
  takeCluesAPI,
  findPagePowerStaffs,
  findListAllCampusAPI,
} from '../../api';
import {
  allColumns,
  columns,
  defaultValue,
  allPhaseOptions,
  minePhaseOptions,
  poolPhaseOptions,
} from './config';

import './styles.scss';
import DistributeCluesToSchoolDialog from '../../components/distribute-clues-to-school-dialog';

const { openDialog } = Dialog;
class CluePoolList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      staff: [],
    };

    const pathRegEx = /\/([0-9a-zA-Z]*)#/.exec(window.location.href);
    this.path = (pathRegEx && pathRegEx[1]) || '';

    this.options = [];
    this.columns = [];
    this.allColumns = [];
  }

  componentDidMount() {
    const locationQuery = window.location.href.split('?');
    const data = querystring.parse(locationQuery[1] || locationQuery[0]);
    if (data && data.add) {
      this.handleAdd();
    }
    findPagePowerStaffs().then(data => {
      const staff = [
        {
          value: '',
          text: '全部',
        },
      ].concat(
        data.map(item => ({
          value: item.adminId,
          text: item.name,
        })),
      );
      this.setState({ staff });
    });
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
  }

  beforeRender = () => {
    this.options = [];
    this.columns = [].concat(columns);
    this.allColumns = [].concat(allColumns);

    this.allOptions = [
      {
        type: 'Input',
        name: 'name',
        label: '姓名：',
        props: {
          width: '200px',
          placeholder: '请输入姓名',
        },
      },
      {
        type: 'Input',
        name: 'telephone',
        label: '手机号：',
        props: {
          width: '200px',
          placeholder: '请输入手机号码',
        },
      },
      {
        type: 'Select',
        name: 'phase',
        label: '阶段：',
        props: {
          placeholder: '',
        },
        data: allPhaseOptions,
      },
      {
        type: 'Custom',
        name: 'sourceId',
        label: '来源：',
        component: SourceFilter,
      },
      {
        type: 'Select',
        name: 'ownerId',
        label: '跟进人：',
        props: {
          placeholder: '全部',
          filter: (item, keyword) => {
            return item.text.includes(keyword);
          },
        },
        data: this.state.staff,
      },
      {
        type: 'Custom',
        name: 'tags',
        label: '标签：',
        component: TagsFilter,
      },
      {
        type: 'Br',
      },
      {
        type: 'Custom',
        name: 'other',
        label: '线索搜索：',
        component: OtherFilter,
      },
    ];

    this.poolOptions = [
      {
        type: 'Input',
        name: 'name',
        label: '姓名：',
        props: {
          width: '200px',
          placeholder: '请输入姓名',
        },
      },
      {
        type: 'Input',
        name: 'telephone',
        label: '手机号：',
        props: {
          width: '200px',
          placeholder: '请输入手机号码',
        },
      },
      {
        type: 'Select',
        name: 'phase',
        label: '阶段：',
        props: {
          placeholder: '',
        },
        data: poolPhaseOptions,
      },
      {
        type: 'Custom',
        name: 'sourceId',
        label: '来源：',
        component: SourceFilter,
      },
      {
        type: 'Custom',
        name: 'tags',
        label: '标签：',
        component: TagsFilter,
      },
      {
        type: 'Br',
      },
      {
        type: 'Custom',
        name: 'other',
        label: '线索搜索：',
        component: OtherFilter,
      },
    ];

    this.mineOptions = [
      {
        type: 'Input',
        name: 'name',
        label: '姓名：',
        props: {
          width: '200px',
          placeholder: '请输入姓名',
        },
      },
      {
        type: 'Input',
        name: 'telephone',
        label: '手机号：',
        props: {
          width: '200px',
          placeholder: '请输入手机号码',
        },
      },
      {
        type: 'Select',
        name: 'phase',
        label: '阶段：',
        props: {
          placeholder: '',
        },
        data: minePhaseOptions,
      },
      {
        type: 'Custom',
        name: 'sourceId',
        label: '来源：',
        component: SourceFilter,
      },
      {
        type: 'Custom',
        name: 'tags',
        label: '标签：',
        component: TagsFilter,
      },
      {
        type: 'Custom',
        name: 'other',
        label: '线索搜索：',
        component: OtherFilter,
      },
    ];

    switch (this.path) {
      case 'mine':
        this.options = this.mineOptions;
        break;
      case 'all':
        this.options = this.allOptions;
        break;
      case 'pool':
        this.options = this.poolOptions;
        break;
      default:
        break;
    }
  };

  fetchData = _params => {
    const params = this.formatParams(_params);
    let method;
    switch (this.path) {
      case 'all':
        method = findAll;
        break;
      case 'pool':
        method = findPool;
        break;
      case 'mine':
        method = findMine;
        params.clueInfoQuery = Object.assign(params.clueInfoQuery || {}, {
          ownerId: window._global.userId,
        });
        break;
    }
    return method(params).then(({ content, total, pageable }) => ({
      datasets: content,
      total: total,
      current: (pageable && pageable.pageNumber) || 1,
    }));
  };

  formatParams = ({ pageConditions = {}, filterConditions = {} }) => {
    const clueInfoQuery = Object.keys(filterConditions).reduce((obj, key) => {
      const item = filterConditions[key];
      if (!item) {
        return obj;
      }
      switch (key) {
        case 'tags':
          obj = Object.assign(obj, { tags: item ? item.map(tag => tag[1]) : [] });
          break;
        case 'other':
          if (item.dateRange && (item.dateRange[0] || item.dateRange[1])) {
            obj = Object.assign(obj, {
              [item.type]: {
                startTime: item.dateRange[0] || 0,
                endTime: item.dateRange[1] || Date.now(),
              },
            });
          }
          break;
        case 'sourceId':
          const _sourceId = item && item[1];
          if (_sourceId) {
            obj = Object.assign(obj, {
              sourceId: _sourceId,
            });
          } else {
            delete obj.sourceId;
          }
          break;
        case 'phase':
          obj = item
            ? Object.assign(obj, {
              [key]: item,
            })
            : obj;
          break;
        default:
          obj = Object.assign(obj, {
            [key]: item,
          });
          break;
      }
      return obj;
    }, {});
    const orders = pageConditions.sort.orders.map(order => {
      // reset default sort
      if (order.property === 'created_time') {
        return {
          property: 'recordUpdatedAt',
          direction: 'DESC',
        };
      }
      return order;
    });
    const request = {
      pageNumber: pageConditions.pageNumber,
      pageSize: pageConditions.pageSize,
      sort: {
        orders,
      },
    };
    return {
      request,
      clueInfoQuery,
    };
  };

  renderBottomAction = ({ submit, reset }) => (
    <>
      <Button type="primary" onClick={submit}>
        筛选
      </Button>
      <span className="filter__actions__reset" onClick={reset}>
        重置筛选条件
      </span>
    </>
  );

  renderBatchComponents = () => {
    let batchComponents = null;
    switch (this.path) {
      case 'mine':
        batchComponents = [
          <span key="all">当页全选</span>,
          data => (
            <SamButton key="tranOther" name="转让" onClick={this.handleTransfer(data)}>
              转让
            </SamButton>
          ),
          data => (
            <SamButton key="aban" name="放弃" onClick={this.handleGiveUp(data)}>
              放弃
            </SamButton>
          ),
        ];
        break;
      case 'pool':
        batchComponents = [
          <span key="all">当页全选</span>,
          data => (
            <SamButton key="tranBranch" name="领取" onClick={this.handleTake(data)}>
                领取
            </SamButton>
          ),
          data => (
            <SamButton key="tranHead" name="分配" onClick={this.handleDistribute(data)}>
                分配
            </SamButton>
          ),
          data => (
            <SamButton key="delete" name="删除" onClick={this.handleDelete(data)}>
              删除
            </SamButton>
          ),
        ];
        break;
      default:
        break;
    }
    return batchComponents;
  };

  handleSelected = data => {
    this.setState({ selected: data });
  };

  handleAdd = () => {
    openAddDialog(this.path, this.afterAdd);
  };

  afterAdd = (clueId, userId) => {
    // todo redirect
    const path = userId ? (userId === window._global.userId ? 'mine' : 'all') : 'pool';
    if (clueId) {
      window.location.href = window._global.url.v4 + '/vis/ump/clue/' + path + '#/detail/' + clueId;
    } else {
      this.tableDom.refetchData.refresh();
    }
  };

  handleRetrieve = () => {
    Notify.success('领取成功，请进入我的线索查看');
  };

  handleGiveUp = data => () => {
    const clueIds = data.filter(Boolean).map(item => item.clueId);
    if (clueIds.length === 0) {
      Notify.error('请至少选择一条线索');
      return;
    }
    const dialogRef = openDialog(GiveupCluesDialog, {
      dialogId: 'giveup',
      title: '放弃线索',
      data: {
        clueIds: clueIds,
      },
      style: {
        width: '450px',
      },
    });
    dialogRef
      .afterClosed()
      .then(() => {
        this.afterAdd();
      })
      .catch(err => {
        if (err) {
          Notify.error(err);
        }
      });
  };

  handleTransfer = data => () => {
    const clueIds = data.filter(Boolean).map(item => item.clueId);
    if (clueIds.length === 0) {
      Notify.error('请至少选择一条线索');
      return;
    }
    const dialogRef = openDialog(TransferCluesDialog, {
      dialogId: 'transfer',
      title: '转让线索',
      data: {
        clueIds,
        afterAdd: this.afterAdd,
      },
      style: {
        width: '500px',
      },
    });
    dialogRef
      .afterClosed()
      .then(() => {
        this.afterAdd();
      })
      .catch(err => {
        if (err) {
          Notify.error(err);
        }
      });
  };

  handleTake = data => () => {
    const clueIds = data.filter(Boolean).map(item => item.clueId);
    if (clueIds.length === 0) {
      Notify.error('请至少选择一条线索');
      return;
    }
    takeCluesAPI(clueIds)
      .then(({ failedCount }) => {
        if (failedCount > 0) {
          Notify.error(`有${failedCount}条线索领取失败，请重新再试`);
        } else {
          Notify.success('领取成功！请进入我的线索查看');
        }
        this.afterAdd();
      })
      .catch(err => {
        if (err) {
          Notify.error(err);
        }
      });
  };

  handleDistribute = data => () => {
    const clueIds = data.filter(Boolean).map(item => item.clueId);
    if (clueIds.length === 0) {
      Notify.error('请至少选择一条线索');
      return;
    }
    const dialogRef = openDialog(DistributeCluesDialog, {
      dialogId: 'distribute',
      title: '分配线索',
      data: {
        clueIds,
      },
      style: {
        width: '350px',
      },
    });

    dialogRef
      .afterClosed()
      .then(() => {
        this.afterAdd();
      })
      .catch(err => {
        if (err) {
          Notify.error(err);
        }
      });
  };

  handleDistributeSchool = data => () => {
    const clueIds = data.filter(Boolean).map(item => item.clueId);
    if (clueIds.length === 0) {
      Notify.error('请至少选择一条线索');
      return;
    }
    const dialogRef = openDialog(DistributeCluesToSchoolDialog, {
      dialogId: 'distributeSchool',
      title: '分配给校区',
      data: {
        clueIds,
      },
      style: {
        width: '350px',
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

  handleDelete = _data => () => {
    const data = _data.filter(Boolean);
    if (data.length === 0) {
      Notify.error('请至少选择一条线索');
      return;
    }

    const allowList = data.filter(item => item.phase === 7 && item.kdtId === window._global.kdtId);

    if (allowList.length === 0) {
      Notify.error('待分配线索无法删除，请选择已放弃线索');

      return;
    }

    // 对既不是待分配线索也不是校区线索的线索做处理
    const clueIds = allowList.map(item => item.clueId);
    const dialogRef = openDialog(DeleteClueDialog, {
      dialogId: 'deleteClues',
      title: '删除线索',
      data: {
        clueIds,
        hasUnTreated: allowList.length < data.length,
      },
      style: {
        width: '468px',
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

  render() {
    this.beforeRender();
    return (
      <div className="edu-clue-pool">
        <SamButton name="编辑" type="primary" onClick={this.handleAdd}>
          添加线索
        </SamButton>
        <VisList>
          <VisFilterTable
            filterProps={{
              defaultValue,
              labelWidth: '70px',
              options: this.options,
              bottomActions: this.renderBottomAction,
            }}
            tableProps={{
              ref: dom => {
                this.tableDom = dom;
              },
              pageConfig: {
                pageSizeOptions: [20, 30],
              },
              emptyLabel: '',
              rowKey: 'clueId',
              columns: this.path === 'all' ? this.allColumns : this.columns,
              batchComponents: this.renderBatchComponents(),
              initQueries: defaultValue,
              selectable: this.path !== 'all',
              fetchData: this.fetchData,
              onSelect: this.handleSelected,
              scroll: { x: 1200 },
            }}
          />
        </VisList>
      </div>
    );
  }
}

export default hot(module)(withRouter(CluePoolList));

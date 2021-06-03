import { Pop, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Notify, Dialog } from 'zent';
import { VisButton, VisLink } from 'fns/router';
import { Link as SamLink } from '@youzan/sam-components';
import RouterTabs from '../../components/router-tabs';
import { arrayColumnWrapper, isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import { isRetailMinimalistPartnerStore, isUnifiedPartnerStore } from '@youzan/utils-shop';
import { pageRequest } from 'fns/format';
import SearchInput from 'components/search-input';

import EffectData from '../../components/EffectData';
import { freebieStatus } from '../../constants';
import { getFreebieLists, deleteFreebieActive, invalid } from '../../api';

import { BRANCH_STORE_NAME } from 'constants/chain';

import './styles.scss';

const isHqStore = isInStoreCondition({
  supportHqStore: true,
});

const isBranchStore = isInStoreCondition({
  supportBranchStore: true,
});

const partnerStore = isRetailMinimalistPartnerStore || isUnifiedPartnerStore;

const { openDialog } = Dialog;

export default class ListPage extends Component {
  state = {
    tableLoading: true,
    type: 3,
    datasets: [],
    keyword: '',
    paginator: {
      pageSize: 20, // 每页个数
      current: 1,
      total: 0, // 总条目个数
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.params.type !== prevState.type) {
      return {
        type: nextProps.params.type,
        paginator: { ...prevState.paginator, current: 1 },
      };
    }
    return null;
  }

  componentDidMount() {
    this.getFreebieLists();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.type !== this.state.type) {
      this.getFreebieLists();
    }
  }

  handleSearchChange = evt => {
    this.setState({
      keyword: evt.target.value,
    });
  };

  handleTableChange = conf => {
    this.getFreebieLists(conf.current);
  };

  // 查询买赠列表
  getFreebieLists = current => {
    this.setState({
      tableLoading: true,
    });
    const status = (() => {
      if (['0', '1', '2'].includes(this.state.type)) {
        return this.state.type;
      }
      return null;
    })();
    const req = pageRequest({
      keyword: this.state.keyword,
      pageSize: this.state.paginator.pageSize,
      pageNumber: current || this.state.paginator.current,
    });
    if (status) {
      req.zanQuery.status = status;
    }

    getFreebieLists(req)
      .then(({ content, pageable, total }) => {
        const { pageNumber, pageSize } = pageable;
        this.setState({
          datasets: content,
          paginator: {
            pageSize, // 每页个数
            current: pageNumber,
            total: total, // 总条目个数
          },
        });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          tableLoading: false,
        });
      });
  };

  handleInvalid = id => () => {
    this.setState({
      tableLoading: true,
    });
    invalid({ id }).then(() => {
      this.getFreebieLists();
      Notify.success('成功失效！');
    }).catch(msg => {
      Notify.error(msg);
      this.setState({
        tableLoading: false,
      });
    }).finally(() => {
      this.getFreebieLists();
    });
  }

  // 删除买赠活动
  deleteFreebieActive(id) {
    this.setState({
      tableLoading: true,
    });
    deleteFreebieActive({ id })
      .then(() => {
        Notify.success('删除成功！');
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({
          tableLoading: false,
        });
      })
      .finally(() => {
        this.getFreebieLists();
      });
  }

  // 打开效果数据弹窗
  openEffectDataDialog(item) {
    const dialogId = 'EFFECT_DATA_DIALOG';
    const title = isHqStore ? `效果数据（总部查看的所有${BRANCH_STORE_NAME}的买赠数据）` : '效果数据';

    openDialog({
      dialogId,
      title,
      style: {
        width: '780px',
      },
      children: <EffectData name={item.name} id={item.id} />,
    });
  }

  getColumns() {
    const columns = [
      {
        title: '活动名称',
        name: 'name',
        width: '185px',
        fixed: 'left',
      },
      {
        title: `适用${BRANCH_STORE_NAME}`,
        chainState: isHqStore || partnerStore,
        name: 'campus',
        textAlign: 'left',
        bodyRender: item => {
          return (
            <span>{ item.applicableCampusType ? '全部' : null }</span>
          );
        },
      },
      {
        title: '活动时间',
        width: '180px',
        textAlign: 'left',
        nowrap: true,
        bodyRender: item => {
          return (
            <div>
              {item.startTime} 至<br /> {item.endTime}
            </div>
          );
        },
      },
      {
        title: '活动状态',
        textAlign: 'left',
        bodyRender: ({ status }) => {
          return freebieStatus[status] || '-';
        },
      },
      {
        title: '订单实付金额（元）',
        width: '150px',
        textAlign: 'right',
        bodyRender: item => {
          return !partnerStore ? (item.payAmount / 100).toFixed(2) : '-';
        },
      },
      {
        title: '付款订单数',
        name: 'payCount',
        bodyRender: ({ payCount }) => {
          return !partnerStore ? payCount : '-';
        },
      },
      {
        title: '付款人数',
        name: 'buyNum',
        bodyRender: ({ buyNum }) => {
          return !partnerStore ? buyNum : '-';
        },
      },
      {
        title: '操作',
        width: '150px',
        textAlign: 'right',
        fixed: 'right',
        nowrap: true,
        bodyRender: item => {
          return (
            <div className="pct-freebie-list-operations">
              {
                item.status === 0 ? (
                  <ShowWrapper
                    isInStoreCondition={!partnerStore}
                  >
                    <SamLink onClick={() => this.openEffectDataDialog(item)}>数据</SamLink>
                  </ShowWrapper>
                ) : null
              }
              {
                (item.status === 0 || isBranchStore) ? (
                  <VisLink pctCheck to={`/freebie/view/${item.id}`}>查看</VisLink>
                ) : null
              }
              <ShowWrapper
                isInStoreCondition={!(isInStoreCondition({ supportBranchStore: true }) || isUnifiedPartnerStore)}
              >
                {
                  item.status !== 0 ? (
                    <VisLink pctCheck to={`/freebie/edit/${item.id}`}>编辑</VisLink>
                  ) : null
                }
                {
                  item.status === 1 ? (
                    <Pop
                      trigger="click"
                      position="left-center"
                      content="确定失效?"
                      onConfirm={this.handleInvalid(item.id)}
                    >
                      <Link>失效</Link>
                    </Pop>
                  ) : (
                    <Pop
                      trigger="click"
                      position="left-center"
                      content="确定删除?"
                      onConfirm={() => this.deleteFreebieActive(item.id)}
                    >
                      <Link>删除</Link>
                    </Pop>
                  )
                }
              </ShowWrapper>
            </div>
          );
        },
      },
    ];

    return arrayColumnWrapper(columns);
  }

  render() {
    const { tableLoading, keyword, datasets, paginator } = this.state;

    return (
      <div className="freebie">
        <div className="list-filter clearfix">
          <ShowWrapper
            isInStoreCondition={!(isInStoreCondition({ supportBranchStore: true }) || isUnifiedPartnerStore)}
          >
            <VisButton type="primary" pctCheck to="/freebie/add">
              新建买赠
            </VisButton>
          </ShowWrapper>
          <div className="filter-right">
            <SearchInput
              className="freebie-search-input"
              value={keyword}
              placeholder="搜索活动名称"
              onChange={this.handleSearchChange}
              onPressEnter={() => this.getFreebieLists(1)}
            />
          </div>
        </div>
        <RouterTabs />
        <Table
          className="pct-freebie-list"
          loading={tableLoading}
          columns={this.getColumns()}
          datasets={datasets}
          pageInfo={paginator}
          onChange={conf => {
            this.handleTableChange(conf);
          }}
          scroll={{ x: 1200 }}
        />
      </div>
    );
  }
}

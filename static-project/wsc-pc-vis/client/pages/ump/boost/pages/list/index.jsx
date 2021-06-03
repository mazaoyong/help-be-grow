import { Pop, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Notify, Input } from 'zent';
import { VisLink, VisButton } from 'fns/router';
import { pageRequest } from 'fns/format';
import ajax from 'fns/ajax';
import { deleteBoostAPI, invalidBoostAPI } from '../../api';
import { SchoolTD } from '../../components/shop-number-selector/index';
import { arrayColumnWrapper, isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import { isRetailMinimalistPartnerStore, isUnifiedPartnerStore } from '@youzan/utils-shop';
import Tabs from '../../components/Tabs';
import TipAlert from '../../components/TipAlert';
import Header from '../../components/Header';

import { BRANCH_STORE_NAME } from 'constants/chain';

const isHqStore = isInStoreCondition({
  supportHqStore: true,
});
const isBranchStore = isInStoreCondition({
  supportBranchStore: true,
});

const partnerStore = isRetailMinimalistPartnerStore || isUnifiedPartnerStore;

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      state: props.params.type || 3,
      loading: true,
      page: 1,
      keyword: '',
      totalItem: 0,
      pageSize: 20,
    };
  }

  fetchList = () => {
    const { state, page, pageSize, keyword } = this.state;
    const req = pageRequest({
      state,
      keyword,
      pageSize,
      pageNumber: page,
    });
    this.setState({
      loading: true,
    });

    ajax({
      url: `${window._global.url.v4}/vis/pct/boost/activeList.json`,
      type: 'GET',
      data: req,
    })
      .then(resp => {
        this.setState({
          datasets: resp.content || [],
          totalItem: resp.total,
          loading: false,
        });
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({
          loading: false,
        });
      });
  };

  // 因为componentWillRecieveProps不安全，所以用componentDidUpdate代替
  componentDidUpdate(prevProps) {
    const prevState = prevProps.params.type;
    const curState = this.props.params.type;
    if (curState !== prevState) {
      this.setState({ state: curState }, this.fetchList);
    }
  }

  componentDidMount() {
    this.fetchList();
  }

  getColumns() {
    const fullOrigin = [
      {
        title: '活动名称',
        name: 'title',
        width: '20%',
      },
      {
        title: '有效时间',
        name: 'time',
        width: '20%',
        bodyRender: item => {
          return (
            <span>
              {item.startAt} 至 {item.endAt}
            </span>
          );
        },
      },
      {
        title: '活动状态',
        name: 'state',
        width: '10%',
        bodyRender: item => {
          const state = item.processState;
          const isValid = item.isDelete === 1;
          return (
            <span>
              {isValid ? (
                '已失效'
              ) : (
                <span>
                  {state === 0 ? '未开始' : ''}
                  {state === 1 ? '进行中' : ''}
                  {state === 2 ? '已结束' : ''}
                </span>
              )}
            </span>
          );
        },
      },
      {
        title: '参与活动商品数',
        name: 'joinGoodsNum',
        width: '15%',
        bodyRender: ({ joinGoodsNum }) => {
          return !partnerStore ? joinGoodsNum : '-';
        },
      },
      {
        title: '获取奖励人数',
        name: 'rewardNum',
        width: '12%',
        bodyRender: ({ rewardNum }) => {
          return !partnerStore ? rewardNum : '-';
        },
      },
      {
        title: `适用${BRANCH_STORE_NAME}`,
        chainState: isHqStore || partnerStore,
        name: 'campus',
        width: '8%',
        bodyRender: item => {
          return <SchoolTD data={item} />;
        },
      },
      {
        title: '操作',
        bodyRender: item => {
          const state = item.processState;
          const isDelete = item.isDelete;
          const handleText = isDelete || isBranchStore || isUnifiedPartnerStore || state === 2 ? '查看' : '编辑';
          const renderPop = () => {
            if (isDelete) {
              return (
                <Pop
                  trigger="click"
                  position="left-center"
                  content="确认删除此活动？"
                  onConfirm={() => {
                    this.handleTableDelet(item.id);
                  }}
                >
                  {!isBranchStore ? (<a className="link"> 删除 </a>) : ('')}
                </Pop>
              );
            }
            switch (state) {
              case 1:
                return (
                  <Pop
                    trigger="click"
                    position="left-center"
                    content="确认结束此活动？"
                    onConfirm={() => {
                      this.handleInvalid(item.id);
                    }}
                  >
                    {!isBranchStore ? (<a className="link"> 失效 </a>) : ('')}
                  </Pop>
                );
              default:
                return (
                  <Pop
                    trigger="click"
                    position="left-center"
                    content="确认删除此活动？"
                    onConfirm={() => {
                      this.handleTableDelet(item.id);
                    }}
                  >
                    {!isBranchStore ? (<a className="link"> 删除 </a>) : ('')}
                  </Pop>
                );
            }
          };
          return (
            <div>
              <VisLink
                pctCheck
                to={`/boost/${isDelete || state === 2 ? 'view' : 'edit'}/${item.id}`}
              >
                {handleText}
              </VisLink>
              {!isBranchStore && !isUnifiedPartnerStore ? (<span className="gray divide-line"> | </span>) : ('')}
              {renderPop()}
            </div>
          );
        },
      },
    ];

    return arrayColumnWrapper(fullOrigin);
  }

  tableChange = data => {
    this.setState(
      {
        page: data.current,
      },
      () => {
        this.fetchList();
      },
    );
  };

  handleTableDelet = id => {
    deleteBoostAPI(id)
      .then(() => {
        Notify.success('活动删除成功');
        this.fetchList();
      })
      .catch(msg => {
        Notify.error(msg);
      });
  };

  handleInvalid = id => {
    invalidBoostAPI(id)
      .then(() => {
        Notify.success('活动失效成功');
        this.fetchList();
      })
      .catch(msg => {
        Notify.error(msg);
      });
  };

  handleSearchChange = e => {
    this.setState({
      keyword: e.target.value.trim(),
    });
  };

  handleSearch = () => {
    this.fetchList();
  };

  render() {
    const { datasets, totalItem, pageSize, page, loading } = this.state;
    return (
      <div className='boost-list'>
        <Header />
        <TipAlert />
        <div className="filter-block clearfix">
          <ShowWrapper
            isInStoreCondition={!(isInStoreCondition({ supportBranchStore: true }) || isUnifiedPartnerStore)}
          >
            <VisButton type="primary" pctCheck to="boost/add">
              新建活动
            </VisButton>
          </ShowWrapper>
          <Input
            icon="search"
            className="pull-right"
            onChange={this.handleSearchChange}
            onPressEnter={this.handleSearch}
            placeholder="搜索活动名称"
          />
        </div>
        <Tabs initActiveId={this.props.params.type || (/history/.test(this.props.location.pathname || '') ? '4' : undefined)} />
        <Table
          columns={this.getColumns()}
          datasets={datasets}
          rowKey="id"
          loading={loading}
          onChange={this.tableChange}
          pageInfo={{
            current: page,
            total: totalItem,
            pageSize,
          }}
        />
      </div>
    );
  }
}

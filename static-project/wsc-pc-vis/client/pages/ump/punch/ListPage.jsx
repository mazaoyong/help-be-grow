import { Pop, Tooltip } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Notify } from 'zent';
import SearchInput from 'components/search-input';

import get from 'lodash/get';
import has from 'lodash/has';
// import { compareVersion } from 'shared/fns/compare-version';
import { tabPush, TabLink as Link } from 'fns/tab-push';
import { getPunchListAPI, updatePunchStatusAPI, deletePunchActiveAPI } from './api';

import { pctCheck as validCheck } from 'fns/auth';
import { PUNCH_STATUS } from './constants';
import './style/list.scss';
import { VisGrid, VisList } from 'components/vis-list';

const OPERATOR = { source: window._global.mobile };
// 是否是专享版小程序
// const isCommonWeapp =
//   get(window._global, 'weappStatus.isValid') === false &&
//   get(window._global, 'weappStatus.useCommon') === true;

// 小程序已经绑定并且发布成功，才会有版本号
// const weappVersion = get(window._global, 'weappVersion.releasedVersion');
// 并且版本大于2.17.2
// const hasWeappBinded = weappVersion
//   ? compareVersion(weappVersion, '2.17.2') >= 0
//   : isCommonWeapp === true;

// 微信服务已经绑定
const hasWeixinBinded = has(window._global, 'mpAccount.serviceType');
// 是否为服务号
const isMpAccount = get(window._global, 'mpAccount.serviceType') === 2;

export default class ListPage extends Component {
  state = {
    title: '',
  };

  onCreateClick() {
    validCheck()
      .then(() => {
        tabPush('/punch/add');
      })
      .catch(() => {
        Notify.error('没有操作权限');
      });
  }

  // 上下架群打卡
  updatePunchStatus = (alias, status) => {
    const req = {
      gciAlias: alias,
      status,
      operator: OPERATOR,
    };

    this.VisTable.refetchData.loading();
    updatePunchStatusAPI(req)
      .then(() => {
        const text = status === 1 ? '上架' : '下架';
        this.VisTable.refetchData.refresh(true);
        Notify.success(text + '成功！');
      })
      .catch(msg => {
        this.VisTable.refetchData.cancelLoading();
        Notify.error(msg || '网络错误！');
      });
  };

  // 删除群打卡
  deletePunchActive = alias => {
    const req = {
      gciAlias: alias,
      operator: OPERATOR,
    };

    this.VisTable.refetchData.loading();
    deletePunchActiveAPI(req)
      .then(() => {
        Notify.success('删除成功！');
        this.VisTable.refetchData.refresh();
      })
      .catch(msg => {
        Notify.error(msg || '删除失败！');
        this.VisTable.refetchData.cancelLoading();
      });
  };

  getColumns() {
    return [
      {
        title: '打卡名称',
        name: 'title',
        width: '200px',
        bodyRender: item => {
          return <span className="ellipsis-2">{item.name}</span>;
        },
      },
      {
        title: '开始时间',
        name: 'startAt',
        width: '185px',
        needSort: true,
        bodyRender: item => {
          return item.startAt || '-';
        },
      },
      {
        title: '结束时间',
        name: 'endAt',
        width: '185px',
        needSort: true,
        bodyRender: item => {
          return item.endAt || '-';
        },
      },
      {
        title: '进度(天)',
        bodyRender: item => {
          let activeDay = 1;
          if (item.proceedStatus === 2) {
            activeDay = item.currentDays;
          }
          const path = `/punch/diary/${item.alias}?activeDay=${activeDay}`;

          return <Link to={path}>{item.currentDays + '/' + item.totalDays}</Link>;
        },
      },
      {
        title: '参与人数',
        name: 'joinPersonNum',
        width: '130px',
        bodyRender: item => {
          return <Link to={`/punch/statistics/${item.alias}`}>{item.joinPersonNum}</Link>;
        },
      },
      {
        title: '打卡次数',
        name: 'gciTimes',
        bodyRender: item => {
          return <Link to={`/punch/statistics/${item.alias}`}>{item.gciTimes}</Link>;
        },
      },
      {
        title: '打卡状态',
        bodyRender: ({ proceedStatus }) => {
          return PUNCH_STATUS[proceedStatus] || '-';
        },
      },
      {
        title: '上架状态',
        width: '185px',
        bodyRender: ({ status }) => {
          switch (status) {
            case 1:
              return '已上架';
            case 2:
              return '已下架';
            default:
              return '-';
          }
        },
      },
      {
        title: '操作',
        fixed: 'right',
        textAlign: 'right',
        bodyRender: item => {
          return (
            <div>
              <Link to={`/punch/promote/${item.alias}`} className="ui-link--split">
                推广配置
              </Link>
              <Link to={`/punch/detail/${item.alias}`} className="ui-link--split">
                详情
              </Link>
              {item.status === 1 && (
                <Pop
                  trigger="click"
                  className="punch-pop"
                  position="left-center"
                  content={(
                    <div>
                      下架后所有用户均无法继续参与和查看,
                      <br key="br" />
                      打卡内容，确定下架吗？
                    </div>
                  )}
                  onConfirm={() => this.updatePunchStatus(item.alias, 2)}
                >
                  <span className="ui-link--split"> 下架 </span>
                </Pop>
              )}
              {item.status === 2 && [
                <span
                  className="ui-link--split"
                  key="down"
                  onClick={() => {
                    this.updatePunchStatus(item.alias, 1);
                  }}
                >
                  上架
                </span>,
                <Pop
                  trigger="click"
                  key="delete"
                  position="left-center"
                  content="删除后无法恢复，确定删除此打卡？"
                  onConfirm={() => this.deletePunchActive(item.alias)}
                >
                  <span className="ui-link--split"> 删除 </span>
                </Pop>,
              ]}
            </div>
          );
        },
      },
    ];
  }

  renderAddBtn = () => {
    if (!isMpAccount) {
      return (
        <div className='list-filter-add-tip'>
          <Tooltip
            title='使用群打卡需绑定认证服务号'
            trigger='hover'
            position='bottom-center'
          >
            <Button
              type="primary"
              disabled={true}
              onClick={() => this.onCreateClick()}
            >
              新建打卡
            </Button>
          </Tooltip>
        </div>
      );
    }
    return (
      <Button
        type="primary"
        onClick={() => this.onCreateClick()}
      >
        新建打卡
      </Button>
    );
  }

  renderTips() {
    const { pointsName } = _global;
    if (!isMpAccount) {
      return (
        <span className="order-weapp">
          未绑定认证服务号，会影响语音上传、{pointsName}发放和公众号推广等功能。
          <a
            href={
              hasWeixinBinded
                ? `${_global.url.www}/setting/weixin`
                : `${_global.url.www}/weixin/dashboard`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            去升级
          </a>
        </span>
      );
    }
    return null;
  }

  render() {
    const { title, zanQueries } = this.state;

    return (
      <div className="punch-list-wrapper">
        <div className="app-board">
          <div className="app-board__logo">
            <img src="https://img.yzcdn.cn/wsc/paidcontent/gpunch_logo.png" alt="" />
          </div>
          <div className="app-board__content">
            <h2>群打卡</h2>
            <p>
              教育培训行业的督学营销利器，适合轻量级的课程如每日一练、社群互动、口语打卡等。重塑作业练习环节，让学员学习高卷入、频互动，提升课程的转化率和续费率。
            </p>
          </div>
        </div>
        <div className="list-filter clearfix">
          {this.renderAddBtn()}
          {this.renderTips()}
          <div className="filter-right">
            <SearchInput
              value={title}
              placeholder="搜索打卡名称"
              onChange={this.handleSearchChange}
              onPressEnter={this.handleSearch}
            />
          </div>
        </div>
        <VisList>
          <VisGrid
            ref={table => (this.VisTable = table)}
            columns={this.getColumns()}
            scroll={{ x: 1545 }}
            emptyLabel="还没有打卡活动"
            rowKey="alias"
            fetchData={this.fetchData}
            zanQueries={zanQueries}
          />
        </VisList>
      </div>
    );
  }

  handleSearchChange = (e, value) => {
    this.setState({ title: e.target.value });
  };

  handleSearch = e => {
    this.setState(({ title }) => ({ zanQueries: { title } }));
  };

  fetchData = zanQuery => {
    const conf = this.getFetchParams(zanQuery);
    return getPunchListAPI(conf).then(
      ({ content, total, pageable = { pageNumber: 1, pageSize: 10 } }) => ({
        datasets: content || [],
        total: total || 0,
        current: pageable.pageNumber,
      }),
    );
  };

  getFetchParams(conf) {
    const { pageConditions, filterConditions } = conf;
    const {
      sort: { orders },
      pageSize = 20,
      pageNumber = 1,
    } = pageConditions;
    const { title } = filterConditions;
    const orderBy = orders[0].property === 'created_time' ? 'joinTime' : orders[0].property;

    // orderBy, order, title, page, size
    return {
      title,
      order: orders[0].direction.toLowerCase() || 'desc',
      orderBy,
      size: pageSize || 20,
      page: pageNumber || 1,
    };
  }
}

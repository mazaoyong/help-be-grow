import { Pop, Table } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory, Link } from 'react-router';
import { Button, Notify, Alert } from 'zent';
import format from 'date-fns/format';
import SearchInput from 'components/search-input';
import HelpIcon from 'shared/components/help-icon';
import { arrayColumnWrapper, isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import { UmpAppBoardV2 } from '@youzan/react-components';
import Tabs from './components/Tabs';
import PromotionQRLink from './components/promotion-qr';
import { SchoolTD } from './components/shop-number-selector';
import { isRetailMinimalistPartnerStore, isUnifiedPartnerStore } from '@youzan/utils-shop';

import {
  activityStatusName,
  activityVideoStatusName,
  ACTIVITY_VIDEO_STATUS,
  ZERO_PLACEHOLDER,
  LIST_TIME_FORMAT,
  ACTIVITY_STATUS,
} from './constants';

import { getLists, deleteActive, failureActivity, copyExam } from './api';

const isHqStore = isInStoreCondition({
  supportHqStore: true,
});
const isBranchStore = isInStoreCondition({
  supportBranchStore: true,
});

const partnerStore = isRetailMinimalistPartnerStore || isUnifiedPartnerStore;

const appid = 30834; // 趣味测试appid

export default class ListPage extends Component {
  state = {
    tableLoading: true,
    type: 0,
    datasets: [],
    keyword: '',
    paginator: {
      pageSize: 20, // 每页个数
      current: 1,
      totalItem: 0, // 总条目个数
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.params.type !== prevState.type) {
      return { type: nextProps.params.type };
    }
    return null;
  }

  componentDidMount() {
    this.getList();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.type !== this.state.type) {
      this.getList();
    }
  }

  renderPopTitle = () => {
    const title = '状态';
    const content = (
      <div className="exam-list__table-status-text">
        <div className="table-status-text__line">
          <p className="table-status-text__title">未开始: </p>
          <p className="table-status-text__desc">活动还没开始</p>
        </div>
        <div className="table-status-text__line">
          <p className="table-status-text__title">进行中: </p>
          <p className="table-status-text__desc">活动已开始</p>
        </div>
        <div className="table-status-text__line">
          <p className="table-status-text__title">已结束: </p>
          <p className="table-status-text__desc">活动已结束</p>
        </div>
        <div className="table-status-text__line">
          <p className="table-status-text__title">转码/审核中: </p>
          <p className="table-status-text__desc">题目中的视频正在转码、审核中</p>
        </div>
        <div className="table-status-text__line">
          <p className="table-status-text__title">审核未通过: </p>
          <p className="table-status-text__desc">
            题目中的视频涉嫌违规，已被风控锁定，建议重新上传新视频
          </p>
        </div>
        <div className="table-status-text__line">
          <span className="table-status-text__title">转码失败: </span>
          <span className="table-status-text__desc">题目中的视频转码失败，建议重新上传新视频</span>
        </div>
      </div>
    );
    return (
      <div className="table-column-state">
        {title}
        <HelpIcon help={content} position="top-center" type="help-circle" />
      </div>
    );
  };

  onTableChange = conf => {
    this.getList(conf.current);
  };

  handleSearchChange = e => {
    this.setState({
      keyword: e.target.value,
    });
  };

  handleDuplicate = id => () => {
    copyExam({ examId: id }).then(data => {
      window.open(`${_global.url.v4}/vis/pct/page/exam#/edit?step=1&id=${data}`);
    });
  };

  // 查询列表
  getList = current => {
    this.setState({
      tableLoading: true,
    });

    const req = {
      title: this.state.keyword,
      size: this.state.paginator.pageSize,
      page: current || this.state.paginator.current,
      examState: 0,
    };

    if (Object.keys(activityStatusName).indexOf(`${this.state.type}`) > -1) {
      req.examState = this.state.type;
    }

    getLists(req)
      .then(({ content: items, pageable, total }) => {
        const { pageNumber: page, pageSize } = pageable;
        this.setState({
          datasets: items,
          paginator: {
            pageSize, // 每页个数
            current: page,
            totalItem: total, // 总条目个数
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

  // 删除活动
  deleteActive = id => {
    this.setState({
      loading: true,
    });
    deleteActive({ id })
      .then(() => {
        Notify.success('删除成功！');
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({
          loading: false,
        });
      })
      .finally(() => {
        this.getList();
      });
  };

  // 失效活动
  failureActive = id => {
    this.setState({
      loading: true,
    });
    failureActivity({ id })
      .then(() => {
        Notify.success('操作成功！');
      })
      .catch(msg => {
        Notify.error(msg);
        this.setState({
          loading: false,
        });
      })
      .finally(() => {
        this.getList();
      });
  };

  // 列表状态
  renderActivityStatusName = (examState, status, enabled) => {
    let name = '';
    if ([2, 3].indexOf(status) > -1) {
      name = activityVideoStatusName[status];
    } else if (!enabled) {
      name = '已失效';
    } else {
      name = activityStatusName[examState];
    }
    return <span>{name || ZERO_PLACEHOLDER}</span>;
  };

  // 使失效
  renderFail = item => {
    let elem;

    if (!item.enabled) {
      elem = <span className="exam-list__table-failure-text">已失效&nbsp;|&nbsp;</span>;
    } else {
      if (item.examState === ACTIVITY_STATUS.END) {
        elem = null;
      } else {
        elem = (
          <span>
            <Pop
              trigger="click"
              position="bottom-right"
              content="你确定要将此活动失效?"
              onConfirm={() => this.failureActive(item.id)}
            >
              <Link>使失效</Link>
            </Pop>
            &nbsp;|&nbsp;
          </span>
        );
      }
    }
    return elem;
  };

  getColumns = () => {
    const fullOrigin = [
      {
        title: '测试名称',
        name: 'title',
        width: '20%',
      },
      {
        title: '有效时间',
        width: '20%',
        // textAlign: 'center',
        bodyRender: item => {
          return (
            <div>
              {format(item.startAt, LIST_TIME_FORMAT)} 至<br />{' '}
              {format(item.endAt, LIST_TIME_FORMAT)}
            </div>
          );
        },
      },
      {
        title: this.renderPopTitle(),
        width: '15%',
        // textAlign: 'center',
        bodyRender: ({ examState, status, enabled }) => {
          return this.renderActivityStatusName(examState, status, enabled);
        },
      },
      {
        title: '参与人数',
        // textAlign: 'center',
        bodyRender: (data) => {
          const { id, joinUserCount } = data;
          if (joinUserCount) {
            return isHqStore ? joinUserCount : !partnerStore ? <a href={`${_global.url.v4}/vis/pct/page/exam#/detail/${id}`}>{joinUserCount}</a> : '-';
          }
          return ZERO_PLACEHOLDER;
        },
      },
      {
        title: '适用校区',
        chainState: isHqStore || partnerStore,
        // textAlign: 'center',
        bodyRender: (item) => {
          return <SchoolTD data={item} />;
        },
      },
      {
        title: '操作',
        width: '30%',
        bodyRender: item => {
          const shopforbid = isBranchStore || isUnifiedPartnerStore;
          return (
            <div className="exam-list__table-edit-text">
              {[ACTIVITY_STATUS.UNDO].includes(item.examState) &&
                ![ACTIVITY_VIDEO_STATUS.UNDERREVIEW, ACTIVITY_VIDEO_STATUS.FAIL].includes(item.status)
                ? this.renderPromotion(item, '预览', true)
                : null}
              {
                (item.enableEdit && !shopforbid) ? (
                  <span>
                    <a onClick={this.handleDuplicate(item.id)}>复制</a>
                    <span>&nbsp;|&nbsp;</span>
                  </span>
                ) : null
              }
              {(item.enableEdit && !shopforbid) || shopforbid ? (
                <span>
                  <a
                    href={`${_global.url.v4}/vis/pct/page/exam#/edit?step=1&id=${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {!shopforbid ? '编辑' : '查看'}
                  </a>
                  {(shopforbid &&
                    (item.examState === ACTIVITY_STATUS.END || item.status === ACTIVITY_VIDEO_STATUS.UNDERREVIEW))
                    ? null : (<span>&nbsp;|&nbsp;</span>)}
                </span>
              ) : null}
              {!(
                [
                  ACTIVITY_VIDEO_STATUS.DRAFT,
                  ACTIVITY_VIDEO_STATUS.FAIL,
                  ACTIVITY_VIDEO_STATUS.UNDERREVIEW,
                ].includes(item.status) ||
                !item.enabled ||
                item.examState === ACTIVITY_STATUS.END
              ) && !isHqStore
                ? this.renderPromotion(item, '推广', false)
                : null}
              {!shopforbid && this.renderFail(item)}
              {!shopforbid && <Pop
                trigger="click"
                position="bottom-right"
                content="你确定删除此活动?"
                onConfirm={() => this.deleteActive(item.id)}
              >
                <Link>删除</Link>
              </Pop>}
            </div>
          );
        },
      },
    ];

    return arrayColumnWrapper(fullOrigin);
  };

  // 渲染推广及预览
  renderPromotion = (item, name, isPreview) => {
    const weappStatus = _global.weappStatus || {};
    const hasWeapp = weappStatus.isValid || weappStatus.useCommon;
    return (
      <span>
        <PromotionQRLink
          isPreview={isPreview}
          hideWeapp={(_global.white && !_global.white.canShowExamWeapp) || !hasWeapp}
          name={name}
          info={{
            backgroundPic: item.backgroundPic,
            coverPic: item.coverPic,
            title: item.title,
            questionCount: item.questionCount,
            joinUserCount: item.joinUserCount,
            style: item.style,
            qrCode: item.qrCode,
            redirectUrl: item.redirectUrl,
            alias: item.id,
            previewQrCode: item.previewQrCode,
            identity: item.identity,
          }}
        />
        {(isPreview) ? (<span>&nbsp;|&nbsp;</span>) : (!isBranchStore ? (<span>&nbsp;|&nbsp;</span>) : null)}
      </span>
    );
  };

  render() {
    const { tableLoading, keyword, datasets, paginator } = this.state;
    const chainShopDesc = _global.isYZEdu ? '校区' : '网店';
    return (
      <div>
        <ShowWrapper
          isInStoreCondition={isInStoreCondition({ supportBranchStore: true })}
        >
          <Alert className="text-tip" type="warning">
            趣味测试活动由总部统一配置，{chainShopDesc}无法对内容进行修改，仅可查看
          </Alert>
        </ShowWrapper>
        <div className="market-wrapper">
          <UmpAppBoardV2 id={appid} title="趣味测试" />
        </div>
        <Tabs {...this.props} />
        <div className="list-filter clearfix">
          <ShowWrapper
            isInStoreCondition={!(isInStoreCondition({ supportBranchStore: true }) || isUnifiedPartnerStore)}
          >
            <Button type="primary" onClick={() => hashHistory.push('/add?step=1&id=0')}>
              新建测试
            </Button>
          </ShowWrapper>
          <div className="filter-right">
            <SearchInput
              value={keyword}
              className="search-fixedWidth"
              placeholder="搜索"
              onChange={this.handleSearchChange}
              onPressEnter={() => {
                this.getList();
              }}
            />
          </div>
        </div>
        <Table
          className=""
          loading={tableLoading}
          columns={this.getColumns()}
          datasets={datasets}
          rowKey="item_id"
          pageInfo={paginator}
          onChange={conf => {
            this.onTableChange(conf);
          }}
        />
      </div>
    );
  }
}

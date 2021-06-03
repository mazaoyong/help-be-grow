import React, { Component } from 'react';
import { Link as SamLink } from '@youzan/sam-components';
import { Notify, Sweetalert, Alert } from 'zent';
import { VisButton, VisLink } from 'fns/router';
import { isInStoreCondition, arrayColumnWrapper, ShowWrapper } from 'fns/chain';
import { BRANCH_STORE_NAME } from 'constants/chain';
import { Img } from '@youzan/ebiz-components';
import Promotion from 'components/promotion';
import { VisTable, VisList } from 'components/vis-list';
import { getBenefitList, deleteBenefit, checkBenefitPkgStatus } from '../api';
import { showBdappCode } from 'common/api/request';
import './style.scss';

const { ImgWrap } = Img;
const errMsg = '网络错误';

export default class List extends Component {
  state = {
    pageConfig: {},
    hideBdapp: true,
  };

  componentDidMount() {
    showBdappCode()
      .then(res => {
        if (res.mpId) {
          this.setState({ hideBdapp: false });
        }
      });
  }

  check = item => {
    const alias = item.alias;
    checkBenefitPkgStatus({
      alias,
    }).then(data => {
      if (data === 0) {
        this.handleDeleteClick(alias);
      } else if (data === 1) {
        Sweetalert.confirm({
          content: (
            <p>
              该权益包已关联
              {item.card.name}
              会员卡，是否要删除？
            </p>
          ),
          confirmText: '我再想想',
          cancelText: '永久删除',
          onCancel: () => this.delete(alias),
          onConfirm: () => {},
          parentComponent: this,
        });
      } else if (data === 3) {
        Notify.error('已经关联会员卡，并已有会员领取');
      }
    });
  };

  handleDeleteClick(alias) {
    Sweetalert.confirm({
      content: '删除后已购买的用户将无法看到，且不可恢复，确定删除吗？',
      title: '删除内容',
      className: 'dialog-450',
      confirmText: '我再想想',
      cancelText: '永久删除',
      onCancel: () => {
        this.delete(alias);
      },
    });
  }

  delete = alias => {
    this.VisTable.refetchData.loading();
    deleteBenefit({
      alias,
    })
      .then(() => {
        Notify.success('删除成功');
        this.VisTable.refetchData.refresh();
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
        this.VisTable.refetchData.cancelLoading();
      });
  };

  /**
   * 删除会员权益的描述
   *
   * @return {Array<any>} - 列表数据
   */
  getColumns() {
    const { hideBdapp } = this.state;

    return [
      {
        title: '会员权益名称',
        width: '40%',
        bodyRender: item => {
          return (
            <a
              className="benefit-box clearfix"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="benefit-box__cover">
                <ImgWrap width="75px" height="42px" src={item.cover} fullfill="!100x100.jpg" />
              </div>
              <div className="benefit-box__info">
                <p className="benefit-box__info__title">{item.name}</p>
                {/* <p className="benefit-box__info__desc ellipsis">{item.summary}</p> */}
              </div>
            </a>
          );
        },
      },
      {
        title: '关联会员卡',
        bodyRender: item => {
          if (item.card && item.card.name) {
            return item.card.name;
          }
          return <span className="benefit-box__no-card-name">未关联会员卡</span>;
        },
      },
      {
        title: `适用${BRANCH_STORE_NAME}`,
        bodyRender: item => {
          return '全部';
        },
        chainState: isInStoreCondition({
          supportHqStore: true,
        }),
      },
      {
        title: '操作',
        textAlign: 'right',
        bodyRender: item => {
          return (
            <div>
              <VisLink
                className="ui-link--split"
                to={`/benefit/manage/${item.alias}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                管理权益
              </VisLink>
              <ShowWrapper
                isInStoreCondition={isInStoreCondition({
                  supportBranchStore: true,
                  supportSingleStore: true,
                })}
              >
                <Promotion
                  data={{
                    url: item.url,
                    alias: item.alias,
                    name: item.name,
                    pagepath:
                      `packages/paidcontent/rights/index?kdt_id=${_global.kdtId}&alias=${item.alias}`,
                    webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
                      `https://h5.youzan.com/wscvis/knowledge/index?alias=${
                        item.alias
                      }&page=vipbenefit&kdt_id=${window._global.kdtId || 0}`,
                    )}`,
                    hideBdapp: hideBdapp,
                  }}
                >
                  <span className="ui-link--split">推广</span>
                </Promotion>
              </ShowWrapper>
              <VisLink
                className="ui-link--split"
                to={`/benefit/edit/${item.alias}`}
                rel="noopener noreferrer"
                name="内容管理"
              >
                {isInStoreCondition({ supportHqStore: true, supportSingleStore: true })
                  ? '编辑'
                  : '查看'}
              </VisLink>
              <ShowWrapper
                isInStoreCondition={isInStoreCondition({
                  supportHqStore: true,
                  supportSingleStore: true,
                })}
              >
                <SamLink
                  className="ui-link--split"
                  target="_blank"
                  rel="noopener noreferrer"
                  name="内容管理"
                  onClick={() => this.check(item)}
                >
                  删除
                </SamLink>
              </ShowWrapper>
            </div>
          );
        },
      },
    ];
  }
  render() {
    return (
      <div>
        <div className="app-filter-region">
          <ShowWrapper
            isInStoreCondition={isInStoreCondition({ supportBranchStore: true })}
          >
            <Alert className="text-tip" type="warning">
              会员权益活动由总部统一配置，{BRANCH_STORE_NAME}无法对内容进行修改，仅可查看
            </Alert>
          </ShowWrapper>

          <ShowWrapper
            isInStoreCondition={isInStoreCondition({ supportHqStore: true, supportSingleStore: true })}>
            <div className="list-filter clearfix">
              <VisButton type="primary" pctCheck to="benefit/add">
                新建会员权益
              </VisButton>
              <SamLink
                target="_blank"
                href={`${window._global.url.base}/v4/scrm/membercard`}
                className="manage-vip-card"
                name="活动管理"
              >
                管理会员卡
              </SamLink>
            </div>
          </ShowWrapper>
        </div>
        <VisList>
          <VisTable
            ref={table => (this.VisTable = table)}
            columns={arrayColumnWrapper(this.getColumns())}
            emptyLabel="还没有会员权益"
            rowKey="alias"
            fetchData={this.fetchData}
          />
        </VisList>
      </div>
    );
  }

  fetchData = zanQuery => {
    const conf = this.getFetchParams(zanQuery);
    return getBenefitList(conf).then(data => {
      const { content, pageable = {}, total } = data;
      return {
        datasets: content || [],
        total: total || 0,
        current: pageable.pageNumber,
      };
    });
  };

  getFetchParams(conf) {
    const { pageConditions, filterConditions } = conf;
    const { pageSize = 20, pageNumber = 1 } = pageConditions;
    const { title } = filterConditions;

    // orderBy, order, title, page, size
    return {
      title,
      pageSize,
      pageNumber,
      timestamp: Date.now(),
    };
  }
}

import React, { Component } from 'react';
import { hashHistory, Link } from 'react-router';
import { Tabs, Notify, Sweetalert } from 'zent';
import { ShowWrapper, isInStoreCondition } from 'fns/chain';
import { Img } from '@youzan/ebiz-components';
import Promotion from 'components/promotion';
import ContentList from '../components/content-list';
import ColumnList from '../components/column-list';
import LiveList from '../components/live-list';
import { getBenefitDetail, deleteBenefit, checkBenefitPkgStatus } from '../api';
import { showBdappCode } from 'common/api/request';
import './style.scss';

const { ImgWrap } = Img;
const TabPanel = Tabs.TabPanel;
const errMsg = '网络错误';
const disableLive = isInStoreCondition({
  supportMinifyRetailHqShop: true,
  supportRetailUnitedHqShop: true
});

export default class BenefitContent extends Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line camelcase
    const alias = props.routeParams.benefitAlias;
    this.state = {
      activeId: 'content',
      data: null,
      alias,
      benefitId: 0,
      hideBdapp: true,
    };
  }
  componentDidMount() {
    getBenefitDetail({
      alias: this.state.alias,
    })
      .then(data => {
        this.setState({
          data,
          benefitId: data.id,
        });
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      });

    // 检测是否是百度小程序店铺
    showBdappCode()
      .then(res => {
        if (res.mpId) {
          this.setState({ hideBdapp: false });
        }
      });
  }

  onTabChange = e => {
    this.setState({
      activeId: e,
    });
  };
  check = () => {
    const alias = this.state.alias;
    checkBenefitPkgStatus({
      alias,
    }).then(data => {
      if (data === 0) {
        this.delete();
      } else if (data === 1) {
        Sweetalert.confirm({
          content: (
            <p>
              该权益包已关联
              {this.state.data.card.name}
              会员卡，是否要删除？
            </p>
          ),
          onConfirm: () => this.delete(),
          onCancel: () => {},
          parentComponent: this,
        });
      } else if (data === 3) {
        Notify.error('已经关联会员卡，并已有会员领取');
      }
    });
  };
  delete = () => {
    const alias = this.state.alias;
    deleteBenefit({
      alias,
    })
      .then(() => {
        Notify.success('删除成功');
        hashHistory.push({
          pathname: '/list/benefit',
        });
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      });
  };
  getList = () => {
    const { activeId, alias } = this.state;
    if (!alias) return null;
    if (activeId === 'content') {
      return <ContentList alias={alias} />;
    } else if (activeId === 'live') {
      return <LiveList alias={alias} />;
    }
    return <ColumnList alias={alias} />;
  };
  getHeader = () => {
    const { data } = this.state;
    if (data && data.cover) {
      return (
        <div className="benefit-content__header">
          <div className="cover-box">
            <ImgWrap
              width="140px"
              height="75px"
              src={data.cover}
              fullfill="!140x75.jpg"
              backgroundColor="transparent"
            />
          </div>
          <div className="benefit-content__header__info">
            <p className="benefit-content__header__name">{data.name}</p>
            <p className="benefit-content__header__summary">{data.summary}</p>
            <p className="benefit-content__header__card">
              <span className="benefit-content__header__card__name">{(data.card || {}).name}</span>
              <span className="benefit-content__header__card__num">
                {(data.card || {}).name ? `会员数： ${(data.count || {}).userNum || 0}` : ''}
              </span>
            </p>
            <div className="benefit-content__header__opts">
              <a
                className="ui-link--split"
                target="_blank"
                href={data.url}
                rel="noopener noreferrer"
              >
                预览
              </a>
              <Promotion
                data={{
                  url: data.url,
                  alias: data.alias,
                  name: data.name,
                  pagepath:
                    `packages/paidcontent/rights/index?kdt_id=${_global.kdtId}&alias=${data.alias}`,
                  webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
                    `https://h5.youzan.com/wscvis/knowledge/index?kdt_id=${
                      window._global.kdtId || 0
                    }&page=vipbenefit&alias=${data.alias}`,
                  )}`,
                  hideBdapp: this.state.hideBdapp,
                }}
              >
                <span className="ui-link--split">推广</span>
              </Promotion>
              <Link className="ui-link--split" to={`/edit/${this.state.alias}`}>
                {isInStoreCondition({ supportHqStore: true, supportSingleStore: true })
                  ? '编辑'
                  : '查看'}
              </Link>
              <ShowWrapper
                isInStoreCondition={isInStoreCondition({
                  supportHqStore: true,
                  supportSingleStore: true,
                })}
              >
                <span className="ui-link--split" onClick={this.check}>
                  删除
                </span>
              </ShowWrapper>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  render() {
    return (
      <div className="benefit-content">
        {this.getHeader()}
        <div className="benefit-content__tab">
          <Tabs activeId={this.state.activeId} onChange={this.onTabChange}>
            <TabPanel tab="内容" id="content" />
            <TabPanel tab="专栏" id="column" />
            { !disableLive && <TabPanel tab="直播" id="live" />}
          </Tabs>
        </div>
        {this.getList()}
      </div>
    );
  }
}

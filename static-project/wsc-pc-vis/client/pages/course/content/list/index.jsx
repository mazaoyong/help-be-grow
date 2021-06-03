import { Popover, Pop } from '@zent/compat';
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { visPush, VisLink } from 'fns/router';
import { get } from 'lodash';
import { Button, Notify, Sweetalert, Tag, Icon } from 'zent';
import formateDate from 'zan-utils/date/formatDate';
import { visAjax } from 'fns/new-ajax';
import classnames from 'classnames';
// import Promotion from 'components/promotion';
import { Img, ListPopupEditor, LockWrap } from '@youzan/ebiz-components';
import { ArthurContainer, ArthurDecorator } from '@youzan/arthur-scheduler-react';
import { VisFilterTable, VisList } from 'components/vis-list';
import toCent from '@youzan/utils/money/toCent';
import { openDialog as openDeleteDialog } from '../../components/pct-delete-dialog';

import { nonnegaIntValidator } from 'fns/validation/nonnega-int';
import { pctCheck } from 'fns/auth';
import { renderStatusCloumn, renderItemStatus } from '../CommonFunc';
import { hideOwlAPI } from '../../api/pct/biz';
import { CONTENT_OPTION, MediaType } from '../constant';
import AddCardTabs from '../components/add-card-tabs';
import { getRiskLockAPI } from '../../api/pct/risk-lock';
import { showBdappCode } from 'common/api/request';
import {
  chainSupportHqAndSingleShowWrapper,
  chainSupportOnlyHq,
  chainSupportHqAndSingle,
  chainSupportModify,
  chainSupportUnified,
} from '../chain';
import './style.scss';
import { ShowWrapper, isInStoreCondition } from 'fns/chain';
import { courseGroupSelectConfig } from '../../group/components/WrapCourseGroupSelect';
import buildUrl from '@youzan/utils/url/buildUrl';
import QuickUpdateInfo from '../../components/quickupdate-info';
import { SELL_STATUS_MAP } from '../config';
import * as API from '../api';
import openShortenUrlPromotionDlg from 'components/open-promotion-dialog';
import { compareVersion } from 'shared/fns/compare-version';

const { ImgLockWrap } = Img;

const ChainAddContentTabs = chainSupportHqAndSingleShowWrapper(AddCardTabs);

const supportShowStatus = isInStoreCondition({
  supportUnifiedShop: true,
});

const supportPartnerStatus = isInStoreCondition({
  supportMinifyParterShop: true,
  supportUnifiedPartnerStore: true,
});

// 是否是连锁店铺（包含教育连锁和微商城连锁）
// const isChain = isInStoreCondition({ supportChainStore: true });
// 是否是零售店铺
const isRetail = isInStoreCondition({ supportRetailShop: true });
// const isPartnerShop = isInStoreCondition({ supportUnifiedPartnerStore: true, supportMinifyParterShop: true });
// 是否是零售极简版店铺
// const isRetailMinifyStore = isInStoreCondition({
//   supportMinifyRetailBranchShop: true,
//   supportMinifyRetailHqShop: true,
//   supportMinifyParterShop: true,
// });
// 是否是零售极简版分店
// const isRetailMinifyBranch = isInStoreCondition({ supportMinifyRetailBranchShop: true });

// const { MenuItem } = Menu;

// 序号 title
const HelpEle = (
  <Pop trigger="hover" position="top-center" content="点击数字输入序号，对内容排序，序号越大越靠前">
    <Icon type="help-circle" />
  </Pop>
);

const PriceTitle = () => {
  return <span className="price-title">价格</span>;
};

class ListPage extends Component {
  constructor() {
    super();
    let filterOpt = {
      // sell_status: '',
      seller_types: '0',
      media_type: '0',
      keyword: '',
      status: '0',
    };
    this.state = {
      total: 0,
      filter:
      supportShowStatus
        ? Object.assign({}, filterOpt, { show_in_store: '' })
        : Object.assign({}, filterOpt, { groupId: '' }),
      p: 1,
      pageSize: 20,
      sortBy: 'serial_no',
      sortType: 'desc',
      isLoading: false,
      isRiskLock: 0,
      hideBdapp: true,
    };
  }

  refreshList = () => this.VisTable.refetchData;

  getFetchParams(conf) {
    const { filterConditions, pageConditions } = conf;
    const {
      sort: { orders },
    } = pageConditions;
    const groupId = get(filterConditions, 'groupId.[0]');

    const sortBy = orders[0].property === 'created_time' ? 'serial_no' : orders[0].property;

    let params = {
      title: filterConditions.keyword || '',
      showInStore: filterConditions.show_in_store || 2,
      sellerType: filterConditions.seller_types || 0,
      mediaType: filterConditions.media_type || 0,
      contentStatus: filterConditions.status || 0,
      sortType: orders[0].direction.toLowerCase() || 'desc',
      sortBy,
      subSortBy: 'publish_at',
      pageSize: pageConditions.pageSize || 20,
      page: pageConditions.pageNumber || 1,
      closeVisibility: true,
    };
    groupId && (params.groupId = groupId);
    return params;
  }

  // 排序
  onSerialChange = (item) => (serialNo) => {
    const alias = item.alias;

    this.refreshList().loading();

    API.putSerialNo({
      alias,
      serialNo: Number(serialNo || 0),
    })
      .then((_) => this.refreshList().refresh(true))
      .catch((msg) => {
        this.refreshList().cancelLoading();
        Notify.error(msg);
      });
  };

  // 拼url
  getUrl(item) {
    const { alias } = item;
    const rawUrl =
      `https://h5.youzan.com/wscvis/knowledge/index?kdt_id=${_global.kdtId}&p=contentshow` +
      `&alias=${alias}&qr=paidcontent_${alias}`;
    return buildUrl(rawUrl, '', _global.kdtId);
  }

  /**
   * 复制内容
   *
   * @param {any} item object
   */
  duplicateContent(item) {
    const { alias } = item;
    this.refreshList().loading();
    visAjax('PUT', '/pct/content/duplicateContent.json', { alias })
      .then((data) => {
        if (data) {
          Notify.success('复制内容成功');
          this.refreshList().refresh(true);
        }
      })
      .catch((err) => {
        this.refreshList().cancelLoading();
        Notify.error(err);
      });
  }

  quickUpdateCallback = (type) => {
    return (name, index, value, useSku = false, alias) => {
      const contentQuickUpdateCommand = {
        productAlias: alias,
        [type]: type === 'price' ? toCent(value) : value,
      };
      API.quickUpdateContentByAlias({ contentQuickUpdateCommand })
        .then((resp) => {
          this.VisTable.refetchData.refresh(true);
        })
        .catch((err) => {
          Notify.error(err);
        });
    };
  };

  getColumns() {
    let columns = [
      {
        title: '内容',
        width: '254px',
        fixed: 'left',
        bodyRender: (item, { row }) => {
          const mediaType = item.mediaType;
          const textArr = ['试读', '试听', '试看'];
          const isLock = item.isLock;
          const isVideo = item.mediaType === 3;
          const imgWrapCls = classnames({
            'img-box': true,
            'type-icon text': item.mediaType === 1,
            'type-icon audio': item.mediaType === 2,
            'type-icon video': isVideo,
          });

          const statusObj = renderItemStatus(item);
          const videoStatus = statusObj.videoStatus;

          return (
            <div className="grad-with-img grad-img-16-9 content-list__img">
              <div className={imgWrapCls}>
                <ImgLockWrap
                  isLock={isLock}
                  width="90px"
                  height="50px"
                  src={item.cover}
                  fullfill="!100x100.jpg"
                />
              </div>
              <div className="content-box">
                <div style={{ display: 'flex' }}>
                  {videoStatus !== 4 && isVideo ? (
                    <div className="name gray ellipsis-2">{item.title}</div>
                  ) : (
                    <div>
                      <a
                        className="name ellipsis-2"
                        href={this.getUrl(item)}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {item.title}
                      </a>
                    </div>
                  )}
                  {chainSupportModify &&
                    !item.hasProductLock &&
                    ((videoStatus === 4 && isVideo) || !isVideo) && (
                    <QuickUpdateInfo
                      rowData={item}
                      row={row}
                      quickUpdateCallback={this.quickUpdateCallback('title').bind(this)}
                      type="title"
                    />
                  )}
                </div>
                {item.isFree ? (
                  <Tag outline color="#4b0">
                    {textArr[mediaType - 1]}
                  </Tag>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        title: PriceTitle(),
        textAlign: 'right',
        bodyRender: (item, row) => {
          const isVideo = item.mediaType === 3;

          const statusObj = renderItemStatus(item);
          const videoStatus = statusObj.videoStatus;
          return (
            <div>
              <div className="price-wrap">
                {(item.sellerType !== 2) ? (
                  <>
                    <p className="price">¥ {(item.price / 100).toFixed(2)}</p>
                    {chainSupportModify &&
                    !item.hasProductLock &&
                    ((videoStatus === 4 && isVideo) || !isVideo) ? (
                        <QuickUpdateInfo
                          rowData={item}
                          validate={(userInput) => {
                            return !isNaN(userInput) && +userInput <= 99999.99 && +userInput >= 0;
                          }}
                          row={row}
                          inputType="number"
                          width={80}
                          quickUpdateCallback={this.quickUpdateCallback('price').bind(this)}
                          type="price"
                        />
                      ) : (
                        <div style={{ width: '19px', display: 'inline-block' }} />
                      )}
                  </>
                ) : (
                  <p className="price" style={{ marginRight: '22px' }}>
                    -
                  </p>
                )}
              </div>
            </div>
          );
        },
      },
      {
        title: renderStatusCloumn(),
        bodyRender: (item) => {
          const statusObj = renderItemStatus(item);
          return <p className={statusObj.errorClass}>{statusObj.statusDesc}</p>;
        },
      },
      {
        title: '开售时间',
        name: 'publish_at',
        needSort: true,
        bodyRender: (item) => {
          // let cls = item.status === 2 ? 'gray' : '';
          // return <p className={cls}>{item.publishAt ? item.publishAt : '－'}</p>;
          return (
            <p>
              {item.publishAt && item.status !== 2
                ? formateDate(new Date(item.publishAt), 'YYYY-MM-DD HH:mm:ss')
                : '－'}
            </p>
          );
        },
      },
      {
        title: '销量',
        name: 'subscriptions_count',
        needSort: true,
        bodyRender: ({ soldOut, goodsId, title }) => {
          let salesUrl = `/v4/trade/order/index#/?buy_way=all&express_type=all&feedback=all&goods_id=${goodsId}&is_star=all&order_label=order_no&p=1&state=pay_success&type=knowledge`;

          // 如果是总部店铺 根据商品名称搜索
          if (chainSupportOnlyHq) {
            salesUrl = `/v4/trade/order/index#/?buy_way=all&express_type=all&feedback=all&goods_title=${title}&is_star=all&order_label=order_no&p=1&state=pay_success&type=knowledge`;
          }
          if (isRetail) {
            salesUrl = `/v2/order/query#/?brandId=0&buyWay=-1&cashierId=&deliveryTime=&deliveryTime=&expressType=-1&feedbackState=-1&goodId=${goodsId}&hasStar=-1`;
          }
          return soldOut > 0 ? (
            <a
              style={{ color: '#3689f7', lineHeight: '20px' }}
              href={salesUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>{soldOut}</span>
            </a>
          ) : (
            <span> - </span>
          );
        },
      },
      {
        title: '关联专栏',
        bodyRender: (item) => {
          return <p className="ellipsis-2">{item.columnTitle ? item.columnTitle : '－'}</p>;
        },
      },
      {
        title: (
          <div className="inline">
            序号
            {HelpEle}
          </div>
        ),
        name: 'serial_no',
        width: '80px',
        needSort: true,
        textAlign: 'left',
        bodyRender: (item) => {
          return (
            <ListPopupEditor
              type="NUM"
              initialValue={item.serialNo}
              validate={nonnegaIntValidator}
              onSubmit={this.onSerialChange(item)}
            >
              {item.serialNo}
            </ListPopupEditor>
          );
        },
      },
      {
        title: '操作',
        width: '175px',
        textAlign: 'right',
        fixed: 'right',
        bodyRender: (item) => {
          let publishEle = null;
          let promoteEle = null;
          let editEle = null;
          let hideEle = null;
          const isVideo = item.mediaType === 3;
          const isLock = item.isLock;

          const statusObj = renderItemStatus(item);
          const videoStatus = statusObj.videoStatus;

          if (item.status === 0) {
            // 已删除
          } else if (item.status === 1) {
            // 已上架
            publishEle = (
              <span onClick={() => this.handlePublishClick(item.alias, SELL_STATUS_MAP.unPublish)}>
                停止销售
              </span>
            );
          } else {
            publishEle = (
              <span onClick={() => this.handlePublishClick(item.alias, SELL_STATUS_MAP.publish)}>
                上架销售
              </span>
            );
          }

          const webViewPath = `packages/edu/webview/index?targetUrl=${encodeURIComponent(
            `https://h5.youzan.com/wscvis/course/detail/${item.alias}?kdt_id=${_global.kdtId}`,
          )}`;
          const weappVersion = get(window._global, 'weappVersion.releasedVersion');
          const hasWeappBinded = weappVersion && compareVersion(weappVersion, '2.37.5') >= 0;
          promoteEle = (
            // <Promotion
            //   data={{
            //     url: this.getUrl(item),
            //     // qrcode: item.popularizeCode,
            //     alias: item.alias,
            //     name: item.title,
            //     pagepath: `packages/edu/webview/index?targetUrl=${encodeURIComponent(
            //       `https://h5.youzan.com/wscvis/course/detail/${item.alias}?kdt_id=${_global.kdtId}`,
            //     )}`,
            //     webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
            //       `https://h5.youzan.com/wscvis/course/detail/${item.alias}?kdt_id=${_global.kdtId}`,
            //     )}`,
            //     hideBdapp: this.state.hideBdapp,
            //   }}
            // >
            <LockWrap lockType="PCT_GOODS" isLock={isLock} onClick={() => openShortenUrlPromotionDlg({
              h5Url: this.getUrl(item),
              mode: 'qrcode',
              title: item.title,
              supportBaiduApp: !this.state.hideBdapp,
              supportWeapp: hasWeappBinded,
              weappConfig: {
                hasBoundApp: hasWeappBinded,
                hasOrderedApp: hasWeappBinded,
              },
              weappUrl: `pages/common/blank-page/index?weappSharePath=${encodeURIComponent(webViewPath)}`,
              baiduAppUrl: `/${webViewPath}`,
              weAppProps: {
                path: webViewPath,
                alias: item.alias,
              },
              baiduAppProps: {
                path: webViewPath,
                alias: item.alias,
              }
            })} className="ui-link--split">
              推广
            </LockWrap>
            // </Promotion>
          );

          editEle = (
            <VisLink
              target="_blank"
              className="ui-link--split"
              to={`/content/edit/${MediaType[item.mediaType]}?alias=${item.alias}`}
            >
              编辑
            </VisLink>
          );

          if (isVideo) {
            if (videoStatus !== 4) {
              promoteEle = null;
              publishEle = null;
            }

            if (videoStatus === 1 || videoStatus === 2) {
              // 1: 上传成功，待转码
              // 2: 转码成功，待审核
              editEle = null;
            }
          }

          // 显示隐藏
          hideEle = (
            <span onClick={() => this.onHideChange(item.alias, item.showInStore)}>
              {item.showInStore === 1 ? '隐藏' : '显示'}
            </span>
          );

          // 推荐链接
          const visPrefix = 'https://www.youzan.com/v4/vis/';
          const recommendUrl =
            `${visPrefix}pct/page/goodsrecommend#/goods-recommend/preview/?` +
            `mode=${item.mediaType !== 1 && item.sellerType === 1 ? 1 : 0}&alias=${item.alias}` +
            `&relatedAlias=${item.columnAlias || ''}&type=2`;

          return (
            <ArthurContainer name="courseDropdown" namespace="course">
              <ArthurDecorator name="viewStudyRecord" preventDefault>
                {(model) => (
                  <div>
                    {editEle}
                    {promoteEle}
                    {(!model.showMore || supportPartnerStatus) ? (
                      model.showAlone ? (
                        <span
                          className="ui-link--split"
                          onClick={() =>
                            window.open(
                              `${_global.url.v4}/vis/pct/page/content#/record?courseType=2&courseId=${item.goodsId}`,
                            )
                          }
                        >
                          学习记录
                        </span>
                      ) : null
                    ) : (
                      <Popover
                        position={Popover.Position.AutoBottomCenter}
                        display="inline"
                        cushion={5}
                      >
                        <Popover.Trigger.Hover>
                          <span className="ui-link--split">更多</span>
                        </Popover.Trigger.Hover>
                        <Popover.Content>
                          <ul className="dropdown-menus">
                            <li>
                              {model.available && (
                                <span
                                  onClick={() =>
                                    window.open(
                                      `${_global.url.v4}/vis/pct/page/content#/record?courseType=2&courseId=${item.goodsId}`,
                                    )
                                  }
                                >
                                  学习记录
                                </span>
                              )}
                            </li>
                            {
                              <ShowWrapper isInStoreCondition={chainSupportHqAndSingle}>
                                <li>
                                  <LockWrap
                                    lockType="PCT_GOODS"
                                    isLock={isLock}
                                    onClick={() => window.open(recommendUrl)}
                                  >
                                    关联商品推荐
                                  </LockWrap>
                                </li>
                              </ShowWrapper>
                            }
                            <li>
                              <LockWrap
                                lockType="PCT_GOODS"
                                isLock={isLock}
                                onClick={this.duplicateContent.bind(this, item)}
                              >
                                复制
                              </LockWrap>
                            </li>
                            <li>{publishEle}</li>
                            {supportShowStatus && <li>{hideEle}</li>}
                            <li>
                              <span onClick={() => this.handleDeleteClick(item.alias)}>删除</span>
                            </li>
                          </ul>
                        </Popover.Content>
                      </Popover>
                    )}
                  </div>
                )}
              </ArthurDecorator>
            </ArthurContainer>
          );
        },
      },
    ];
    if (supportShowStatus) {
      columns.splice(2, 0, {
        title: '显示状态',
        bodyRender: (item) => {
          return item.showInStore === 1 ? '显示' : '隐藏';
        },
      });
    }
    return columns;
  }

  // 显示/隐藏
  onHideChange = (alias, status) => {
    if (status === 1) {
      Sweetalert.confirm({
        content:
          '隐藏专栏或者内容后，对应的专栏或者内容将不在店铺内显示，但是可以通过链接的方式被访问，确定隐藏？',
        title: '隐藏',
        className: 'dialog-450',
        closeBtn: true,
        onConfirm: () => {
          this.showOrHide(alias);
        },
      });
    } else {
      this.showOrHide(alias);
    }
  };

  showOrHide(alias) {
    this.refreshList().loading();

    hideOwlAPI({
      alias,
      channel: 1,
    })
      .then((_) => this.refreshList().refresh(true))
      .catch((msg) => {
        this.refreshList().cancelLoading();
        Notify.error(msg);
      });
  }

  handleDeleteClick(alias) {
    openDeleteDialog({
      type: 'content',
      alias,
      onDelete: () => this.delete(alias),
    });
  }

  delete(alias) {
    const errMsg = '删除失败';
    this.refreshList().loading();
    API.deleteContentDetail({ alias })
      .then(() => {
        Notify.success('删除成功！');
        this.refreshList().refresh();
      })
      .catch((msg) => {
        this.refreshList().cancelLoading();
        Notify.error(msg || errMsg);
      });
  }

  handlePublishClick(alias, status) {
    if (status === SELL_STATUS_MAP.publish) {
      this.publish(alias, status);
      return;
    }

    Sweetalert.confirm({
      content: '停售后已购买内容的消费者仍旧可以查看，未购买的消费者将无法购买，确定停售吗？',
      title: '确定停售',
      className: 'dialog-450',
      closeBtn: true,
      onConfirm: () => {
        this.publish(alias, status);
      },
    });
  }

  publish(alias, status) {
    const errMsg = `${status === SELL_STATUS_MAP.publish ? '上架销售' : '停止销售'}失败`;
    this.refreshList().loading();
    API.postContentPublish({ alias, status })
      .then((_) => this.refreshList().refresh(true))
      .catch((msg) => {
        this.refreshList().cancelLoading();
        Notify.error(msg || errMsg);
      });
  }

  handleAddClick = (e, key) => {
    pctCheck().then(() => {
      visPush(`content/add/${key}`);
    });
    // window.open(`#/content/add/${key}`, '_blank');
  };

  renderBottomAction = (filter) => {
    const { submit, reset } = filter;
    return (
      <>
        <Button type="primary" onClick={submit}>
          筛选
        </Button>
        <span className="filter__actions__reset" onClick={reset}>
          重置筛选条件
        </span>
      </>
    );
  };

  fetchData = (zanQuery) => {
    const conf = this.getFetchParams(zanQuery);
    return API.getContentList(conf).then(({ content, total, pageable }) => ({
      datasets: content,
      total,
      current: pageable.pageNumber,
    }));
  };

  componentDidMount() {
    getRiskLockAPI().then((data = {}) => {
      const onoff = Number(data.onoff || 0);
      this.setState({ isRiskLock: onoff });
    });
    showBdappCode().then((res) => {
      if (res.mpId) {
        this.setState({ hideBdapp: false });
      }
    });
  }

  render() {
    const isLock = this.state.isRiskLock;
    return (
      <div className="pct-content-list">
        <ShowWrapper
          isInStoreCondition={!isInStoreCondition({ supportMinifyRetailBranchShop: true })}
        >
          <div className="app-filter-region">
            <ChainAddContentTabs isLock={isLock} handleAddClick={this.handleAddClick.bind(this)}/>
            {/* <Popover position={Popover.Position.AutoBottomLeft} display="inline" cushion={5}>
              <Popover.Trigger.Hover>
                <ChainAddContentBtn type="primary" name="活动管理">
                  新建内容
                </ChainAddContentBtn>
              </Popover.Trigger.Hover>
              <Popover.Content>
                <LockWrap lockType="PCT_SHOP" isLock={isLock} onClick={this.handleAddClick}>
                  <Menu className="content-menu-item">
                    <MenuItem key="text">图文</MenuItem>
                    <MenuItem key="audio">音频</MenuItem>
                    <MenuItem key="video">视频</MenuItem>
                  </Menu>
                </LockWrap>
              </Popover.Content>
            </Popover> */}
          </div>
        </ShowWrapper>
        <VisList>
          <VisFilterTable
            filterProps={{
              options: CONTENT_OPTION(chainSupportUnified ? [] : [courseGroupSelectConfig]),
              defaultValue: this.state.filter,
              bottomActions: this.renderBottomAction,
            }}
            tableProps={{
              ref: (table) => (this.VisTable = table),
              columns: this.getColumns(),
              emptyLabel: '还没有内容',
              rowKey: 'alias',
              fetchData: this.fetchData,
              scroll: { x: 1200 },
            }}
          />
        </VisList>
      </div>
    );
  }
}

export default ListPage;

import { Pop } from '@zent/compat';
import React, { useState } from 'react';
import { Icon, Dialog } from 'zent';
import fullfillImage from 'zan-utils/fullfillImage';
import { hashHistory } from 'react-router';
import { Link as SamLink } from '@youzan/sam-components';
// import Promotion from 'components/promotion';
import { isInStoreCondition, arrayColumnWrapper, switchWrapper, ShowWrapper } from 'fns/chain';
import { COURSE_SELL_GROUP } from '../../../constants';
import ShortcutPop from '../components/shortcut-pop';
import SchoolList from '../../../components/school-dialog';
import EventEmitter from 'wolfy87-eventemitter';
import ValuntaryAsyncSelect from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import { HQSupportSKU, SingleAndBranchSupportSKU } from './skuconfig';
import { compareVersion } from 'shared/fns/compare-version';
import { get } from 'lodash';
import { Img } from '@youzan/ebiz-components';
import { openLockDialog, onOpenLockDialogClick, LockType } from '@youzan/ebiz-components/es/lock-wrap/';
import openShortenUrlPromotionDlg from 'components/open-promotion-dialog';
import VersionWrapper from 'fns/version';
const weappVersion = get(window._global, 'weappVersion.releasedVersion');
const { ImgLockWrap } = Img;
const hasWeappBinded = weappVersion && compareVersion(weappVersion, '2.37.5') >= 0;

// 这里设置表格的表头和渲染规则
// 重新设置一个文件，是为了简化目录以及解耦
// 能够让渲染规则单独的展示
const { openDialog } = Dialog;
const saleStatus = ['已停售', '出售中', '已售罄'];
const headImgDefault =
  'https://b.yzcdn.cn/public_files/2018/10/24/a9f7b15b28af8c90c268d9d0a3143f0c.png';

/**
 * 渲染标题处的图文信息
 *
 * @param {Object} picture
 * @param {Object} video
 * @param {boolean} isRiskLock
 */
function renderCoverImgOrVideo(picture, video, isRiskLock) {
  const { url } = picture || {};
  const { coverUrl } = video || {};

  if (isRiskLock) {
    // 因为这里isLock默认为true，ImgLockWrap会默认给src一个有锁的图片，所以不用传
    return <ImgLockWrap isLock={true} width="100%" height="100%" fullfill="!100x100.jpg" />;
  }

  let webp = '';
  if (picture) {
    webp = fullfillImage(picture.url, '!100x100.jpg');
  }
  if (video) {
    webp = fullfillImage(video.coverUrl, '!100x100.jpg');
  }

  if (coverUrl) {
    return (
      <React.Fragment>
        <Icon type="video-guide" className="course-table__headImg__icon" />
        <div className="course-table__headImg course-table__imgwrap">
          <img className="course-table__blur" src={webp} />
          <img className="course-table__img" src={webp} />
        </div>
      </React.Fragment>
    );
  }
  if (url) {
    return (
      <>
        <div className="course-table__headImg course-table__imgwrap">
          <img className="course-table__blur" src={webp} />
          <img className="course-table__img" src={webp} />
        </div>
      </>
    );
  }

  return (
    <div className="course-table__headImg__default course-table__imgwrap">
      <img className="course-table__blur" src={headImgDefault} />
      <img className="course-table__img" src={headImgDefault} />
    </div>
  );
}

const columns = ctx => {
  // 传入上下文，为了操作部分能够准确命中外部的方法
  return arrayColumnWrapper([
    {
      title: '线下课',
      name: 'title',
      width: '280px',
      bodyRender: (
        {
          title,
          shortenUrl,
          price,
          pictureWrapDTO,
          videoModel,
          skuSize,
          alias,
          isRiskLock = false,
          kdtId,
          lockType,
        },
        { row },
      ) => {
        const isDisableModify = isInStoreCondition({
          supportEduBranchStore: true,
          supportHqStore: ctx.getIsSelected(),
        });
        // set locked
        let priceLocked = false;
        for (const curLockType of lockType) {
          if (!curLockType || !curLockType.fields) {
            continue;
          }
          for (const curField of curLockType.fields) {
            if (curField === 'price') {
              priceLocked = true;
              break;
            }
          }
        }
        return (
          <div className="flex-row">
            <div style={{ position: 'relative' }} className="course-table__headImg">
              {renderCoverImgOrVideo(pictureWrapDTO, videoModel, isRiskLock)}
            </div>
            <div id="course-table__info" className="course-table__info">
              <div className="course-table__info-title">
                <a
                  style={{ lineHeight: '20px' }}
                  href={shortenUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {title}
                </a>
                {!isDisableModify && (
                  <Pop
                    trigger="click"
                    position="bottom-center"
                    wrapperClassName="shortcut-pop"
                    centerArrow
                    onShow={ctx.toggleShowEditIcon.bind(ctx, `title${row}`, 'visible')}
                    onClose={ctx.toggleShowEditIcon.bind(ctx, `title${row}`)}
                    content={
                      <ShortcutPop
                        name="title"
                        defaultValue={title}
                        width={400}
                        index={row}
                        required
                        onOk={(name, index, value, useSku = false) => {
                          ctx.submitQuickEdit(name, index, value, useSku, alias, kdtId);
                        }}
                        maxLength={40}
                      />
                    }
                  >
                    <div className="hover-visibleBtn" ref={icon => (ctx[`title${row}`] = icon)}>
                      <Icon type="edit-o" style={{ color: '#c3c3c3' }} />
                    </div>
                  </Pop>
                )}
              </div>
              <span style={{ color: '#ed642b', lineHeight: '20px' }}>
                ￥{Number(price / 100).toFixed(2)}
                {!isDisableModify && (
                  <Pop
                    containerSelector=".vis-list__table-container"
                    trigger="click"
                    position="bottom-left"
                    wrapperClassName="shortcut-pop"
                    centerArrow
                    onShow={ctx.toggleShowEditIcon.bind(ctx, `price${row}`, 'visible')}
                    onClose={ctx.toggleShowEditIcon.bind(ctx, `price${row}`)}
                    content={
                      <ShortcutPop
                        name="price"
                        label="价格"
                        type="currency"
                        kdtId={kdtId}
                        defaultValue={price / 100}
                        disabled={priceLocked}
                        index={row}
                        onOk={(name, index, value, useSku = false) => {
                          ctx.submitQuickEdit(name, index, value, useSku, alias, kdtId);
                        }}
                        productAlias={alias}
                        useSku
                        skuSize={skuSize}
                        required
                        validate={val => Number(val) >= 0}
                      />
                    }
                  >
                    <div className="hover-visibleBtn" ref={icon => (ctx[`price${row}`] = icon)}>
                      <Icon type="edit-o" style={{ color: '#c3c3c3' }} />
                    </div>
                  </Pop>
                )}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: '线下课类型',
      name: 'courseType',
      bodyRender: ({ courseType = 0 }) => {
        const stringType = courseType.toString();
        if (!stringType) return <span className="course-table__body__custom">-</span>;
        return (
          <span className="course-table__body__custom">
            {stringType === '0' ? '体验课' : '正式课'}
          </span>
        );
      },
    },
    {
      title: '出售状态',
      name: 'sellStatus',
      // eslint-disable-next-line max-len
      bodyRender: data => {
        const { sellStatus, soldStatusShopStatisticDTO, id } = data;
        const { onSaleNum = 0, saleStopNum = 0, soldOutNum = 0 } = soldStatusShopStatisticDTO || {};
        const defaultEl = (
          <span className="course-table__body__custom">{saleStatus[sellStatus + 1]}</span>
        );
        return switchWrapper({
          supportEduHqStore: () => {
            if (!ctx.getIsSelected()) {
              // 点击数量打开dialog，切换
              const createDialog = (index) => {
                const event = new EventEmitter();

                // 顶部tab组件
                const TabFC = () => {
                  const [active, setActive] = useState(index);
                  // 顶部tab切换事件
                  const onTabClick = e => {
                    const index = parseInt(e.target.getAttribute('value'));
                    event.emit('sellTabChange', index);
                    setActive(index);
                  };

                  const getClassName = index => {
                    return active === index ? 'dialog-tab dialog-tab-selected' : 'dialog-tab';
                  };

                  return (
                    <div className="dialog-tab-wrap">
                      <div value={0} onClick={onTabClick} className={getClassName(0)}>
                        {saleStatus[1]}
                      </div>
                      <div value={1} onClick={onTabClick} className={getClassName(1)}>
                        {saleStatus[2]}
                      </div>
                      <div value={-1} onClick={onTabClick} className={getClassName(-1)}>
                        {saleStatus[0]}
                      </div>
                    </div>
                  );
                };

                return openDialog({
                  className: 'course-manage-dialog',
                  children: <SchoolList {...data} event={event} index={index} />,
                  title: <TabFC />,
                });
              };
              return (
                <>
                  <div>
                    {saleStatus[1]}：<a onClick={() => createDialog(0, id)}>{onSaleNum}</a>
                  </div>
                  <div>
                    {saleStatus[2]}：<a onClick={() => createDialog(1, id)}>{soldOutNum}</a>
                  </div>
                  <div>
                    {saleStatus[0]}：<a onClick={() => createDialog(-1, id)}>{saleStopNum}</a>
                  </div>
                </>
              );
            }
            return defaultEl;
          },
          supportEduBranchStore: () => defaultEl,
          supportEduSingleStore: () => defaultEl,
        });
      },
    },
    {
      title: '适用课程',
      name: 'applyCourseType',
      bodyRender: data => {
        const { courseType, formalCourseDTO } = data;
        // 正式课才可能会有适用课程
        if (!courseType || !formalCourseDTO) {
          return <span className="course-table__body__custom">-</span>;
        }
        if (formalCourseDTO.applyCourseType === 2 && !formalCourseDTO.eduCourse) {
          console.warn('商品获取失败', formalCourseDTO);
          return <span className="course-table__body__custom">-</span>;
        }
        return (
          <span
            className="course-table__body__custom"
            style={{
              wordBreak: 'break-all',
            }}
          >
            {formalCourseDTO.applyCourseType === 1
              ? '全部课程'
              : formalCourseDTO.applyCourseType === 2
                ? formalCourseDTO.eduCourse.name
                : '-'}
          </span>
        );
      },
    },
    {
      title: '收费方式',
      name: 'courseSellType',
      bodyRender: data => {
        const { courseType, formalCourseDTO } = data;
        if (!courseType || !formalCourseDTO) {
          return <span className="course-table__body__custom">-</span>;
        }
        return (
          <span className="course-table__body__custom">
            {COURSE_SELL_GROUP[(formalCourseDTO.courseSellType + 3) % 4]}
          </span>
        );
      },
    },
    {
      title: (
        <span>
          名额
          {/* <Pop trigger="hover" content={`"出售中"的校区剩余名额`}>
            <Icon className="icon" type="help-circle" />
          </Pop> */}
        </span>
      ),
      name: 'totalStock',
      needSort: true,
      bodyRender: (data, rowConfig) => {
        return switchWrapper({
          supportEduHqStore: () =>
            !ctx.getIsSelected()
              ? HQSupportSKU(ctx, data, rowConfig)
              : SingleAndBranchSupportSKU(ctx, data, rowConfig),
          supportEduBranchStore: () => SingleAndBranchSupportSKU(ctx, data, rowConfig),
          supportEduSingleStore: () => SingleAndBranchSupportSKU(ctx, data, rowConfig),
        });
      },
    },
    {
      title: '销量',
      name: 'totalSoldNum',
      needSort: true,
      bodyRender: ({ totalSoldNum, id }) =>
        totalSoldNum > 0 ? (
          <a
            style={{ color: '#3689f7', lineHeight: '20px' }}
            href={`https://www.youzan.com/v2/trade/order/index#/?buy_way=all&express_type=all&feedback=all&goods_id=${id}&is_star=all&order_label=order_no&p=1&state=pay_success&type=knowledge`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>{totalSoldNum}</span>
          </a>
        ) : (
          <span> - </span>
        ),
    },
    {
      title: (
        <span>
          序号
          <Pop trigger="hover" content="点击数字输入序号，对内容排序，序号越大越靠前">
            <Icon className="icon" type="help-circle" />
          </Pop>
        </span>
      ),
      name: 'num',
      needSort: true,
      bodyRender: ({ num, alias, kdtId }, { row }) => (
        <React.Fragment>
          <span style={{ width: '20px', marginRight: '5px' }}>{num}</span>
          <Pop
            trigger="click"
            position="bottom-left"
            wrapperClassName="shortcut-pop"
            centerArrow
            onShow={ctx.toggleShowEditIcon.bind(ctx, `order${row}`, 'visible')}
            onClose={ctx.toggleShowEditIcon.bind(ctx, `order${row}`)}
            content={
              <ShortcutPop
                name="goodsNum"
                defaultValue={num}
                index={row}
                type="number"
                onOk={(name, index, value, useSku = false) => {
                  ctx.submitQuickEdit(name, index, value, useSku, alias, kdtId);
                }}
                required
                validate={val => Number(val) >= 0 && val - Number(val).toFixed(0) === 0}
              />
            }
          >
            <div className="hover-visibleBtn" ref={icon => (ctx[`order${row}`] = icon)}>
              <Icon type="edit-o" style={{ color: '#c3c3c3' }} />
            </div>
          </Pop>
        </React.Fragment>
      ),
    },
    {
      title: '操作',
      width: isInStoreCondition({ supportEduHqStore: true }) ? '210px' : '140px',
      fixed: 'right',
      textAlign: 'right',
      // 按钮中复制在这一期不展示
      bodyRender: item => {
        const { isRiskLock, courseType, formalCourseDTO } = item;
        const isLinkDisabled =
          ctx.getIsSelected() && isInStoreCondition({ supportEduHqStore: true });
        const webViewPath = `packages/edu/webview/index?targetUrl=${encodeURIComponent(
          `https://h5.youzan.com/wscvis/edu/prod-detail?alias=${item.alias}&kdt_id=${item.kdtId}`,
        )}`;
        return (
          <div>
            <div className="course-table__body__actions">
              <SamLink
                name="编辑"
                disabled={isLinkDisabled}
                onClick={() => window.open(`${_global.url.v4}/vis/edu/course#/course-manage/edit/${item.alias}`)}
              >
                <span className={'course-link-layout'}>编辑</span>
              </SamLink>
              {ShowWrapper({
                children: (
                  <>
                    <span style={{ color: '#a9a9a9' }}>|</span>
                    <SamLink
                      name="编辑"
                      onClick={() =>
                        hashHistory.push(
                          `course-manage/schools/${item.id}?title=${item.title}&skuSize=${
                            item.skuSize
                          }&price=${item.price}&shortenUrl=${item.shortenUrl}&isClassCourse=${
                            item.courseType === 1 && item.formalCourseDTO.courseSellType === 3
                              ? 1
                              : 0
                          }&totalStock=${
                            typeof item.totalStock === 'number' ? item.totalStock : ''
                          }&id=${item.id}&picUrl=${
                            item.pictureWrapDTO ? item.pictureWrapDTO.url : ''
                          }&alias=${item.alias}`,
                        )
                      }
                    >
                      <span className="course-link-layout">配置校区</span>
                    </SamLink>
                  </>
                ),
                isInStoreCondition: isInStoreCondition({
                  supportEduHqStore: !ctx.getIsSelected(),
                }),
              })}
              <span style={{ color: '#a9a9a9' }}>|</span>
              <a className="course-link-layout" onClick={isRiskLock ? openLockDialog(LockType.COURSE_GOODS) : () => openShortenUrlPromotionDlg({
                h5Url: item.shortenUrl,
                mode: 'qrcode',
                title: item.title,
                supportBaiduApp: !ctx.state.hideBdapp,
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
              })}>
                  推广
              </a>
              {/* {isRiskLock ? (
                <a className="course-link-layout" onClick={openLockDialog(LockType.COURSE_GOODS)}>
                  推广
                </a>
              ) : (
                <Promotion
                  data={{
                    qrcode: item.qrCode,
                    url: item.shortenUrl,
                    alias: item.alias,
                    name: item.title,
                    pagepath: `packages/edu/webview/index?targetUrl=${encodeURIComponent(
                      `https://h5.youzan.com/wscvis/edu/prod-detail?alias=${item.alias}&kdt_id=${item.kdtId}`,
                    )}`,
                    webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
                      `https://h5.youzan.com/wscvis/edu/prod-detail?alias=${item.alias}&kdt_id=${item.kdtId}`,
                    )}`,
                    hideBdapp: ctx.state.hideBdapp,
                  }}
                  hideWeapp={!hasWeappBinded}
                  afterVisibleChange={ctx.togglePromoteModal.bind(ctx)}
                >
                  <a className="course-link-layout">推广</a>
                </Promotion>
              )} */}
              {ShowWrapper({
                children: (
                  <VersionWrapper name='course-manage-duplicate' downgrade={{
                    from: courseType === 1 && formalCourseDTO && formalCourseDTO.courseSellType === 3,
                  }}>
                    <>
                      <span style={{ color: '#a9a9a9' }}>|</span>
                      <span
                        onClick={onOpenLockDialogClick(isRiskLock, LockType.COURSE_GOODS, () => {
                          /* if (item.courseType === 1 && item.formalCourseDTO.courseSellType === 3) {
                      Notify.error('该线下课按期售卖，不可复制');
                      return;
                    } */
                          ctx.duplicateCourse(item);
                        })}
                        className="course-table__body__actions__textBtn"
                      >
                        复制
                      </span>
                    </>
                  </VersionWrapper>
                ),
                isInStoreCondition: isInStoreCondition({
                  supportEduHqStore: !ctx.getIsSelected(),
                  supportEduSingleStore: true,
                }),
              })}
            </div>
          </div>
        );
      },
    },
  ]);
};

const filterOptions = (ctx, extendOption) => {
  return arrayColumnWrapper([
    {
      type: 'Input',
      name: 'title',
      label: '线下课名称：',
      props: {
        placeholder: '',
      },
    },
    {
      type: 'Select',
      name: 'courseType',
      label: '线下课类型：',
      data: [
        {
          value: 2,
          text: '全部',
        },
        {
          value: 0,
          text: '体验课',
        },
        {
          value: 1,
          text: '正式课',
        },
      ],
    },
    {
      type: 'Custom',
      name: 'kdtId',
      label: '上课校区：',
      component: ValuntaryAsyncSelect,
      format: data => Promise.resolve(data.target),
      onSearch: keyword => {
        return { name: keyword };
      },
      className: 'valuntary-async-select-option',
      defaultOption: ctx.getDefaultShopOptions(),
      create: false,
      refresh: false,
      getOptions: ctx.getShopOptions,
      valueChange: ctx.onShopSelected,
      placeholder: '全部',
      width: 150,
      hideClose: true,
      chainState: isInStoreCondition({
        supportEduHqStore: true,
      }),
    },
    {
      type: 'Custom',
      label: '适用课程：',
      name: 'eduCourseId',
      format: data => Promise.resolve(data.target),
      onSearch: keyword => {
        return { name: keyword };
      },
      className: 'valuntary-async-select-option',
      component: ValuntaryAsyncSelect,
      defaultOption: ctx.getDefaultEducourseOptions(),
      create: false,
      refresh: false,
      valueChange: ctx.onEduCourseSelected,
      getOptions: ctx.getEduCourseOptions,
      placeholder: '全部',
      width: '185px',
      hideClose: true,
    },
    {
      type: 'Select',
      name: 'courseSellType',
      label: '收费方式：',
      data: [
        {
          value: '',
          text: '全部',
        },
        {
          value: 1,
          text: '按课时',
        },
        {
          value: 2,
          text: '按时段',
        },
        {
          value: 3,
          text: '按期',
        },
        {
          value: 0,
          text: '自定义',
        },
      ],
    },
    ...extendOption,
  ]);
};

export { columns, filterOptions };

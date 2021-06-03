import React, { FC, useState, useCallback, useRef, useEffect, useContext } from 'react';
import { Button, Notify } from 'zent';
import { EasyList, Select, ListPopupEditor } from '@youzan/ebiz-components';
import { IListProps, IListContext } from '@youzan/ebiz-components/components/easy-list/types/list';
import {
  ICombinedFilterConf,
  IFilterProps,
  IRenderPropsType,
} from '@youzan/ebiz-components/components/easy-list/types/filter';
import toCent from '@youzan/utils/money/toCent';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import { isHqStore, isSingleStore, isBranchStore } from '@youzan/utils-shop';
import { showBdappCode } from 'common/api/request';
import { arrayColumnWrapper, isInStoreCondition } from 'fns/chain';
import { nonnegaIntValidator } from 'fns/validation/nonnega-int';
import { ListPopupEditorType } from '@youzan/ebiz-components/es/list-popup-editor';
import { visitTracker } from 'components/logger';
import { CampusContext } from 'components/campus-filter/campus-provider';
import CourseGoodsItem from '../../components/course-goods-item';
import { fetchAllCourseGroupOptions } from '../../common/select-options';
import ActionMenu from '../../components/live/action-menu';

import {
  SHOW_IN_STORE_DATA,
  SELL_STATUS_DATA,
  SELLER_TYPE,
  LIVE_STATUS_DATA,
  LIVE_TYPE_DATA,
} from '../config';
import { formatParams } from '../../common/helper';

import { findPageByCondition, quickUpdateLiveByAlias, updateSerialNo } from '../api';
import { IListParams, ILiveItem } from './model';
import { SELL_STATUS, SHOW_IN_STORE, LIVE_STATUS } from './constant';
import { LIVE_TYPE, SELLER_TYPE as SELLER_TYPE_MAP } from '../../common/constants';
// 能力
import { useCheckInfoHidden } from '@ability-center/course';
import type { IEasyGridColumn } from '@youzan/ebiz-components/components/easy-list/types/grid';

const SELECT_WIDTH = 185;
const { List, Filter, EasyGrid } = EasyList;

// 是否是零售店铺
const isRetail = isInStoreCondition({ supportRetailShop: true });

const FilterList: FC = () => {
  const [hideBdapp, setBdapp] = useState(true);
  const { targetKdtId } = useContext(CampusContext);

  const listRef = useRef<IListContext>(null);
  const filterRef = useRef<IRenderPropsType>(null);
  const { infoHiddenAvailable } = useCheckInfoHidden();

  const updateList = useCallback<() => void>(() => {
    listRef && listRef.current && listRef.current.action.refresh();
  }, [listRef]);

  // 是否是总部在校区视角
  const isHqView = isHqStore && targetKdtId !== _global.kdtId;

  const Actions: IFilterProps['renderActions'] = ({ filter }) => {
    const { submit, reset } = filter;
    return (
      <>
        <Button
          type="primary"
          onClick={() => {
            submit();
          }}
        >
          筛选
        </Button>
        <Button type="primary" bordered={false} outline onClick={reset}>
          重置筛选条件
        </Button>
      </>
    );
  };

  // 快速修改
  const quickUpdateCallback = useCallback<(type: string) => (...args: any) => void>(
    type => {
      return (value: any, alias: string) => {
        const liveQuickUpdateCommand = {
          productAlias: alias,
          [type]: type === 'price' ? toCent(value) : value,
        };
        quickUpdateLiveByAlias({ liveQuickUpdateCommand })
          .then(() => {
            updateList();
          })
          .catch(err => {
            Notify.error(err);
          });
      };
    },
  [updateList],
  );

  // 排序
  const onSerialChange = useCallback<(item: ILiveItem) => <T>(data: T) => void | Promise<T>>(
    item => {
      return serialNo => {
        const alias = item.alias;

        updateSerialNo({
          alias,
          serialNo: Number(serialNo || 0),
        })
          .then(() => {
            updateList();
          })
          .catch(msg => {
            Notify.error(msg);
          });
      };
    },
  [updateList],
  );

  const inheritProps = { width: SELECT_WIDTH };
  const filterConfig = arrayColumnWrapper([
    {
      name: 'title',
      label: '直播名称：',
      type: 'Input',
      placeholder: '',
      inheritProps: {
        ...inheritProps,
        onPressEnter: () => {
          filterRef && filterRef.current && filterRef.current.submit();
        },
      },
    },
    {
      name: 'sell_status',
      label: '出售状态：',
      defaultValue: '0',
      type: 'Select',
      options: SELL_STATUS_DATA,
      inheritProps,
    },
    {
      name: 'show_in_store',
      label: '显示状态：',
      defaultValue: 'all',
      type: 'Select',
      options: SHOW_IN_STORE_DATA,
      inheritProps,
      chainState: isInStoreCondition({
        supportUnifiedShop: true,
      }),
    },
    {
      name: 'seller_type',
      label: '销售方式：',
      defaultValue: '0',
      type: 'Select',
      options: SELLER_TYPE,
      inheritProps,
    },
    {
      name: 'groupId',
      label: '课程分组：',
      type: 'Custom',
      renderField: Select,
      defaultValue: ['-1'],
      chainState: !isInStoreCondition({
        supportUnifiedShop: true,
      }),
      inheritProps: {
        ...inheritProps,
        defaultOptions: [{ text: '全部', value: '-1' }],
        filter: true,
        mode: 'async',
        fetchOnMounted: true,
        fetchOptions: fetchAllCourseGroupOptions,
      },
    },
    {
      name: 'live_status',
      label: '直播状态：',
      defaultValue: '0',
      type: 'Select',
      options: LIVE_STATUS_DATA,
      inheritProps,
    },
    {
      name: 'live_type',
      label: '直播类型：',
      defaultValue: '0',
      type: 'Select',
      options: LIVE_TYPE_DATA,
      inheritProps,
    },
  ]) as ICombinedFilterConf[];

  const getColumns = React.useCallback(() => {
    return arrayColumnWrapper([
      {
        title: '直播',
        width: '256px',
        fixed: 'left',
        bodyRender(item: ILiveItem) {
          const { seller_type: sellerType, item_create_mode: itemCreateMode } = item;
          const { SINGLE, BOTH } = SELLER_TYPE_MAP;
          return (
            <CourseGoodsItem
              item={item}
              canSelfEdit={itemCreateMode === 1 && !isHqView}
              showPrice={false}
              hasPrice={sellerType === SINGLE || sellerType === BOTH}
              quickUpdateCallback={quickUpdateCallback}
            />
          );
        },
      },
      {
        title: <span className="price-title">价格</span>,
        textAlign: 'right',
        bodyRender(item: ILiveItem) {
          const { item_create_mode: itemCreateMode } = item;
          const isColumn = item.seller_type === SELLER_TYPE_MAP.COLUMN;
          return (
            <CourseGoodsItem
              item={item}
              canSelfEdit={itemCreateMode === 1 && !isHqView}
              showThumb={false}
              showContent={false}
              hasPrice={!isColumn}
              quickUpdateCallback={quickUpdateCallback}
              style={{ display: 'inline-flex' }}
            />
          );
        },
      },
      {
        title: '出售状态',
        width: '80px',
        bodyRender(item: ILiveItem) {
          return SELL_STATUS[item.sell_status];
        },
      },
      {
        title: '显示状态',
        width: '80px',
        bodyRender(item: ILiveItem) {
          return SHOW_IN_STORE[item.show_in_store];
        },
        chainState: isInStoreCondition({
          supportUnifiedShop: true,
        }),
      },
      {
        title: '开售时间',
        name: 'publish_at',
        needSort: true,
        bodyRender(item: ILiveItem) {
          // let cls = item.status === 2 ? 'gray' : '';
          // return <p className={cls}>{item.publish_at ? item.publish_at : '－'}</p>;
          return <p>{item.publish_at && item.sell_time_type !== 3 ? item.publish_at : '－'}</p>;
        },
      },
      {
        title: '直播状态',
        width: '80px',
        name: 'live_status',
        bodyRender(item: ILiveItem) {
          return item.live_type === LIVE_TYPE.POLYV ? '-' : LIVE_STATUS[item.live_status];
        },
      },
      {
        title: '销量',
        width: '80px',
        needSort: true,
        name: 'sales',
        bodyRender(item: ILiveItem) {
          const { sales } = item;
          let salesUrl = `/v4/trade/order/index#/?buy_way=all&express_type=all&feedback=all&goods_id=${item.goods_id}&is_star=all&order_label=order_no&p=1&state=pay_success&type=knowledge`;

          if (isRetail) {
            salesUrl = `/v2/order/query#/?brandId=0&buyWay=-1&cashierId=&deliveryTime=&deliveryTime=&expressType=-1&feedbackState=-1&goodId=${item.goods_id}&hasStar=-1`;
          }
          return sales ? (
            <a
              style={{ color: '#155bd4', lineHeight: '20px' }}
              href={salesUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>{sales}</span>
            </a>
          ) : (
            <span> - </span>
          );
        },
      },
      {
        title: '关联专栏',
        bodyRender(item: ILiveItem) {
          return <span className="ellipsis-2">{item.column_title || '-'}</span>;
        },
      },
      {
        title: '序号',
        headerHelp: '点击数字输入序号，对专栏排序，序号越大越靠前',
        helpPopPosition: 'top-center',
        name: 'serial_no',
        width: '90px',
        needSort: true,
        textAlign: 'center',
        bodyRender(item: ILiveItem) {
          const { serial_no: serialNo } = item;
          const canEdit =
            isSingleStore || isBranchStore || (isHqStore && targetKdtId === _global.kdtId);
          return canEdit ? (
            <ListPopupEditor
              type={ListPopupEditorType.NUM}
              initialValue={serialNo}
              validate={nonnegaIntValidator}
              onSubmit={onSerialChange(item)}
            >
              <span>{serialNo}</span>
            </ListPopupEditor>
          ) : (
            <span>{serialNo}</span>
          );
        },
      },
      {
        title: '操作',
        width: '280px',
        textAlign: 'right',
        fixed: 'right',
        bodyRender(item) {
          return (
            <ActionMenu
              item={item}
              hideBdapp={hideBdapp}
              reload={updateList}
              infoHiddenAvailable={infoHiddenAvailable}
            />
          );
        },
      },
    ]) as IEasyGridColumn[];
  }, [
    hideBdapp,
    infoHiddenAvailable,
    isHqView,
    onSerialChange,
    quickUpdateCallback,
    targetKdtId,
    updateList,
  ]);

  const fetchList = useCallback<IListProps['onSubmit']>(
    state => {
      return new Promise((resolve, reject) => {
        const { query, pageRequest } = formatParams(getNewFetchParams(state));
        findPageByCondition({
          query,
          pageRequest,
          targetKdtId,
        })
          .then(res => {
            const { content = [], pageable = {}, total = 0 } = res;
            const { pageNumber = 0, pageSize = 0 } = pageable;
            resolve({
              dataset: content,
              pageInfo: { page: pageNumber, pageSize, total },
            });
          })
          .catch(err => {
            reject(err);
            Notify.error(err);
          });
      });
    },
    [targetKdtId],
  );

  useEffect(() => {
    // 添加浏览直播列表页的埋点
    visitTracker({ pageType: 'liveList', eventName: '浏览直播列表' });
    showBdappCode().then(res => {
      if (res && res.mpId) {
        setBdapp(false);
      }
    });
  }, []);

  // 切换校区之后刷新列表
  useEffect(() => {
    if (listRef.current) {
      listRef.current.action.refresh();
    }
  }, [targetKdtId]);

  return (
    <List ref={listRef} onSubmit={fetchList} mode="hash">
      <Filter ref={filterRef} config={filterConfig} renderActions={Actions} />
      <EasyGrid
        scroll={{ x: 1200 }}
        columns={getColumns()}
        emptyLabel="还没有直播"
        rowKey="alias"
      />
    </List>
  );
};

export default FilterList;

function getNewFetchParams(conf) {
  const params = mapKeysToCamelCase(conf);
  const {
    page,
    pageSize,
    sortBy = 'serial_no',
    sortType = 'DESC',
    liveStatus,
    liveType,
    groupId,
    showInStore = 'all',
    title = '',
    sellStatus = '0',
    sellerType,
  } = params;

  const data: IListParams = {
    page: Number(page) || 1,
    pageSize,
    title,
    showInStore,
    sellStatus,
    sellerType,
    sortType: sortType.toUpperCase(),
    sortBy: sortBy === 'created_time' ? 'serial_no' : sortBy,
    subSortBy: 'publish_at',
  };
  if (liveStatus !== '0') {
    data.liveStatus = liveStatus;
  }
  if (liveType !== '0') {
    data.liveType = liveType;
  }
  if (groupId && groupId[0]) {
    data.groupId = groupId[0];
  }
  if (showInStore === 'all') {
    data.showInStore = null;
  }

  return data;
}

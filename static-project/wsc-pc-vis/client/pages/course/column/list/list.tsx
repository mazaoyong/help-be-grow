import React, { FC, useState, useCallback, useRef, useEffect } from 'react';
import { Button, Notify, Tag } from 'zent';
import { get } from 'lodash';
import { EasyList, Select, ListPopupEditor } from '@youzan/ebiz-components';
import {
  IListProps,
  IListContext,
} from '@youzan/ebiz-components/components/easy-list/types/list';
import {
  ICombinedFilterConf,
  IFilterProps,
  IRenderPropsType,
} from '@youzan/ebiz-components/components/easy-list/types/filter';
import { ListPopupEditorType } from '@youzan/ebiz-components/es/list-popup-editor';
import toCent from '@youzan/utils/money/toCent';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import { showBdappCode } from 'common/api/request';
import { arrayColumnWrapper, isInStoreCondition } from 'fns/chain';
import { nonnegaIntValidator } from 'fns/validation/nonnega-int';
import WarningTip from './components/warning-tip';
import ActionMenu from './components/action-menu';
import CourseGoodsItem from '../../components/course-goods-item';
import { chainSupportOnlyHq, chainSupportSingle, chainSupportMinify, supportRetailPartner, chainSupportUnified } from '../../common/chain';
import { fetchAllCourseGroupOptions } from '../../common/select-options';
import eventEmit from '../../../pct/tabs/event';

import {
  SHOW_IN_STORE_DATA,
  SELL_STATUS_DATA,
  IS_UPDATE,
  COLUMN_TYPE,
} from '../common/config';
import { formatParams } from '../../common/helper';

import { findPageByCondition } from '../common/api';
import { quickUpdateColumnByAlias, updateSerialNo } from './api';
import { IListParams, IColumnItem } from './model';
import { UPDATE_STATUS, SELL_STATUS, SHOW_IN_STORE } from './constant';
import type { IEasyGridColumn } from '@youzan/ebiz-components/components/easy-list/types/grid';

const SELECT_WIDTH = 185;
const { List, Filter, EasyGrid } = EasyList;

// 是否是零售店铺
const isRetail = isInStoreCondition({ supportRetailShop: true });

const FilterList: FC = () => {
  const [hideBdapp, setBdapp] = useState(true);

  const listRef = useRef<IListContext>(null);
  const filterRef = useRef<IRenderPropsType>(null);

  const updateList = useCallback<() => void>(() => {
    listRef && listRef.current && listRef.current.action.refresh();
    // 刷新头部全部消息
    eventEmit.emit('refresh');
  }, [listRef]);

  // 快速修改
  const quickUpdateCallback = useCallback<(type: string) => (...args: any) => void>((type) => {
    return (value: any, alias: string) => {
      const columnQuickUpdateCommand = {
        productAlias: alias,
        [type]: type === 'price' ? toCent(value) : value,
      };
      quickUpdateColumnByAlias({ columnQuickUpdateCommand }).then(() => {
        updateList();
      }).catch(err => {
        Notify.error(err);
      });
    };
  }, [updateList]);

  // 排序
  const onSerialChange = useCallback<(item: IColumnItem) => <T>(data: T) => void | Promise<T>>((item) => {
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
  }, [updateList]);

  const inheritProps = { width: SELECT_WIDTH };
  const filterConfig = arrayColumnWrapper([
    {
      name: 'title',
      label: '专栏名称：',
      defaultValue: '',
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
      name: 'status',
      label: '出售状态：',
      defaultValue: '0',
      type: 'Select',
      options: SELL_STATUS_DATA,
      inheritProps,
    },
    {
      name: 'showInStore',
      label: '显示状态：',
      defaultValue: 'all',
      type: 'Select',
      options: SHOW_IN_STORE_DATA,
      inheritProps,
      chainState: chainSupportUnified,
    },
    {
      name: 'isUpdate',
      label: '更新状态：',
      defaultValue: 'all',
      type: 'Select',
      options: IS_UPDATE,
      inheritProps,
    },
    {
      name: 'columnType',
      label: '专栏类型：',
      defaultValue: 'all',
      type: 'Select',
      options: COLUMN_TYPE,
      inheritProps,
      chainState: chainSupportSingle || chainSupportMinify,
    },
    {
      name: 'groupId',
      label: '课程分组：',
      type: 'Custom',
      renderField: Select,
      defaultValue: ['-1'],
      chainState: !chainSupportUnified,
      inheritProps: {
        ...inheritProps,
        defaultOptions: [{ text: '全部', value: '-1' }],
        filter: true,
        mode: 'async',
        fetchOnMounted: true,
        fetchOptions: fetchAllCourseGroupOptions,
      },
    },
  ]) as ICombinedFilterConf[];

  const Actions: IFilterProps['renderActions'] = ({ filter }) => {
    const { submit, reset } = filter;
    return (
      <>
        <Button
          type='primary'
          onClick={() => {
            submit();
          }}
        >
          筛选
        </Button>
        <Button type='primary' bordered={false} outline onClick={reset}>
          重置筛选条件
        </Button>
      </>
    );
  };

  const getColumns = () => {
    return arrayColumnWrapper([
      {
        title: '专栏',
        fixed: 'left',
        width: '256px',
        bodyRender(item: IColumnItem) {
          const { price_info: info, alias } = item;
          return (
            <CourseGoodsItem
              item={item}
              canEdit={item.column_type !== 1}
              quickUpdateCallback={quickUpdateCallback}
              priceItem={
                <div className="price">
                  {item.column_type === 1 && (
                    <Tag style={{ marginRight: 5 }} className="fenxiao-tag" theme="red">
                      分销
                    </Tag>
                  )}
                  ¥ {(item.price / 100).toFixed(2)}
                  {info && (
                    <WarningTip
                      alias={alias}
                      text={info}
                      reload={updateList}
                      actionText="忽略该消息"
                      type="price_info"
                    />
                  )}
                </div>
              }
            />
          );
        },
      },
      {
        title: '更新状态',
        width: '80px',
        bodyRender(item: IColumnItem) {
          return UPDATE_STATUS[item.is_update];
        },
      },
      {
        title: '显示状态',
        width: '80px',
        bodyRender(item: IColumnItem) {
          return SHOW_IN_STORE[item.show_in_store];
        },
        chainState: chainSupportUnified,
      },
      {
        title: '上架状态',
        width: '80px',
        bodyRender: item => {
          const { state_info: info, alias } = item;
          return (
            <p>
              {SELL_STATUS[item.status] || '已停售'}
              {info && (
                <WarningTip
                  alias={alias}
                  text={info}
                  reload={updateList}
                  actionText="忽略该消息"
                  type="state_info"
                />
              )}
            </p>
          );
        },
      },
      {
        title: '期数',
        width: '80px',
        bodyRender: item => {
          return item.contents_count || '－';
        },
      },
      {
        title: '开售时间',
        name: 'publish_at',
        needSort: true,
        bodyRender(item: IColumnItem) {
          // let cls = item.status === 2 ? 'gray' : '';
          // return <p className={cls}>{item.publish_at ? item.publish_at : '－'}</p>;
          return <p>{item.publish_at && item.status !== 2 ? item.publish_at : '－'}</p>;
        },
      },
      {
        title: '销量',
        needSort: true,
        name: 'subscriptions_count',
        bodyRender(item: IColumnItem) {
          const { subscriptions_count: sales, goods_id: id, title } = item;
          let salesUrl = `/v4/trade/order/index#/?buy_way=all&express_type=all&feedback=all&${
            chainSupportOnlyHq ? `goods_title=${title}` : `goods_id=${id}`
          }&is_star=all&order_label=order_no&p=1&state=pay_success&type=knowledge`;
          if (isRetail) {
            salesUrl = `/v2/order/query#/?brandId=0&buyWay=-1&cashierId=&deliveryTime=&deliveryTime=&expressType=-1&feedbackState=-1&goodId=${id}&hasStar=-1`;
          }
          return (sales && !supportRetailPartner) ? (
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
        title: '序号',
        headerHelp: '点击数字输入序号，对专栏排序，序号越大越靠前',
        helpPopPosition: 'top-center',
        name: 'serial_no',
        needSort: true,
        textAlign: 'center',
        bodyRender(item: IColumnItem) {
          const { serial_no: serialNo } = item;
          return (
            <ListPopupEditor
              type={ListPopupEditorType.NUM}
              initialValue={serialNo}
              validate={nonnegaIntValidator}
              onSubmit={onSerialChange(item)}
            >
              <span>{serialNo}</span>
            </ListPopupEditor>
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
            />
          );
        },
      },
    ]) as IEasyGridColumn[];
  };

  function getNewFetchParams(conf) {
    const params = mapKeysToCamelCase(conf);
    const {
      page,
      pageSize,
      sortBy = 'serial_no',
      sortType = 'DESC',
      title = '',
      status,
      isUpdate = 'all',
      showInStore = 'all',
      columnType = 'all',
      groupId,
    } = params;

    const data: IListParams = {
      page: Number(page) || 1,
      pageSize,
      title,
      status,
      isUpdate: isUpdate === 'all' ? null : isUpdate,
      showInStore: showInStore === 'all' ? null : showInStore,
      columnType: columnType === 'all' ? null : columnType,
      groupId: get(groupId, '[0]'),
      sortType: sortType.toUpperCase(),
      sortBy: !sortType ? 'serial_no' : sortBy,
      subSortBy: 'publish_at',
    };

    return data;
  }

  const fetchList = useCallback<IListProps['onSubmit']>(state => {
    return new Promise((resolve, reject) => {
      const { query, pageRequest } = formatParams(getNewFetchParams(state));
      findPageByCondition({
        pcColumnQuery: query, pageRequest,
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
  }, []);

  useEffect(() => {
    showBdappCode().then(res => {
      if (res && res.mpId) {
        setBdapp(false);
      }
    });
  }, []);

  return (
    <List ref={listRef} onSubmit={fetchList} mode="hash">
      <Filter
        ref={filterRef}
        config={filterConfig}
        renderActions={Actions}
      />

      <EasyGrid
        scroll={{ x: 1100 }}
        columns={getColumns()}
        emptyLabel="还没有专栏"
        rowKey="alias"
      />
    </List>
  );
};

export default FilterList;

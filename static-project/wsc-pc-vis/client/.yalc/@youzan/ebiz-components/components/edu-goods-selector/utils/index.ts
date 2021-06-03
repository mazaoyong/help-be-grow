import {
  IDict,
  IPropsConfig,
  ITypeFilterOption,
} from '@youzan/react-components/typings/components/goods-selector-v2';
// @ts-ignore
import { deleteColumn } from '@youzan/react-components/es/components/goods-selector-v2/utils';
import get from 'lodash/get';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import isString from 'lodash/isString';
import { IGetConfigOptions, OwlItemType } from '../types';
import {
  GOODS_MANAGE_URL,
  DEFAULT_GOODS_MANAGE_URL,
  KNOWLEDGE_TYPE,
  MAX_INVENTORY,
  NORMAL_TYPE,
} from '../constants';
import { fetchFilterGroups, fetchGoodsForUmp, fetchGoods as fetchGoodsForEdu } from '../api';

// 预设词典
export const getGoodsDict = (dict: IDict, isOnlyShowEduGoods: boolean, customManageUrl?: string) => {
  const MANAGE_URL = customManageUrl || (isOnlyShowEduGoods ? GOODS_MANAGE_URL : DEFAULT_GOODS_MANAGE_URL);
  dict.goodsManage = {
    name: '商品管理',
    url: {
      online: {
        wsc: MANAGE_URL,
        retail: MANAGE_URL,
      },
      offline: dict.goodsManage.url.offline,
    },
  };
  return dict;
};

// 根据设置获取配置
export const getConfig = (options: IGetConfigOptions): IPropsConfig => {
  const {
    isUmpType,
    initConfig,
    isSingle,
    isSkuMode,
    activityType,
    activityId,
    biz,
    typeFilterOptions,
    selectTypes,
    maxGoodsNum,
    maxSkuNum,
    showTypeFilter,
    showGroupColumn,
    showStockColumn,
    showSalesColumn,
    showJoinActivityColumn,
    showNotOptionalColumn,
    showSoldOut,
    showContentFilterSubType,
    soldOutSelectable,
    needSkuInfo,
    mapGoodsValue,
    dictConfig = {
      isOnlyShowEduGoods: true,
      customManageUrl: '',
    },
  } = options;

  // 配置信息
  const _isSingle = isUmpType ? get(initConfig, 'goods.isSingle') : isSingle;
  const _isSkuMode = isUmpType ? get(initConfig, 'goods.isSkuMode') : isSkuMode;
  const _maxGoodsNum = isUmpType ? get(initConfig, 'goods.maxGoodsNum') : maxGoodsNum;
  const _maxSkuNum = isUmpType ? get(initConfig, 'goods.maxSkuNum') : maxSkuNum;
  const _showTypeFilter = isUmpType
    ? get(initConfig, 'goods.online.showTypeFilter')
    : showTypeFilter;
  const _showJoinActivity = isUmpType
    ? get(initConfig, 'goods.online.showJoinActivity')
    : showJoinActivityColumn;
  const _showNotOptionalReason = isUmpType
    ? get(initConfig, 'goods.online.showNotOptionalReason')
    : showNotOptionalColumn;

  // 处理商品类型筛选项（底层组件内部定义错误，需要覆盖）
  let _typeFilterOptions: ITypeFilterOption[] = [];

  if (isUmpType) {
    _typeFilterOptions = get(initConfig, 'goods.online.typeFilterOptions', []);
  } else {
    _typeFilterOptions = cloneDeep(
      typeFilterOptions && typeFilterOptions.length
        ? typeFilterOptions
        : [NORMAL_TYPE, KNOWLEDGE_TYPE]
    );
  }

  const knowledgeOption: ITypeFilterOption =
    find(_typeFilterOptions, {
      value: 'KNOWLEDGE',
    }) || ({} as ITypeFilterOption);

  // 教育商品过滤选项
  if (knowledgeOption.relatedGroupOptions && biz) {
    knowledgeOption.relatedGroupOptions = (KNOWLEDGE_TYPE.relatedGroupOptions || []).filter(
      (item) => {
        if (!isString(item.value)) return false;

        const value = item.value.toLowerCase();

        if (value === 'all') {
          return (
            biz.includes('column') &&
            biz.includes('content') &&
            biz.includes('live') &&
            biz.includes('course')
          );
        }

        for (const n of biz) {
          if (n === 'content') {
            if (showContentFilterSubType) {
              if (value.startsWith(n) && value !== n) {
                return true;
              }
            } else if (value === n) {
              return true;
            }
          } else if (value === n) {
            return true;
          }

          // 线下课 course 映射到 offline_course
          if (n === 'course' && value === 'offline_course') {
            return true;
          }
        }

        return false;
      }
    );
  }

  // 限制只能选择教育商品
  const { isOnlyShowEduGoods } = dictConfig;
  (isOnlyShowEduGoods !== false) && (_typeFilterOptions = [knowledgeOption]);

  const fetchGoods = (data: any) => {
    const fn = isUmpType ? fetchGoodsForUmp : fetchGoodsForEdu;

    if (isUmpType) {
      data.activityType = activityType;
      data.activityId = activityId;
    } else if (showSoldOut) {
      data.showSoldOut = 2;
    }

    if (needSkuInfo) {
      data.isSkuMode = true;
    }

    return fn(data).then((result) => {
      // 调用自定义函数，对数据进行处理
      if (mapGoodsValue) {
        result.items.map((item: any) => {
          return mapGoodsValue(item) || item;
        });
      }
      return result;
    });
  };

  const result: IPropsConfig = {
    ...initConfig,
    hideSideBar: true,
    fetchGoods,
    fetchFilterGroups,
    modes: ['goods'],
    isSupportGoodsImport: false,
    goods: {
      ...initConfig.goods,
      channels: ['online'],
      isSingle: _isSingle,
      isSkuMode: _isSkuMode,
      maxGoodsNum: _maxGoodsNum,
      maxSkuNum: _maxSkuNum,
      enableNegativeStock: soldOutSelectable,
      online: {
        ...get(initConfig, 'goods.online', {}),
        selectTypes,
        typeFilterOptions: _typeFilterOptions,
        showTypeFilter: _showTypeFilter,
        defineColumns: ({ oldColumns }: any) => {
          const columns: any[] = [];
          // 过滤商品分组
          if (showGroupColumn === false) {
            oldColumns = deleteColumn(oldColumns, 'group');
          }
          // 自定义其他列的显示
          if (showStockColumn === false) {
            oldColumns = deleteColumn(oldColumns, 'goodsInventory');
          }
          if (showSalesColumn === false) {
            oldColumns = deleteColumn(oldColumns, 'goodsSales');
          }

          // 可配置 columns
          if (!_showNotOptionalReason) {
            oldColumns = deleteColumn(oldColumns, 'notOptionalReason');
          }
          if (!_showJoinActivity) {
            oldColumns = deleteColumn(oldColumns, 'activityJoins');
          }
          // 过滤渠道
          oldColumns = deleteColumn(oldColumns, 'sourceShop');
          // 过滤规格
          if (!_isSkuMode) {
            oldColumns = deleteColumn(oldColumns, 'sku');
          }

          oldColumns.forEach((item: any) => {
            if (item.name === 'goodsInventory') {
              // @ts-ignore
              item.bodyRender = ({ owlItemType, goodsInventory }) => {
                if (owlItemType && owlItemType !== OwlItemType.OFFLINE_COURSE) {
                  return '不限库存';
                } else if (!owlItemType && goodsInventory >= MAX_INVENTORY) {
                  return '不限库存';
                }
                return goodsInventory;
              };
            }
            columns.push({ ...item });
          });

          return columns;
        },
      },
    },
  };

  return result;
};

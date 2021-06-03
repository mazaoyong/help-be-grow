import React, { FC, useCallback, useMemo, ReactNode } from 'react';
import { IGridColumn, IGridCellPos } from 'zent';
import {
  Operations,
  CouponSelector as RCCouponSelector,
  GoodsSelectorV2,
  LinkButton,
  BlankLink,
} from '@youzan/react-components';
import { EasyList } from '@youzan/ebiz-components';

import { getNewCouponList, ICouponListItem } from './api';

import './style.scss';

interface ICouponSelectorProps {
  /** 已选优惠券列表宽 */
  width?: number;
  disabled?: boolean;
  helpDesc?: ReactNode;
  /** 添加优惠券按钮的文案 */
  triggerText?: string;
  /** grid需要添加的列 */
  attachColumns?: IGridColumn[];
  value: ICouponListItem[];
  /** 活动类型分组 0:全部分组 1：优惠券 2：优惠码 */
  activityTypeGroup: number;
  /** 活动场景值，是个固定值 */
  refActivityScene: string;
  /** 是否展示最后数量选择那一列 */
  showStepper?: boolean;
  /** 最大种类限制 */
  maxTypeLimit?: number;
  /** 所有选择券的最大数量限制 */
  maxNumLimit?: number;
  /** 对优惠券的columns进行覆盖 */
  overlapColumns?: any[];
  /** Table 中的行是否单选 */
  isSingleSelection?: boolean;
  /** SearchInput 的 placeholder */
  searchPlaceholder?: string;
  /** 如果不指定这个属性只会渲染一个删除按钮 */
  renderOperators?(couponData: ICouponListItem, gridPos: IGridCellPos): ReactNode;
  /** 添加优惠券的回调 */
  onChange(value: ICouponListItem[]): void;
}

const { GridPop } = EasyList;
const { SelectResult } = GoodsSelectorV2;
const COUPON_CONTENT = { title: '优惠内容', width: '200px', name: 'preferentialCopywriting' };

const CouponSelector: FC<ICouponSelectorProps> = ({
  width,
  disabled,
  helpDesc,
  triggerText = '添加优惠券',
  attachColumns = [COUPON_CONTENT],
  value,
  activityTypeGroup,
  refActivityScene,
  showStepper = true,
  maxTypeLimit,
  maxNumLimit,
  overlapColumns,
  isSingleSelection = false,
  searchPlaceholder,
  renderOperators,
  onChange: propsChange,
}) => {
  const couponListConfig = useMemo<IGridColumn<ICouponListItem>[]>(
    () => [
      {
        title: '优惠券名称',
        width: '120px',
        bodyRender(couponData) {
          const { title, takeUrl } = couponData;

          return (
            <BlankLink href={takeUrl}>
              {title}
            </BlankLink>
          );
        },
      },
      // 附加内容展示区域
      ...attachColumns,
      {
        title: '操作',
        textAlign: 'right',
        bodyRender(couponData, gridPos) {
          if (disabled) {
            return '-';
          }
          const _handleDelete = () => {
            const _value = value.filter((item) => item.id !== couponData.id);
            propsChange(_value);
          };
          if (renderOperators) {
            return renderOperators(couponData, gridPos);
          }
          return (
            <Operations
              items={[
                <GridPop
                  key="delete"
                  text="删除"
                  trigger="click"
                  content="是否删除？"
                  onConfirm={_handleDelete}
                />,
              ]}
            />
          );
        },
      },
    ],
    [attachColumns, disabled, renderOperators, value, propsChange],
  );

  const fetchCouponList = useCallback(
    ({ keyword, pageNo, pageSize }) => {
      return new Promise((resolve, reject) =>
        getNewCouponList({
          titleKeyword: keyword,
          pageNum: pageNo,
          pageSize,
          activityTypeGroup,
          refActivityScene,
        })
          .then((data) => {
            const { items = [], ...otherProps } = data;

            const itemListWithStatus = items.map((item) => {
              return {
                ...item,
                rangeTypeDesc: item.applicableGoodRangeDesc,
                preferentialDesc: item.preferentialCopywriting,
                humanLimitDesc: item.userIdentityLimitCopywriting || '不限制',
                fetchNumLimitDesc: item.userTakeLimitCopyWriting,
                remainQty: item.remainStock,
                isCanSelect: item.isSelectable,
              };
            });

            resolve({
              ...otherProps,
              items: itemListWithStatus,
            });
          })
          .catch(reject),
      );
    },
    [activityTypeGroup, refActivityScene],
  );

  const handleAdd = useCallback(() => {
    if (disabled) return;
    let amountMap = {};
    if (showStepper) {
      value.forEach((v) => {
        amountMap[v.id] = v.amount;
      });
    }

    RCCouponSelector.open({
      selected: value,
      fetchApi: fetchCouponList,
      showStepper,
      amountMap,
      maxTypeLimit,
      maxNumLimit,
      overlapColumns,
      isSingleSelection,
      searchPlaceholder,
      btnLink: window._global.isSuperStore ? '/ump/coupon' : '/v2/ump/tradeincard',
      onChange: propsChange,
    });
  }, [
    disabled,
    fetchCouponList,
    isSingleSelection,
    maxNumLimit,
    maxTypeLimit,
    overlapColumns,
    propsChange,
    searchPlaceholder,
    showStepper,
    value,
  ]);

  return (
    <div className="coupon-selector">
      <div className="coupon-selector__trigger">
        <LinkButton onClick={handleAdd} disabled={!!disabled}>
          {triggerText}
        </LinkButton>
      </div>
      <div className="description">{helpDesc}</div>
      <div className="present-selector-grid">
        <SelectResult
          rowKey="id"
          width={width}
          columns={couponListConfig}
          datasets={value}
          isShow={value.length > 0}
        />
      </div>
    </div>
  );
};

export default CouponSelector;

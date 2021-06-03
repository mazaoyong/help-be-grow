import React from 'react';
import { differenceBy } from 'lodash';
import { Grid, IGridColumn, IGridCellPos, FormControl, Notify } from 'zent';
import { Operations, CouponSelector as RCCouponSelector } from '@youzan/react-components';
import buildUrl from '@youzan/utils/url/buildUrl';
import { EasyList } from '@youzan/ebiz-components';

import CommonLink from 'components/common-link';
import { getNewCouponList } from './api';
import './style.scss';

interface ICoupon extends Record<string, any> {
  couponAlias: string;
  /** 优惠券名称 */
  couponName: string;
  couponId: number;
  /** 优惠券内容 */
  couponContent: string;
  available: boolean;
}
interface IFormProps {
  required?: boolean;
  label: string;
  helpDesc?: React.ReactNode;
}
interface ICouponSelectorProps extends IFormProps {
  width?: string;
  loading: boolean;
  /** 添加优惠券按钮的文案 */
  triggerText?: string;
  /**  grid需要添加的列 */
  attachColumns?: IGridColumn[];
  couponList: ICoupon[];
  /** 如果不指定这个属性只会渲染一个删除按钮 */
  renderOperators?(couponData: ICoupon, gridPos: IGridCellPos): React.ReactNode;
  /** 添加优惠券的回调 */
  onChange(couponList: ICoupon[]): void;
  onDelete?(couponData: ICoupon): void;
}

const MAX_COUPON_TYPE_NUM = 6;
const OVERLAP_COLUMNS = [
  {
    title: '优惠券名称',
    name: 'title',
    bodyRender(data) {
      return (
        <CommonLink target="_blank" url={data.takeUrl}>
          {data.title}
        </CommonLink>
      );
    },
  },
  {
    title: '适用商品',
    name: 'applicableGoodRangeDesc',
  },
  {
    title: '优惠内容',
    name: 'preferentialCopywriting',
  },
  {
    title: '领取人限制',
    name: 'humanLimitDesc',
    // overlapColumn有点问题，没法覆盖，所以得用bodyRender去重写
    bodyRender(data) {
      return data.userIdentityLimitCopywriting;
    },
  },
  {
    title: '剩余库存',
    name: 'remainStock',
  },
  {
    title: '备注',
    name: 'unSelectReason',
  },
];
const UNAVAILABLE = '[已失效]';
const COUPON_CONTENT = { title: '优惠内容', width: '200px', name: 'couponContent' };
const { GridPop } = EasyList;
const CouponSelector: React.FC<ICouponSelectorProps> = (props) => {
  const {
    loading,
    onDelete,
    couponList,
    renderOperators,
    width = '520px',
    onChange: propsChange,
    attachColumns = [COUPON_CONTENT],
    triggerText = '添加优惠券',
  } = props;

  // 需要用到onDelete方法，放在FC内比抽出去更加合适
  const couponListConfig = React.useMemo<IGridColumn<ICoupon>[]>(
    () => [
      {
        title: '优惠券名称',
        width: '160px',
        bodyRender(couponData) {
          const isAvailable = couponData.available;
          // 失效优惠券不设置跳转，添加失效前缀
          if (!isAvailable) return UNAVAILABLE + couponData.couponName;
          const targetUrl = buildUrl(
            `/wscump/coupon/fetch?alias=${couponData.couponAlias}&kdt_id=${_global.kdtId}`,
            'h5',
            _global.kdtId,
          );
          return (
            <CommonLink url={targetUrl} target="_blank">
              {couponData.couponName}
            </CommonLink>
          );
        },
      },
      // 附加内容展示区域
      ...attachColumns,
      {
        title: '操作',
        textAlign: 'right',
        bodyRender(couponData, gridPos) {
          const _handleDelete = () => onDelete && onDelete(couponData);
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
    [attachColumns, onDelete, renderOperators],
  );

  const fetchCouponList = React.useCallback(({ keyword, pageNo, pageSize }) => {
    return new Promise((resolve) =>
      getNewCouponList({
        titleKeyword: keyword,
        pageNum: pageNo,
        pageSize,
        activityTypeGroup: 1, // 活动类型分组 0:全部分组 1：优惠券 2：优惠码
        refActivityScene: 'EDU_LIVE_BROADCAST', // 活动场景值，是个固定值
      })
        .then((data) => {
          const { items = [], ...otherProps } = data;
          // RC版本太低了，替换新接口需要手动打赏标识来让优惠券选择器组件设置为禁用状态
          const itemListWithStatus = (items as any[]).map(attachUnselectState);
          resolve({
            ...otherProps,
            items: itemListWithStatus,
          });
        })
        .catch(() => Notify.error('获取优惠券列表错误')),
    );
  }, []);

  const selectedCoupon = React.useMemo(() => couponList.map((item) => ({ id: item.couponId })), [
    couponList,
  ]);

  const handleAdd = React.useCallback(() => {
    RCCouponSelector.open({
      selected: selectedCoupon,
      fetchApi: fetchCouponList,
      showStepper: false,
      maxTypeLimit: MAX_COUPON_TYPE_NUM,
      btnLink: window._global.isSuperStore ? '/ump/coupon' : '/v2/ump/tradeincard',
      onChange(curCouponList: any[]) {
        const minusCouponList = differenceBy(selectedCoupon, curCouponList, 'id');
        const addonCouponList = differenceBy(curCouponList, selectedCoupon, 'id');
        const minusCouponIds = minusCouponList.map((couponData) => couponData.id);
        // 保持原有顺序的情况下增删数据
        const newCouponList = selectedCoupon
          .filter((couponData) => !minusCouponIds.includes(couponData.id))
          .concat(addonCouponList);
        propsChange(
          newCouponList.map(
            (coupon: any) =>
              ({
                couponId: coupon.id,
                couponName: coupon.title,
                couponContent: coupon.preferentialDesc,
              } as ICoupon),
          ),
        );
      },
      overlapColumns: OVERLAP_COLUMNS,
    });
  }, [fetchCouponList, propsChange, selectedCoupon]);

  return (
    <FormControl label={props.label} required={props.required}>
      <div className="coupon-selector" style={{ width }}>
        <div className="coupon-selector__trigger">
          <CommonLink onClick={handleAdd}>{triggerText}</CommonLink>
        </div>
        <div className="description">{props.helpDesc}</div>
        <Grid
          loading={loading}
          rowKey="couponId"
          datasets={couponList}
          columns={couponListConfig}
        />
      </div>
    </FormControl>
  );
};

export default CouponSelector;
export type ICouponImpl = ICoupon;

function attachUnselectState(data: any) {
  const isCanSelect = data.isSelectable;
  const decorateData = { ...data };
  if (!isCanSelect) {
    // 添加不可选状态
    decorateData.isCanSelect = false;
    decorateData.status = 2;
  }
  return decorateData;
}

import React, { FC, useMemo, useCallback, useState, useEffect } from 'react';
import { Input, FormError, Checkbox, NumberInput } from 'zent';
import {
  RewardTypeEnum,
  IRewardItem,
} from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';
import CouponSelector from 'components/field/coupon-select';
import { ICouponListItem } from 'components/field/coupon-select/api';
import { IPresentListItem } from 'components/field/present-select/api';
import PresentSelector, { getSelectedPresentLength } from 'components/field/present-select';
import { debounce } from 'lodash';
import { POINTS_NAME } from '@ability-center/common';
import { getRewardCopywriting } from './api';

import './index.scss';

const MAX_COUPON_SELECT = 10;

const MAX_PRESENT_SELECT = 10;

const attachColumns = [
  { name: 'preferentialCopywriting', title: '优惠内容', width: '120px' },
  { name: 'amount', title: '数量', width: '80px' },
];

export interface IRewardItemVal {
  id: number;
  title: string;
  quantity: number;
}
export interface IRewardFieldValue {
  name?: string;
  point?: number | undefined;
  coupon?: IRewardItemVal[] | IRewardItem[];
  present?: IRewardItemVal[] | IRewardItem[];
  checked?: RewardTypeEnum[];
}

export enum FieldType {
  'NAME' = 'name',
  'COUPON' = 'coupon',
  'POINT' = 'point',
  'PRESENT' = 'present',
}

interface IProps {
  value: IRewardFieldValue;
  disabled: boolean;
  showLabel?: boolean;
  fieldConfig: FieldType[];
  onChange: (val: IRewardFieldValue) => void;
}

const RewardField: FC<IProps> = ({ value, disabled, onChange, fieldConfig, showLabel = true }) => {
  const [_couponList, setCouponList] = useState<ICouponListItem[]>([]);
  const [_presentList, setPresentList] = useState<IPresentListItem[]>([]);
  const [hasInit, setHasInit] = useState<boolean>(false);
  const [checked, setChecked] = useState<number[]>([]);

  const selectedPresentLength = useMemo(() => {
    return getSelectedPresentLength(_presentList);
  }, [_presentList]);

  const nameErrText = useMemo(() => {
    if (value.name && value.name.length > 20) {
      return '最多可输入20个字';
    }
    return '';
  }, [value.name]);

  const pointErrText = useMemo(() => {
    if (checked.includes(RewardTypeEnum.POINT) && (!value.point || value.point <= 0)) {
      return `请输入${POINTS_NAME}`;
    }
    return '';
  }, [checked, value.point]);

  const couponErrText = useMemo(() => {
    if (_couponList.length === 0) {
      return '请选择优惠券/码';
    }
    return '';
  }, [_couponList.length]);

  const presentErrText = useMemo(() => {
    if (_presentList.length === 0) {
      return '请选择赠品';
    }
    if (selectedPresentLength > MAX_PRESENT_SELECT) {
      return `最多选择${MAX_PRESENT_SELECT}个赠品`;
    }
    return '';
  }, [_presentList.length, selectedPresentLength]);

  const debounceChange = useCallback(debounce(onChange, 500), []);

  const handleNameChange = useCallback(
    ({ target: { value: name } }) => {
      onChange({
        ...value,
        name,
      });
    },
    [onChange, value],
  );

  const handlePointChange = useCallback(
    val => {
      if (fieldConfig.includes(FieldType.POINT)) {
        value.point = +val;
      }
      onChange({
        ...value,
      });
    },
    [fieldConfig, onChange, value],
  );

  const handleCouponChange = useCallback(
    val => {
      setCouponList(val);
      const couponList: IRewardItemVal[] = val.map(v => ({
        id: v.id,
        quantity: Number(v.amount || 0),
        title: `${v.preferentialCopywriting}优惠券`,
      }));
      if (fieldConfig.includes(FieldType.COUPON) && value.coupon) {
        value.coupon = couponList;
      }
      debounceChange({
        ...value,
      });
    },
    [debounceChange, fieldConfig, value],
  );

  const handlePresentChange = useCallback(
    val => {
      setPresentList(val);
      const presentList: IRewardItemVal[] = val.map(v => ({
        id: v.id,
        quantity: v.pieces || 1,
        title: v.title,
      }));
      if (fieldConfig.includes(FieldType.PRESENT) && value.present) {
        value.present = presentList;
      }
      debounceChange({
        ...value,
      });
    },
    [debounceChange, fieldConfig, value],
  );

  const clearSelectedVal = useCallback(
    selected => {
      if (!selected.includes(RewardTypeEnum.POINT) && value.point) {
        handlePointChange(0);
      }
      if (!selected.includes(RewardTypeEnum.COUPON) && _couponList.length > 0) {
        handleCouponChange([]);
      }
      if (!selected.includes(RewardTypeEnum.PRESENT) && _presentList.length > 0) {
        handlePresentChange([]);
      }
    },
    [
      _couponList.length,
      _presentList.length,
      handleCouponChange,
      handlePointChange,
      handlePresentChange,
      value.point,
    ],
  );

  const handleCheckboxChange = useCallback(
    val => {
      setChecked(val);
      clearSelectedVal(val);
      debounceChange({
        ...value,
        checked: val
      });
    },
    [clearSelectedVal, debounceChange, value],
  );

  const init = useCallback(() => {
    let awardList: any[] = [];
    const checked: number[] = [];
    if (value.coupon && value.coupon.length > 0) {
      const cl = (value.coupon as IRewardItem[]).map(v => ({
        awardBizId: '' + v.id,
        type: 2,
        awardAmount: v.quantity,
      }));
      awardList = awardList.concat(cl);
    }
    if (value.present && value.present.length > 0) {
      const pl = (value.present as IRewardItem[]).map(v => ({
        awardBizId: '' + v.id,
        type: 3,
        awardAmount: v.quantity,
      }));
      awardList = awardList.concat(pl);
    }
    value.point && checked.push(RewardTypeEnum.POINT);
    getRewardCopywriting({
      awardList,
    }).then(res => {
      const { couponList = [], presentList = [] } = res;
      const newVal = { ...value };
      if (couponList.length) {
        checked.push(RewardTypeEnum.COUPON);
        setCouponList(
          couponList.map(item => {
            return {
              id: item.id,
              title: item.title || '',
              preferentialCopywriting: item.preferentialCopywriting || '',
              amount: item.quantity,
              takeUrl: item.fetchUrl,
            };
          }),
        );
        newVal.coupon = couponList.map(item => {
          return {
            id: item.id,
            quantity: Number(item.quantity || 0),
            title: `${item.preferentialCopywriting}优惠券`,
          };
        });
      }
      if (presentList.length) {
        checked.push(RewardTypeEnum.PRESENT);
        setPresentList(
          presentList.map(item => {
            return {
              id: item.id,
              alias: item.goodsAlias || '',
              title: item.name || '',
              imageUrl: item.picture || '',
              stock: item.stock || 0,
              pieces: item.quantity,
            };
          }),
        );
        newVal.present = presentList.map(item => {
          return {
            id: item.id,
            quantity: item.quantity || 1,
            title: item.name,
          };
        });
      }
      newVal.checked = checked;
      onChange(newVal);
      setChecked(checked);
    });
  }, [onChange, value]);

  useEffect(() => {
    if (!hasInit) {
      init();
      setHasInit(true);
    }
  }, [hasInit, init]);

  return (
    <>
      {fieldConfig.includes(FieldType.NAME) && (
        <div className="reward-field-block">
          <label className="reward-field-label">奖励名称：</label>
          <div className="reward-field-content">
            <div className="reward-field-content-inner">
              <Input
                placeholder="20个字以内，如：价值100元训练营大礼包"
                onChange={handleNameChange}
                width={333}
                value={value.name}
                disabled={disabled}
                className={nameErrText ? '' : 'no-error'}
              />
            </div>
            {nameErrText && <FormError className='without-control'>{nameErrText}</FormError>}
          </div>
        </div>
      )}
      <div className="reward-field-block">
        {showLabel && (
          <label className="reward-field-label reward-field-label-required">奖励内容：</label>
        )}
        <div className="reward-field-content">
          <div className="reward-field-content-inner">
            <Checkbox.Group value={checked} onChange={handleCheckboxChange} disabled={disabled}>
              {fieldConfig.includes(FieldType.POINT) && (
                <div className="checkbox-group-item form-error-control">
                  <Checkbox value={RewardTypeEnum.POINT}>
                    <div className="reward-field-content-inner">
                      <span>送</span>
                      <NumberInput
                        min={0}
                        max={99999}
                        width={80}
                        value={value.point}
                        style={{ margin: '0 7px' }}
                        className={`${!pointErrText ? 'no-error' : ''}`}
                        onChange={handlePointChange}
                        disabled={disabled || !checked.includes(RewardTypeEnum.POINT)}
                      />
                      <span>{POINTS_NAME}</span>
                    </div>
                  </Checkbox>
                  {pointErrText && (
                    <FormError>{pointErrText}</FormError>
                  )}
                </div>
              )}
              {fieldConfig.includes(FieldType.COUPON) && (
                <div className="checkbox-group-item form-error-control">
                  <Checkbox value={RewardTypeEnum.COUPON}>送优惠券/码</Checkbox>
                  {checked.includes(RewardTypeEnum.COUPON) && (
                    <>
                      <CouponSelector
                        width={450}
                        refActivityScene="RCMD_PRICE"
                        activityTypeGroup={0}
                        maxNumLimit={MAX_COUPON_SELECT}
                        attachColumns={attachColumns}
                        value={_couponList}
                        triggerText={`${_couponList.length ? '修改已选' : '选择'}优惠券/码`}
                        disabled={disabled}
                        onChange={handleCouponChange}
                      />
                      {couponErrText && <FormError>{couponErrText}</FormError>}
                    </>
                  )}
                </div>
              )}
              {fieldConfig.includes(FieldType.PRESENT) && (
                <div className="checkbox-group-item form-error-control">
                  <Checkbox value={RewardTypeEnum.PRESENT}>送赠品</Checkbox>
                  {checked.includes(RewardTypeEnum.PRESENT) && (
                    <>
                      <PresentSelector
                        width={450}
                        value={_presentList}
                        maxNumLimit={MAX_PRESENT_SELECT}
                        multiple
                        partialMultiPieces
                        triggerText={`${_presentList.length ? '修改已选' : '选择'}赠品`}
                        disabled={disabled}
                        onChange={handlePresentChange}
                      />
                      {presentErrText && (
                        <FormError>{presentErrText}</FormError>
                      )}
                    </>
                  )}
                </div>
              )}
            </Checkbox.Group>
          </div>
          {checked.length === 0 && <FormError>请至少选择一项奖励内容</FormError>}
        </div>
      </div>
    </>
  );
};

export default RewardField;

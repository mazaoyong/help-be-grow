
import { Form } from '@zent/compat';
import React, { useEffect, useState, useCallback, forwardRef, useMemo } from 'react';
import { hashHistory } from 'react-router';
import { BlockLoading, Button, Notify, Radio, Checkbox } from 'zent';
import { isBefore, isAfter } from 'date-fns';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import { pctCheck } from 'fns/auth';
import { isSingleStore, isRetailShop, isHqStore } from '@youzan/utils-shop';
import { BRANCH_STORE_NAME } from 'constants/chain';

import GoodsField from '../../components/goods-field';
import CouponField from '../../components/coupon-field';
import PresentField from '../../components/present-field';

import { getDetailById, create, update } from '../../api';

import { isEnabled } from '../../utils';
import dateRangeField from '../../components/date-range-field';

import './styles.scss';

const now = new Date();

const supportPresent = isSingleStore && !isRetailShop;

const {
  Field,
  FormInputField,
  FormNumberInputField,
  createForm,
  FormRadioGroupField,
  FormCheckboxGroupField,
} = Form;

const scoreName = window._global.pointsName;

const defaultFormData = {
  name: '',
  effectiveTime: [],
  range: {
    rangeType: 'all', // 参与活动商品范围：all全部商品，part部分商品
    goodsItemList: [],
  },
  enabled: [],
  coupons: [],
  score: 1,
  presents: [],
  canLimitNum: false,
  limitNum: 1,
};

function formatData({
  name,
  effectiveTime,
  range,
  gift,
  limitNum,
  canLimitNum,
  applicableCampusType,
  enabled,
  coupons,
  presents,
  score,
}) {
  const preferentialData = {};
  if (isEnabled(enabled, 'couponEnabled')) {
    preferentialData.couponId = coupons[0].id;
    preferentialData.couponTitle = Number(coupons[0].title) || 0;
    preferentialData.couponNum = Number(coupons[0].amount) || 0;
    preferentialData.preferentialDesc = Number(coupons[0].preferentialDesc) || 0;
  }
  if (isEnabled(enabled, 'presentEnabled')) {
    preferentialData.presentList = presents.map(({
      id,
      alias,
      title,
      pieces,
    }) => ({
      presentId: id,
      alias,
      title,
      num: pieces,
    }));
  }
  if (isEnabled(enabled, 'scoreEnabled')) {
    preferentialData.score = score;
  }
  return {
    name,
    startTime: effectiveTime[0],
    endTime: effectiveTime[1],
    rangeType: range.rangeType,
    goodsItemList: range.goodsItemList,
    preferentialDataList: [preferentialData],
    configInfo: {
      canLimitNum: supportPresent ? canLimitNum : false,
      limitNum: Number(limitNum),
    },
    applicableCampusType,
  };
}

function unformatData({
  name,
  startTime,
  endTime,
  rangeType,
  configInfo: {
    canLimitNum,
    limitNum,
  },
  goodsItemList,
  preferentialDataList,
  applicableCampusType,
}) {
  const range = {
    rangeType,
    goodsItemList,
  };

  const result = {
    name,
    effectiveTime: [startTime, endTime],
    range,
    canLimitNum,
    limitNum,
    applicableCampusType,
    enabled: [],
  };

  if (preferentialDataList[0] && preferentialDataList[0].score) {
    result.enabled.push('scoreEnabled');
    result.score = preferentialDataList[0].score;
  }
  if (preferentialDataList[0] && preferentialDataList[0].couponId) {
    result.enabled.push('couponEnabled');
    result.coupons = [{}];
    result.coupons[0].id = preferentialDataList[0].couponId;
    result.coupons[0].title = preferentialDataList[0].couponTitle;
    result.coupons[0].amount = preferentialDataList[0].couponNum;
    result.coupons[0].preferentialDesc = preferentialDataList[0].preferentialDesc;
  }
  if (preferentialDataList[0] &&
      preferentialDataList[0].presentList &&
      preferentialDataList[0].presentList.length > 0) {
    result.enabled.push('presentEnabled');
    result.presents = preferentialDataList[0].presentList.map(({
      presentId,
      alias,
      title,
      num,
      stock,
      imageUrl,
      isOwlGoods,
    }) => ({
      id: presentId,
      alias,
      title,
      pieces: num,
      stock: isOwlGoods ? '不限库存' : stock,
      imageUrl,
    }));
  }
  return result;
}

function Edit({ zentForm, handleSubmit, route, params }, ref) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [initialGoodsList, setInitialGoodsList] = useState([]);

  const stat = useMemo(() => {
    let _stat = 'VIEW';
    if (/add/.test(window.location.href)) {
      _stat = 'ADD';
    } else if (/edit/.test(window.location.href)) {
      _stat = 'EDIT';
    }
    return _stat;
  }, []);

  useEffect(() => {
    zentForm.initialize(defaultFormData);
    if (stat !== 'ADD') {
      setLoading(true);
      getDetailById({ id: params.id }).then(data => {
        setInitialGoodsList(data.goodsItemList);
        const _data = unformatData(data);
        zentForm.setFieldsValue(_data);

        const _active = isBefore(data.startTime, Date.now()) && isAfter(data.endTime, Date.now());
        setActive(_active);
      }).catch(msg => {
        Notify.error(msg);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [zentForm, params, stat]);

  const submit = useCallback(values => {
    return pctCheck().then(() => {
      zentForm.asyncValidateForm(() => {
        const data = formatData(values);

        setLoading(true);

        const func = stat === 'ADD' ? create : update;

        if (stat === 'EDIT') {
          data.id = params.id;
        }

        func(data).then(() => {
          Notify.success('操作成功');
          hashHistory.push('/list/3');
        }).catch(msg => {
          Notify.error(msg);
        }).finally(() => {
          setLoading(false);
        });
      });
    });
  }, [params, stat, zentForm]);

  const form = zentForm.getFormValues();
  const finished = stat === 'VIEW';

  return (
    <div ref={ref}>
      <BlockLoading loading={loading}>
        <Form horizontal className="pct-freebie-edit" onSubmit={handleSubmit(submit)}>
          <FormInputField
            name="name"
            label="活动名称："
            type="text"
            disabled={finished}
            placeholder="20个字以内"
            autoComplete="off"
            required
            asyncValidation={(values, value) => new Promise((resolve, reject) => {
              if (!value || value.length === 0) {
                return reject('请输入活动名称');
              }
              if (value.length > 20) {
                return reject('最多可输入20个字');
              }
              resolve();
            })}
          />
          <Field
            name="range"
            label="活动商品："
            disabled={stat === 'EDIT' || finished}
            activityId={params.id || ''}
            component={GoodsField}
            initialValue={initialGoodsList}
            required
            asyncValidation={(values, value) => new Promise((resolve, reject) => {
              if (value.rangeType === 'part' && (!value.goodsItemList || value.goodsItemList.length === 0)) {
                return reject('请选择商品');
              }
              resolve();
            })}
          />
          <FormCheckboxGroupField
            className="pct-freebie-preferential"
            name="enabled"
            label="优惠设置："
            disabled={active || finished}
            required
            onChange={value => {
              // 解决联动触发强制校验的问题
              const newFieldsValue = {};
              if (!isEnabled(value, 'couponEnabled')) {
                newFieldsValue.coupons = [];
              }
              if (!isEnabled(value, 'scoreEnabled')) {
                newFieldsValue.score = 1;
              }
              if (!isEnabled(value, 'presentEnabled')) {
                newFieldsValue.presents = [];
              }
              zentForm.setFieldsValue(newFieldsValue);
              setTimeout(() => {
                zentForm.asyncValidateForm();
              }, 0);
            }}
            asyncValidation={(values, value) => new Promise((resolve, reject) => {
              if (!isEnabled(values.enabled, 'couponEnabled') && !isEnabled(values.enabled, 'scoreEnabled') && !isEnabled(values.enabled, 'presentEnabled')) {
                return reject('请选择一个优惠');
              }
              resolve();
            })}
            helpDesc={supportPresent || (isHqStore && (form.presents && form.presents.length > 0)) ? '支持赠送课程、实物，最多设置10个赠品；若赠品库存为0，则客户无法领取到该赠品' : ''}
          >
            <div>
              <Checkbox
                value="couponEnabled"
                className="pct-freebie-no-field"
              >
                <div>送优惠券</div>
              </Checkbox>
            </div>
            <Field
              name="coupons"
              label=""
              disabled={active || finished}
              component={CouponField}
              className={isEnabled(form.enabled, 'couponEnabled') ? 'pct-freebie-sub-field' : 'pct-freebie-hidden-field'}
              asyncValidation={(values, value) => new Promise((resolve, reject) => {
                if (isEnabled(values.enabled, 'couponEnabled')) {
                  const amount = value[0] && value[0].amount;
                  if (!amount) {
                    return reject('请选择优惠券');
                  }
                  if (amount > 10) {
                    return reject('优惠券不能超过10张');
                  }
                }
                resolve();
              })}
            />

            <div>
              <Checkbox
                value="scoreEnabled"
                className="pct-freebie-no-field"
              >
                送{scoreName}
                <span style={{
                  visibility: isEnabled(form.enabled, 'scoreEnabled') ? 'visible' : 'hidden',
                }}>
                  <FormNumberInputField
                    className="pct-freebie-inline-field"
                    name="score"
                    disabled={active || finished}
                    min={1}
                    max={9999999}
                    decimal={0}
                    width="80px"
                    onChange={() => {
                      setTimeout(() => {
                        zentForm.asyncValidateForm();
                        zentForm.validateForm();
                      }, 0);
                    }}
                  />
                  <span>{scoreName}</span>
                </span>
              </Checkbox>
            </div>

            <div className={supportPresent || (isHqStore && (form.presents && form.presents.length > 0)) ? 'form-presents__show' : 'form-presents__hidden'}>
              <div>
                <Checkbox
                  value="presentEnabled"
                  className="pct-freebie-no-field"
                >
                  <div>送赠品</div>
                </Checkbox>
              </div>

              <Field
                name="presents"
                label=""
                disabled={active || finished}
                component={PresentField}
                className={isEnabled(form.enabled, 'presentEnabled') ? 'pct-freebie-sub-field' : 'pct-freebie-hidden-field'}
                appendix={form}
                asyncValidation={(values, value) => new Promise((resolve, reject) => {
                  if (isEnabled(values.enabled, 'presentEnabled')) {
                    if (!value || value.length === 0) {
                      return reject('请选择赠品');
                    }
                    if (value.length > 10) {
                      return reject('赠品不能超过10件');
                    }
                  }
                  resolve();
                })}
              />
            </div>
          </FormCheckboxGroupField>
          <Field
            name="effectiveTime"
            label="活动时间："
            showTime
            config={[
              {
                min: now,
                disabled: active || finished,
              },
              {
                min: now,
                disabled: finished,
              },
            ]}
            component={dateRangeField}
            autoComplete="off"
            required
            asyncValidation={(values, value) => new Promise((resolve, reject) => {
              if (!value[0] || !value[1]) {
                return reject('请选择活动时间');
              }
              return resolve();
            })}
          />
          <ShowWrapper
            isInStoreCondition={isInStoreCondition({ supportHqStore: true })}
          >
            <FormRadioGroupField
              name="applicableCampusType"
              label={`适用${BRANCH_STORE_NAME}：`}
              helpDesc={`买赠活动只适用全部${BRANCH_STORE_NAME}`}
              value={1}
              disabled={active || finished}
              required
            >
              <Radio value={1}>全部{BRANCH_STORE_NAME}</Radio>
            </FormRadioGroupField>
          </ShowWrapper>
          {supportPresent ? (
            <FormRadioGroupField
              name="canLimitNum"
              label="活动参与次数："
              disabled={active || finished}
              required
              onChange={() => {
                setTimeout(() => {
                  zentForm.asyncValidateForm();
                }, 0);
              }}
              asyncValidation={(values, value) => new Promise((resolve, reject) => {
                if (values.canLimitNum && !values.limitNum) {
                  return reject('请输入参与次数');
                }
                return resolve();
              })}
              helpDesc="每个客户参与买赠活动的最高上限，超出次数后客户再购买不会获得此优惠；当设置的是每人只能参与1次时，若客户参与了1次买赠活动但进行了退款，退款成功后，该客户也不允许再次参与活动"
              className="pct-freebie-limit-num-radio-field"
            >
              <div className="pct-freebie-radio-field">
                <Radio value={false}>每人不限次数</Radio>
              </div>
              <div className="pct-freebie-radio-field">
                <Radio value={true}>
                  每人只能参与
                  <FormNumberInputField
                    className="pct-freebie-inline-field"
                    name="limitNum"
                    min={1}
                    max={999}
                    decimal={0}
                    width="80px"
                    disabled={!form.canLimitNum}
                    onChange={() => {
                      setTimeout(() => {
                        zentForm.asyncValidateForm();
                      }, 0);
                    }}
                  />
                  次
                </Radio>
              </div>
            </FormRadioGroupField>
          ) : null}
          <div className="app-design">
            <div className="app-actions">
              <div className="form-actions new-actions text-center">
                <Button
                  onClick={() => {
                    hashHistory.push('/list/3');
                  }}
                >
                  {finished ? '返回' : '取消'}
                </Button>
                {finished ? null : (
                  <Button type="primary" htmlType="submit" loading={loading}>
                    保存
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Form>
      </BlockLoading>
    </div>
  );
}

export default createForm({ scrollToError: true })(forwardRef(Edit));

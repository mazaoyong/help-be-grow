
import { Pop, Form } from '@zent/compat';
import React, { useContext, useMemo, forwardRef, useEffect, useState } from 'react';
import { Grid, Icon } from 'zent';
import Big from 'big.js';
import { format, compareAsc } from 'date-fns';

import { AdjustRecord } from '@ability-center/assets/adjustcourse';

import { Context as CourseContext } from '../../contexts/course';

import { calcDayPrice, calcMaxRefundValue, calcMaxRefundFee, calcSuggestedFee, cent2yuan, parseQuantityStr } from '../../util';
import { getStaff } from '../../api';

import './styles.scss';
import PromotionInfo from '../../components/promotion-info';
import { NumberInputField } from '../../../enrollment/components/number-input';

const { Field, FormSelectField } = Form;

function CourseList({ formList }, ref) {
  const {
    state: courseState,
  } = useContext(CourseContext);

  // 取第一个是目前的逻辑，将来支持续费的话，逻辑可能会变
  // 是否正式课
  const courseType = courseState[0] && courseState[0].courseType;
  // 课程类型
  const courseSellType = courseType === 1 ? (
    courseState[0] && courseState[0].userAsset && courseState[0].userAsset.courseSellType
  ) : -1;
  // 是否已经支付或者标记支付
  const isMarked = courseState[0] && courseState[0].phasePaymentList && courseState[0].phasePaymentList.length !== 0;
  // 是否生效
  const isEffective = courseState[0] && courseState[0].userAsset &&
    (courseState[0].userAsset.startTime && courseState[0].userAsset.endTime);
  // 列表是否可以滚动
  let scrollX;
  // isEffective
  if (isEffective && courseSellType === 0) {
    scrollX = 1400;
  }
  if (courseSellType === 1) {
    scrollX = isMarked ? 1300 : 1400;
  }
  if (isEffective && courseSellType === 2) {
    scrollX = isMarked ? 1400 : 1500;
  }
  // 全部价格
  const totalValue = formList.reduce((total, { refundFee }) => total.plus(refundFee || 0), Big(0)).div(100).toFixed(2);

  // 退回课时
  let totalRefundVal = formList.reduce((total, { refundCourseValue }) => {
    total += (refundCourseValue || 0);
    return total;
  }, 0);
  if (courseSellType === 1) {
    totalRefundVal = totalRefundVal / 100;
  }
  // 销售员名称
  const sellerName = courseState[0] && courseState[0].sellerName;
  // 经办人名称
  const [staffName, setStaffName] = useState('');
  useEffect(() => {
    getStaff({ adminId: window._global.userId }).then(data => {
      setStaffName(data.name || '');
    });
  }, [setStaffName]);

  // 列表展示部分，https://doc.qima-inc.com/pages/viewpage.action?pageId=223860615
  const columns = useMemo(() => {
    const raw = [
      {
        title: '订单号',
        // width: 140,
        bodyRender: ({ orderNo }) => {
          return (
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', minWidth: '140px' }}
              href={'//www.youzan.com/v4/trade/order/detail?orderNo=' + orderNo}
            >
              {orderNo}
            </a>
          );
        },
      },
      // 课时
      {
        title: '购买课时',
        width: 140,
        bodyRender: ({ courseTime }) => {
          return cent2yuan(courseTime.total) + '课时';
        },
        visible: courseSellType === 1,
      },
      {
        title: (
          <div className="edu-refund-course-list-title">
            赠送课时
            <Pop
              trigger="hover"
              content="赠送课时不计入课程价值。退回所有可退课时或全额退款，赠送课时自动失效。"
            >
              <Icon type="help-circle" />
            </Pop>
          </div>
        ),
        width: 140,
        bodyRender: ({ courseTime }) => {
          return courseTime && courseTime.reward ? cent2yuan(courseTime.reward) + '课时' : '-';
        },
        visible: courseSellType === 1,
      },

      // 时段/自定义
      {
        title: '课程有效期',
        width: 140,
        bodyRender: ({ userAsset }) => {
          let startTime = 0;
          let endTime = 0;
          if (isEffective) {
            startTime = format(userAsset.startTime, 'YYYY.MM.DD');
            endTime = format(userAsset.endTime, 'YYYY.MM.DD');
          }
          const quantityStr = parseQuantityStr(userAsset);
          return (
            <>
              {isEffective ? <div>{startTime}-{endTime}</div> : null}
              {quantityStr ? <div>共{quantityStr}</div> : '未生效'}
            </>
          );
        },
        visible: courseSellType === 0 || courseSellType === 2,
      },
      {
        title: (
          <div className="edu-refund-course-list-title">
            赠送天数
            <Pop
              trigger="hover"
              content="赠送天数不计入课程价值。退回所有可退天数或全额退款，赠送天数自动失效"
            >
              <Icon type="help-circle" />
            </Pop>
          </div>
        ),
        width: 140,
        bodyRender: ({ courseRange }) => {
          return courseRange && courseRange.reward ? courseRange.reward + '天' : '-';
        },
        visible: courseSellType === 2 || (isEffective && courseSellType === 0),
      },

      // 按期
      {
        title: '报名班级',
        width: 140,
        bodyRender: ({ course, eduClasses }) => {
          const titles = eduClasses.map(eduClass => eduClass.eduClassName || '').join(',');
          const totalPlanLessonNum = eduClasses.reduce((sum, eduClass) => sum + eduClass.planLessonNum, 0);
          return (
            <>
              <div>{titles}</div>
              <div>已排{totalPlanLessonNum}节课</div>
            </>
          );
        },
        visible: courseSellType === 3,
      },

      // 通用
      {
        title: '课程实付金额',
        width: 140,
        textAlign: 'right',
        bodyRender: ({ itemPromotionInfoList, refundItemDTO }) => {
          return (
            <>
              <div>{'¥' + Big((refundItemDTO && refundItemDTO.realPay) || 0).div(100).toFixed(2)}</div>
              <PromotionInfo
                itemPromotionInfoList={itemPromotionInfoList}
                totalOriginPrice={refundItemDTO.originPrice}
                totalPrice={refundItemDTO.realPay}
              />
            </>
          );
        },
        visible: isMarked,
      },

      {
        title: '课程实付金额',
        width: 140,
        textAlign: 'right',
        bodyRender: (data, { row }) => {
          return (
            <Field
              name={'realPay-' + row}
              component={NumberInputField}
              addonBefore="¥"
              className="edu-refund-course-value edu-refund-course-realpay"
              decimal={2}
            />
          );
        },
        visible: !isMarked,
      },

      {
        title: '收款方式',
        width: 140,
        bodyRender: (data, { row }) => {
          return (
            <FormSelectField
              className="edu-refund-course-paytype"
              name={'payType-' + row}
              data={[
                {
                  value: {
                    payWayDesc: '现金支付账户',
                    payWay: 'CASH_PAY',
                    payType: 'CASH_PAY',
                  },
                  text: '现金支付',
                },
                {
                  value: {
                    payWayDesc: '自有微信支付账户',
                    payWay: 'WEIXIN_SYMBOL_PAY',
                    payType: 'WEIXIN_SYMBOL_PAY',
                  },
                  text: '标记付款-自有微信支付',
                },
                {
                  value: {
                    payWayDesc: '自有支付宝账户',
                    payWay: 'ALIPAY_SYMBOL_PAY',
                    payType: 'ALIPAY_SYMBOL_PAY',
                  },
                  text: '标记付款-自有支付宝',
                },
                {
                  value: {
                    payWayDesc: '自有pos刷卡账户',
                    payWay: 'POS_SYMBOL_PAY',
                    payType: 'POS_SYMBOL_PAY',
                  },
                  text: '标记付款-自有pos刷卡',
                },
              ]}
            />
          );
        },
        visible: !isMarked,
      },

      // 课时
      {
        title: '单课时价格',
        width: 140,
        textAlign: 'right',
        bodyRender: ({ refundItemDTO, courseTime }) => {
          return '¥' + (courseTime.total ? Big((refundItemDTO && refundItemDTO.realPay) || 0).div(courseTime.total).toFixed(2) : 0);
        },
        visible: courseSellType === 1,
      },
      {
        title: '已消课时',
        width: 140,
        bodyRender: ({ courseTime }) => {
          if (!courseTime.used) {
            return '-';
          }
          return cent2yuan(courseTime.used) + '课时';
        },
        visible: courseSellType === 1,
      },
      {
        title: '已退课时/金额',
        width: 140,
        bodyRender: ({ assetNo, refundCourseDTO, refundItemDTO, kdtId }) => {
          const alreadyRefundValue = (refundCourseDTO && refundCourseDTO.refundCourseValue) || 0;
          const alreadyRefundFee = (refundItemDTO && refundItemDTO.itemAlreadyRefundAmt) || 0;
          if (!alreadyRefundValue && !alreadyRefundFee) {
            return '-';
          }
          return (
            <>
              <div>
                {cent2yuan(alreadyRefundValue) + '课时/¥' + cent2yuan(alreadyRefundFee, 2)}
              </div>
              <div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={'/v4/vis/edu/page/refund-record#/list?assetNo=' + assetNo + '&kdtId=' + kdtId}
                >退课记录</a>
              </div>
            </>
          );
        },
        visible: courseSellType === 1,
      },
      {
        title: '已转课时/金额',
        width: 140,
        bodyRender: ({ assetNo, kdtId, transferCourseDTO = {}, orderNo }) => {
          const alreadyTransferValue = (transferCourseDTO && transferCourseDTO.transferOutCnt) || 0;
          const alreadyTransferFee = (transferCourseDTO && transferCourseDTO.transferOutAmt) || 0;
          if (!alreadyTransferValue && !alreadyTransferFee) {
            return '-';
          }
          return (
            <>
              <div>
                {cent2yuan(alreadyTransferValue) + '课时/¥' + cent2yuan(alreadyTransferFee, 2)}
              </div>
              <div>
                <a
                  onClick={() => AdjustRecord({
                    assetNo,
                    orderNo,
                    targetKdtId: kdtId
                  })}
                >转课记录</a>
              </div>
            </>
          );
        },
        visible: courseSellType === 1,
      },
      // 时段/自定义
      {
        title: '单天价格',
        width: 140,
        bodyRender: data => {
          const dayPrice = calcDayPrice(data);
          return dayPrice ? '¥' + dayPrice : '-';
        },
        textAlign: 'right',
        visible: isEffective && (courseSellType === 0 || courseSellType === 2),
      },
      {
        title: '可退时间',
        width: 140,
        bodyRender: data => {
          const quantityOfDay = data.userAsset && data.userAsset.quantityOfDay;
          if (!quantityOfDay) {
            return '-';
          }
          let startTime = format(compareAsc(data.userAsset.startTime, Date.now()) > 0 ? data.userAsset.startTime : Date.now(), 'YYYY.MM.DD');
          let endTime = format(data.userAsset.endTime, 'YYYY.MM.DD');
          return (
            <>
              <div>{startTime + '-' + endTime}</div>
              <div>共{quantityOfDay}天</div>
            </>
          );
        },
        visible: isEffective && (courseSellType === 0 || courseSellType === 2),
      },
      {
        title: isEffective ? '已退天数/金额' : '已退金额',
        width: 140,
        bodyRender: ({ assetNo, refundCourseDTO, refundItemDTO, kdtId }) => {
          const alreadyRefundValue = (refundCourseDTO && refundCourseDTO.refundCourseValue) || 0;
          const alreadyRefundFee = (refundItemDTO && refundItemDTO.itemAlreadyRefundAmt) || 0;
          if (!Number(alreadyRefundValue) && !Number(alreadyRefundFee)) {
            return '-';
          }
          return (
            <>
              <div>
                {(isEffective ? alreadyRefundValue + '天/¥' : '¥') + cent2yuan(alreadyRefundFee, 2)}
              </div>
              <div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={'/v4/vis/edu/page/refund-record#/list?assetNo=' + assetNo + '&kdtId=' + kdtId}
                >退课记录</a>
              </div>
            </>
          );
        },
        textAlign: 'right',
        visible: courseSellType === 0 || courseSellType === 2,
      },
      {
        title: '已转天数/金额',
        width: 140,
        bodyRender: ({ assetNo, kdtId, transferCourseDTO = {}, orderNo }) => {
          const alreadyTransferValue = (transferCourseDTO && transferCourseDTO.transferOutCnt) || 0;
          const alreadyTransferFee = (transferCourseDTO && transferCourseDTO.transferOutAmt) || 0;
          if (!alreadyTransferValue && !alreadyTransferFee) {
            return '-';
          }
          return (
            <>
              <div>
                {alreadyTransferValue + '天/¥' + cent2yuan(alreadyTransferFee, 2)}
              </div>
              <div>
                <a
                  onClick={() => AdjustRecord({
                    assetNo,
                    orderNo,
                    targetKdtId: kdtId
                  })}
                >转课记录</a>
              </div>
            </>
          );
        },
        visible: courseSellType === 0 || courseSellType === 2,
      },
      // 按期
      {
        title: '已上课',
        width: 140,
        bodyRender: ({ eduClasses }) => {
          return eduClasses.reduce((totalLessonNum, eduClass) => totalLessonNum + eduClass.endLessonNum || 0, 0) + '节课';
        },
        visible: courseSellType === 3,
      },
      // 按期/体验课
      {
        title: '已退金额',
        width: 140,
        bodyRender: ({ assetNo, refundCourseDTO, refundItemDTO, kdtId }) => {
          const itemAlreadyRefundAmt = refundItemDTO && refundItemDTO.itemAlreadyRefundAmt;
          if (!itemAlreadyRefundAmt) {
            return '-';
          }

          const alreadyRefundFee = cent2yuan(itemAlreadyRefundAmt, 2);
          return (
            <>
              <div>
                {'¥' + alreadyRefundFee}
              </div>
              <div>
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={'/v4/vis/edu/page/refund-record#/list?assetNo=' + assetNo + '&kdtId=' + kdtId}
                >退课记录</a>
              </div>
            </>
          );
        },
        textAlign: 'right',
        visible: courseType === 0 || courseSellType === 3,
      },
      // inputs
      {
        title: '本次退回课时',
        fixed: 'right',
        width: 140,
        bodyRender: (data, { row }) => {
          const maxRefundValue = calcMaxRefundValue(data);
          let disabled = false;
          let disabledDesc = '';
          let disabledPop = '';
          // 主动退课，课时减到0
          if (data.userAsset && data.userAsset.assetRefundTagList &&
            data.userAsset.assetRefundTagList.find(assetRefundTag => assetRefundTag === 'refund')) {
            disabled = true;
            disabledDesc = '课程已失效';
            disabledPop = '课程退过课，资产失效';
          } else if (data.userAsset && data.userAsset.assetStatus === 4) {
            disabled = true;
            disabledDesc = '课程已失效';
            disabledPop = '课程有效期至 ' + data.userAsset.endTime;
          } else if (!Number(maxRefundValue)) {
            disabled = true;
          }
          return (
            <Field
              name={'refundCourseValue-' + row}
              component={NumberInputField}
              decimal={2}
              disabled={disabled}
              className="edu-refund-course-value edu-refund-course-period"
              asyncValidation={(values, value) => new Promise((resolve, reject) => {
                if (Number(value) > Number(maxRefundValue)) {
                  return reject(`最多可退${maxRefundValue}课时`);
                }
                return resolve();
              })}
              addonAfter="课时"
              helpDesc={disabledDesc ? (
                <Pop
                  trigger="hover"
                  content={disabledPop}
                >
                  <span className="edu-refund-course-help">
                    {disabledDesc}
                    <Icon type="error-circle" />
                  </span>
                </Pop>
              ) : `最多可退${maxRefundValue}课时`}
            />
          );
        },
        visible: courseSellType === 1,
      },
      {
        title: '本次退回天数',
        fixed: 'right',
        width: 140,
        bodyRender: (data, { row }) => {
          const maxValue = calcMaxRefundValue(data);
          let disabled = false;
          let disabledDesc = '';
          let disabledPop = '';
          // assetRefundTagList 里有 refund 这个字段，就是课程失效
          if (data.userAsset &&
            data.userAsset.assetRefundTagList &&
            data.userAsset.assetRefundTagList.find(assetRefundTag => assetRefundTag === 'refund')) {
            disabled = true;
            disabledDesc = '课程已失效';
            disabledPop = '课程退过课，资产失效';
          } else if (!Number(maxValue)) {
            disabled = true;
          }
          return (
            <Field
              name={'refundCourseValue-' + row}
              component={NumberInputField}
              decimal={0}
              disabled={disabled}
              className="edu-refund-course-value edu-refund-course-day"
              asyncValidation={(values, value) => new Promise((resolve, reject) => {
                if (Big(Number(value)).gt(Number(maxValue))) {
                  return reject(`最多可退${maxValue}天`);
                }
                return resolve();
              })}
              addonAfter="天"
              helpDesc={disabledDesc ? (
                <Pop
                  trigger="hover"
                  content={disabledPop}
                >
                  <span className="edu-refund-course-help">
                    {disabledDesc}
                    <Icon type="error-circle" />
                  </span>
                </Pop>
              ) : `最多可退${maxValue}天`}
            />
          );
        },
        visible: (courseSellType === 0 || courseSellType === 2 || courseSellType === 4) && isEffective,
      },
      {
        title: (
          <div className="edu-refund-course-fee-title">本次退回金额</div>
        ),
        fixed: 'right',
        width: 180,
        textAlign: 'right',
        bodyRender: (data, { row }) => {
          const maxRefundFee = calcMaxRefundFee(data, formList[row]);
          const disabled = Number(maxRefundFee) === 0;
          const suggestedFee = disabled ? '' : calcSuggestedFee(data, formList[row]);
          return (
            <Field
              name={'refundFee-' + row}
              component={NumberInputField}
              disabled={disabled}
              className="edu-refund-course-value edu-refund-course-fee"
              asyncValidation={(values, value) => new Promise((resolve, reject) => {
                if (Number(value) > Number(maxRefundFee)) {
                  return reject('最多可退¥' + maxRefundFee);
                }
                return resolve();
              })}
              addonBefore="¥"
              decimal={2}
              placeholder={suggestedFee ? '建议退回' + suggestedFee : ''}
              helpDesc={'最多可退¥' + maxRefundFee}
            />
          );
        },
      },
    ];
    return raw.filter(rawItem => rawItem.visible === undefined ? true : rawItem.visible);
  }, [courseType, courseSellType, formList, isEffective, isMarked]);

  if (courseSellType === undefined) {
    return null;
  }

  return (
    <>
      <Grid
        className="edu-refund-course"
        ref={ref}
        rowKey="assetNo"
        scroll={{ x: scrollX }}
        columns={columns}
        datasets={courseState}
      />
      <div className="edu-refund-course-footer">
        <div className="edu-refund-course-footer-user">
          {sellerName ? (
            <div>课程顾问：{sellerName}</div>
          ) : null}
          {staffName ? (
            <div>经办人：{staffName}</div>
          ) : null}
        </div>
        <div>
          合计退回{courseSellType === 1 ? '课时' : '天数'}：
          <span className="edu-refund-course-footer-number">{totalRefundVal}</span>
          合计退回金额：
          <span className="edu-refund-course-footer-total">{totalValue}</span>
        </div>
      </div>
    </>
  );
}

export default forwardRef(CourseList);

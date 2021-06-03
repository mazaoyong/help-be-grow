import React from 'react';
import { IGridColumn } from 'zent';
import { Form } from '@zent/compat';

import cent2yuan from 'fns/currency/cent2yuan';

import { NumberInputField } from '@ability-center/assets/enrollment';

import { SuggestAdjustAmountField } from '../../components/suggest-adjust-amount';

import { setTotalTransAmount, forceValidForm } from '../../../../util';

const { Field } = Form;

interface IColumn extends IGridColumn {
  visible?: boolean;
}

export default function getColumn({ courseSellType, zentForm, openAdjustRecord }) {
  const raw: IColumn[] = [
    {
      title: '订单号',
      fixed: 'left',
      bodyRender: ({ eduCourseOrder: { orderInfo } }) => {
        return (
          <a
            className="order-no"
            target="_blank"
            rel="noopener noreferrer"
            href={`${window._global.url.v4}/trade/order/detail?orderNo=${orderInfo.orderNo}`}
          >
            {orderInfo.orderNo}
          </a>
        );
      },
    },
    // 课时
    {
      title: '购买课时',
      width: 140,
      bodyRender: ({ eduCourseOrder: { courseTime } }) => {
        return <div className='cell-div less-width'>
          {courseTime.buy ? courseTime.buy + '课时' : '-'}
        </div>;
      },
      visible: courseSellType === 1,
    },
    // 时段/自定义
    {
      title: '课程有效期',
      width: 180,
      bodyRender: ({ eduCourseOrder: { totalQuantity, eduCourseValidDescription } }) => {
        return (
          <div className='cell-div more-width'>
            <div>{eduCourseValidDescription}</div>
            <div>共{totalQuantity}天</div>
          </div>
        );
      },
      visible: courseSellType === 2,
    },
    {
      title: courseSellType === 1 ? '赠送课时' : '赠送天数',
      width: 140,
      bodyRender: ({ eduCourseOrder: { courseTime }, courseSellTypeUnit }) => {
        return <div className='cell-div less-width'>{courseTime && courseTime.reward ? courseTime.reward + courseSellTypeUnit : '-'}</div>;
      },
      visible: true,
    },
    {
      title: '课程实付金额',
      textAlign: 'right',
      width: 140,
      bodyRender: ({ eduCourseOrder: { orderInfo } }) => {
        return <div className='cell-div less-width'>{'¥' + cent2yuan((orderInfo && orderInfo.realPay) || 0)}</div>;
      },
      visible: true,
    },
    // 课时
    {
      title: courseSellType === 1 ? '单课时价格' : '单天价格',
      textAlign: 'right',
      width: 140,
      bodyRender: ({ eduCourseOrder: { courseTime } }) => {
        return (
          <div className='cell-div'>
            {'¥' + courseTime.unitPrice}
          </div>
        );
      },
      visible: true,
    },
    {
      title: (<div>已消课时<span className='split-line'>|</span>金额</div>),
      width: 140,
      textAlign: 'right',
      bodyRender: ({ eduCourseOrder: { courseTime } }) => {
        if (!courseTime.used) {
          return <div className='cell-div'>
            -
          </div>;
        }
        return (
          <div className='cell-div'>
            {courseTime.used}课时|￥{cent2yuan(courseTime.usedAmt)}
          </div>
        );
      },
      visible: courseSellType === 1,
    },
    {
      title: (<div>已退{courseSellType === 1 ? '课时' : '天数'}<span className="split-line">|</span>金额</div>),
      width: 140,
      textAlign: 'right',
      bodyRender: ({ eduCourseOrder: { courseTime, assetNo }, studentTransferOutCourseDTO: { course: { kdtId } },
        courseSellTypeUnit }) => {
        if (!courseTime.returned && !courseTime.returnedAmt) {
          return <div className='cell-div'>-</div>;
        }
        return (
          <div className='cell-div'>
            <div>
              {courseTime.returned + courseSellTypeUnit}
              <span className="split-line">|</span>
              {'¥' + cent2yuan(courseTime.returnedAmt)}
            </div>
            <div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={'/v4/vis/edu/page/refund-record#/list?assetNo=' + assetNo + '&kdtId=' + kdtId}
              >退课记录</a>
            </div>
          </div>
        );
      },
      visible: true,
    },
    {
      title: (<div>已转{courseSellType === 1 ? '课时' : '天数'}<span className="split-line">|</span>金额</div>),
      width: 140,
      textAlign: 'right',
      bodyRender: ({ eduCourseOrder: { courseTime, orderInfo, assetNo }, courseSellTypeUnit }) => {
        if (!courseTime.transfered && !courseTime.transferedAmt) {
          return <div className='cell-div'>-</div>;
        }
        return (
          <div className='cell-div'>
            <div>
              {courseTime.transfered + courseSellTypeUnit}
              <span className="split-line">|</span>
              {'¥' + cent2yuan(courseTime.transferedAmt)}
            </div>
            <div>
              <a onClick={() => openAdjustRecord({ orderNo: orderInfo.orderNo, assetNo })}>转课记录</a>
            </div>
          </div>
        );
      },
      visible: true
    },
    {
      title: courseSellType === 1 ? '转出购买课时' : '转出购买天数',
      // fixed: 'right',
      width: 140,
      bodyRender: ({ studentId, eduCourseOrderDTOList, eduCourseOrder: { courseTime, orderInfo },
        courseSellTypeUnit }) => {
        const { maxAdjustBuy, unitPrice, remainingBuyAmt } = courseTime;
        const values = zentForm.getFormValues();
        if (typeof values[`adjustBuy-${orderInfo.orderNo}`] === 'undefined' && maxAdjustBuy > 0) {
          setTimeout(() => {
            zentForm.setFieldsValue({
              [`adjustBuy-${orderInfo.orderNo}`]: maxAdjustBuy,
              [`adjustAmount-${orderInfo.orderNo}`]: +cent2yuan(remainingBuyAmt),
              [`suggestAdjustAmount-${orderInfo.orderNo}`]: +cent2yuan(remainingBuyAmt)
            });
            setTotalTransAmount(zentForm, eduCourseOrderDTOList, studentId);
          }, 0);
        }
        return (
          <Field
            name={'adjustBuy-' + orderInfo.orderNo}
            component={NumberInputField}
            decimal={courseSellType === 1 ? 2 : 0}
            min={0}
            max={maxAdjustBuy}
            disabled={maxAdjustBuy <= 0}
            className='field-input'
            asyncValidation={(values, value) => new Promise<void>((resolve, reject) => {
              if (Number(value) > Number(maxAdjustBuy)) {
                return reject(`最多可以转出${maxAdjustBuy}${courseSellTypeUnit}`);
              }
              if (Number(value) === 0 && Number(values[`adjustReward-${orderInfo.orderNo}`]) === 0) {
                return reject(`请输入转出${courseSellTypeUnit}${courseSellType === 1 ? '' : '数'}`);
              }
              return resolve();
            })}
            addonAfter={courseSellTypeUnit}
            helpDesc={`本次最多转出${maxAdjustBuy}${courseSellTypeUnit}`}
            onChange={(val) => {
              forceValidForm(zentForm);
              let transferedAmt = +((val * unitPrice).toFixed(2));
              let maxTransferAmt = +cent2yuan(remainingBuyAmt);
              transferedAmt = transferedAmt > maxTransferAmt ? maxTransferAmt : transferedAmt;
              zentForm.setFieldsValue({
                [`suggestAdjustAmount-${orderInfo.orderNo}`]: +transferedAmt,
                [`adjustAmount-${orderInfo.orderNo}`]: +transferedAmt,
                [`adjustBuy-${orderInfo.orderNo}`]: val
              });
              setTotalTransAmount(zentForm, eduCourseOrderDTOList, studentId);
            }}
          />
        );
      },
      visible: true
    },
    {
      title: courseSellType === 1 ? '转出赠送课时' : '转出赠送天数',
      // fixed: 'right',
      width: 140,
      bodyRender: ({ studentId, eduCourseOrderDTOList, eduCourseOrder: { courseTime, orderInfo },
        courseSellTypeUnit }) => {
        const { maxAdjustReward } = courseTime;
        const values = zentForm.getFormValues();
        if (typeof values[`adjustReward-${orderInfo.orderNo}`] === 'undefined' && maxAdjustReward > 0) {
          setTimeout(() => {
            zentForm.setFieldsValue({
              [`adjustReward-${orderInfo.orderNo}`]: maxAdjustReward
            });
          }, 0);
        }
        return (
          <Field
            name={'adjustReward-' + orderInfo.orderNo}
            component={NumberInputField}
            decimal={courseSellType === 1 ? 2 : 0}
            min={0}
            max={maxAdjustReward}
            disabled={maxAdjustReward <= 0}
            className='field-input'
            asyncValidation={(values, value) => new Promise<void>((resolve, reject) => {
              if (Number(value) > Number(maxAdjustReward)) {
                return reject(`最多可以转出${maxAdjustReward}${courseSellTypeUnit}`);
              }
              if (Number(value) === 0 && Number(values[`adjustBuy-${orderInfo.orderNo}`]) === 0) {
                return reject(`请输入转出${courseSellTypeUnit}${courseSellType === 1 ? '' : '数'}`);
              }
              return resolve();
            })}
            addonAfter={courseSellTypeUnit}
            helpDesc={`本次最多转出${maxAdjustReward}${courseSellTypeUnit}`}
            onChange={(val) => {
              zentForm.setFieldsValue({
                [`adjustReward-${orderInfo.orderNo}`]: val
              });
              forceValidForm(zentForm);
              setTimeout(() => {
                const values = zentForm.getFormValues();
                const totalTransReward = eduCourseOrderDTOList.reduce((sum, item) => {
                  return (values[`adjustReward-${item.orderInfo.orderNo}`] || 0) + sum;
                }, 0);
                zentForm.setFieldsValue({
                  [`reward-${studentId}`]: totalTransReward
                });
              }, 0);
            }}
          />
        );
      },
      visible: true,
    },
    {
      title: '转出金额',
      // fixed: 'right',
      width: 140,
      bodyRender: ({ studentId, eduCourseOrderDTOList, eduCourseOrder: { courseTime, orderInfo } }) => {
        const { maxAdjustBuy, remainingBuyAmt } = courseTime;
        if (maxAdjustBuy <= 0 || remainingBuyAmt <= 0) return <div className='cell-div'>-</div>;
        return (
          <>
            <Field
              name={'adjustAmount-' + orderInfo.orderNo}
              component={NumberInputField}
              decimal={2}
              min={0}
              max={remainingBuyAmt / 100}
              className='field-input'
              asyncValidation={(_, value) => new Promise<void>((resolve, reject) => {
                if (Number(value) > remainingBuyAmt / 100) {
                  return reject(`本次最多转出金额￥${cent2yuan(remainingBuyAmt)}`);
                }
                return resolve();
              })}
              addonBefore="￥"
              onChange={() => {
                setTotalTransAmount(zentForm, eduCourseOrderDTOList, studentId);
              }}
            />
            <Field
              name={'suggestAdjustAmount-' + orderInfo.orderNo}
              component={SuggestAdjustAmountField}
              decimal={2}
              className='suggest-adjust-amount'
            />
          </>
        );
      },
      visible: true
    },
  ];
  return raw.filter(rawItem => rawItem.visible === undefined ? true : rawItem.visible);
}

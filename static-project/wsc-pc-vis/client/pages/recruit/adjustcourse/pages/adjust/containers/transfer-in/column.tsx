import React from 'react';
import { IGridColumn } from 'zent';
import { Form } from '@zent/compat';
import { desensitivePhone } from 'fns/text/caculate';
import cent2yuan from 'fns/currency/cent2yuan';

import { UnitPriceField } from '../../components/unit-price';
import { NumberInputField } from '@ability-center/assets/enrollment';

import { setTotalTransAmount, forceValidForm } from '../../../../util';

const { Field } = Form;

interface IColumn extends IGridColumn {
  visible?: boolean;
}

export function getSingleTransColumn({ courseSellType, zentForm, onRemove }) {
  const raw: IColumn[] = [
    {
      title: '课程',
      width: 200,
      bodyRender: ({ transInEduCourse }) => {
        return transInEduCourse.name;
      },
    },
    // 课时
    {
      title: courseSellType === 1 ? '购买课时' : '购买有效期',
      width: 300,
      bodyRender: ({ studentId, courseSellTypeUnit, eduCourseOrder: { orderInfo } }) => {
        const values = zentForm.getFormValues();
        const adjustBuy = values[`adjustBuy-${orderInfo.orderNo}`] || 0;
        if (typeof values[`buy-${studentId}`] === 'undefined') {
          setTimeout(() => {
            const unitPrice = adjustBuy ? (+(values.totalTransInAmount[studentId] || 0) / adjustBuy).toFixed(2) : 0;
            zentForm.setFieldsValue({
              [`buy-${studentId}`]: adjustBuy,
              [`unitPrice-${studentId}`]: unitPrice
            });
          }, 0);
        }
        return (
          <Field
            name={'buy-' + studentId}
            component={NumberInputField}
            decimal={courseSellType === 1 ? 2 : 0}
            min={0}
            className='field-input more-width'
            onChange={(val) => {
              const values = zentForm.getFormValues();
              const { totalTransInAmount } = values;
              zentForm.setFieldsValue({
                [`unitPrice-${studentId}`]: val ? (+(totalTransInAmount[studentId] || 0) / val).toFixed(2) : 0
              });
            }}
            addonAfter={courseSellTypeUnit}
          />
        );
      },
      visible: true,
    },
    {
      title: courseSellType === 1 ? '赠送课时' : '赠送有效期',
      width: 300,
      bodyRender: ({ studentId, courseSellTypeUnit, eduCourseOrder: { orderInfo } }) => {
        const values = zentForm.getFormValues();
        if (typeof values[`reward-${studentId}`] === 'undefined') {
          setTimeout(() => {
            zentForm.setFieldsValue({
              [`reward-${studentId}`]: values[`adjustReward-${orderInfo.orderNo}`]
            });
          }, 0);
        }
        return (
          <Field
            name={'reward-' + studentId}
            component={NumberInputField}
            decimal={courseSellType === 1 ? 2 : 0}
            min={0}
            className='field-input more-width'
            addonAfter={courseSellTypeUnit}
          />
        );
      },
      visible: true,
    },
    {
      title: '小计',
      width: 300,
      bodyRender: ({ studentId, eduCourseOrderDTOList }) => {
        const values = zentForm.getFormValues();
        if (typeof values[`totalTransInAmount-${studentId}`] === 'undefined') {
          setTotalTransAmount(zentForm, eduCourseOrderDTOList, studentId);
        }
        return (
          <Field
            name={`totalTransInAmount-${studentId}`}
            component={NumberInputField}
            decimal={2}
            min={0}
            className='field-input more-width'
            addonBefore='￥'
            asyncValidation={(values, value) => new Promise<void>((resolve, reject) => {
              const totalObj = values['totalTransOutAmount'] || {};
              let minAmount = Object.keys(totalObj).reduce((sum, item) => {
                return sum + (totalObj[item] || 0);
              }, 0);
              if (value < minAmount) {
                return reject('转入金额不能小于转出金额');
              }
              return resolve();
            })}
            onChange={(val) => {
              const values = zentForm.getFormValues();
              const { totalTransInAmount = {} } = values;
              const unitPrice = values[`buy-${studentId}`] ? (+val / values[`buy-${studentId}`]).toFixed(2) : 0;
              zentForm.setFieldsValue({
                totalTransInAmount: {
                  ...totalTransInAmount,
                  [studentId]: +val
                },
                [`unitPrice-${studentId}`]: unitPrice
              });
            }}
          />
        );
      }
    },
    // 课时
    {
      title: courseSellType === 1 ? '单课时价格' : '单天价格',
      width: 100,
      textAlign: 'right',
      bodyRender: ({ studentId }) => {
        return (
          <Field
            name={'unitPrice-' + studentId}
            component={UnitPriceField}
            className='field-input'
          />
        );
      },
      visible: true,
    },
    {
      title: '操作',
      textAlign: 'right',
      width: 120,
      bodyRender: () => {
        return <a onClick={onRemove}>删除</a>;
      },
      visible: true
    },
  ];
  return raw.filter(rawItem => rawItem.visible === undefined ? true : rawItem.visible);
}

export function getMulTransColumn({ zentForm }) {
  const columns: IColumn[] = [
    {
      title: '学员',
      fixed: 'left',
      width: 120,
      bodyRender: ({ studentName, studentMobile, eduCourseOrderDTOList }, { row }) => {
        if (row % eduCourseOrderDTOList.length === 0) {
          return {
            props: {
              rowSpan: eduCourseOrderDTOList.length
            },
            children: <>
              <div>{studentName}</div>
              <div>{desensitivePhone(studentMobile)}</div>
            </>
          };
        }
        return {
          props: {
            rowSpan: 0
          }
        };
      },
    },
    {
      title: '订单号',
      width: 140,
      bodyRender: ({ eduCourseOrder: { orderInfo } }) => {
        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={'//www.youzan.com/v4/trade/order/detail?orderNo=' + orderInfo.orderNo}
          >
            {orderInfo.orderNo}
          </a>
        );
      },
    },
    {
      title: '剩余购买资产/金额',
      width: 140,
      bodyRender: ({ eduCourseOrder: { courseTime }, courseSellTypeUnit }) => {
        return (
          <div className='cell-div'>
            {courseTime.remainingBuy}{courseSellTypeUnit}/￥{cent2yuan(courseTime.remainingBuyAmt)}
          </div>
        );
      }
    },
    {
      title: '剩余赠送资产',
      width: 140,
      bodyRender: ({ eduCourseOrder: { courseTime }, courseSellTypeUnit }) => {
        return <div className='cell-div'>
          {courseTime.remainingReward}{courseSellTypeUnit}
        </div>;
      }
    },
    {
      title: '转出购买资产',
      width: 140,
      bodyRender: ({ studentId, eduCourseOrderDTOList, eduCourseOrder: { courseTime, orderInfo },
        courseSellTypeUnit, courseSellType }) => {
        const { maxAdjustBuy, unitPrice, remainingBuyAmt } = courseTime;
        const values = zentForm.getFormValues();
        if (typeof values[`adjustBuy-${orderInfo.orderNo}`] === 'undefined' && maxAdjustBuy > 0) {
          setTimeout(() => {
            zentForm.setFieldsValue({
              [`adjustBuy-${orderInfo.orderNo}`]: maxAdjustBuy,
              [`adjustAmount-${orderInfo.orderNo}`]: +cent2yuan(remainingBuyAmt),
              [`buyAmount-${orderInfo.orderNo}`]: +cent2yuan(remainingBuyAmt)
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
              const transferedAmt = (Number(val) * unitPrice).toFixed(2);
              zentForm.setFieldsValue({
                [`adjustAmount-${orderInfo.orderNo}`]: +transferedAmt,
                [`buyAmount-${orderInfo.orderNo}`]: +transferedAmt
              });
              setTotalTransAmount(zentForm, eduCourseOrderDTOList, studentId);
            }}
          />
        );
      }
    },
    {
      title: '转出赠送资产',
      width: 140,
      bodyRender: ({ studentId, eduCourseOrderDTOList, eduCourseOrder: { courseTime, orderInfo },
        courseSellTypeUnit, courseSellType }) => {
        const { maxAdjustReward } = courseTime;
        const values = zentForm.getFormValues();
        if (typeof values[`adjustReward-${orderInfo.orderNo}`] === 'undefined' && maxAdjustReward > 0) {
          setTimeout(() => {
            const totalMaxAdjustReward = eduCourseOrderDTOList.reduce((sum, item) => {
              return item.courseTime.maxAdjustReward + sum;
            }, 0);
            zentForm.setFieldsValue({
              [`adjustReward-${orderInfo.orderNo}`]: maxAdjustReward,
              [`reward-${studentId}`]: totalMaxAdjustReward
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
            onChange={() => {
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
      }
    },
    {
      title: '转出金额',
      textAlign: 'right',
      width: 120,
      bodyRender: ({ studentId, eduCourseOrderDTOList, eduCourseOrder: { courseTime, orderInfo } }) => {
        const { remainingBuyAmt } = courseTime;
        // 批量转课，转入金额等于转出金额，但为了和单个转课逻辑处理保持一致，增加adjustAmount字段，页面上不展示
        return (
          <>
            <Field
              name={'adjustAmount-' + orderInfo.orderNo}
              component={NumberInputField}
              decimal={2}
              readOnly={true}
              className='field-input margin-btm hidden-field'
              addonBefore="￥"
            />
            <Field
              name={'buyAmount-' + orderInfo.orderNo}
              component={NumberInputField}
              decimal={2}
              max={remainingBuyAmt / 100}
              className='field-input margin-btm'
              asyncValidation={(_, value) => new Promise<void>((resolve, reject) => {
                if (Number(value) > remainingBuyAmt / 100) {
                  return reject(`本次最多转出金额￥${cent2yuan(remainingBuyAmt)}`);
                }
                return resolve();
              })}
              onChange={(_, value) => {
                zentForm.setFieldsValue({
                  [`adjustAmount-${orderInfo.orderNo}`]: value
                });
                setTotalTransAmount(zentForm, eduCourseOrderDTOList, studentId, false);
              }}
              addonBefore="￥"
            />
          </>
        );
      }
    },
    // 课时
    {
      title: '转入购买资产',
      width: 120,
      bodyRender: ({ studentId, eduCourseOrderDTOList, courseSellType, courseSellTypeUnit }, { row }) => {
        if (row % eduCourseOrderDTOList.length === 0) {
          return {
            props: {
              rowSpan: eduCourseOrderDTOList.length
            },
            children: (
              <Field
                name={'buy-' + studentId}
                component={NumberInputField}
                decimal={courseSellType === 1 ? 2 : 0}
                className='field-input margin-btm'
                onChange={(val) => {
                  const values = zentForm.getFormValues();
                  const totalBuyAmount = eduCourseOrderDTOList.reduce((sum, item) => {
                    return sum + (values[`buyAmount-${item.orderInfo.orderNo}`]);
                  }, 0);
                  zentForm.setFieldsValue({
                    [`unitPrice-${studentId}`]: (totalBuyAmount / (+val)).toFixed(2)
                  });
                }}
                addonAfter={courseSellTypeUnit}
              />
            )
          };
        }
        return {
          props: {
            rowSpan: 0
          }
        };
      }
    },
    {
      title: '转入赠送资产',
      width: 160,
      bodyRender: ({ studentId, eduCourseOrderDTOList, courseSellType, courseSellTypeUnit }, { row }) => {
        if (row % eduCourseOrderDTOList.length === 0) {
          return {
            props: {
              rowSpan: eduCourseOrderDTOList.length
            },
            children: (
              <Field
                name={'reward-' + studentId}
                component={NumberInputField}
                decimal={courseSellType === 1 ? 2 : 0}
                className='field-input margin-btm'
                asyncValidation={() => new Promise<void>((resolve) => {
                  return resolve();
                })}
                addonAfter={courseSellTypeUnit}
              />
            )
          };
        }
        return {
          props: {
            rowSpan: 0
          }
        };
      }
    },
    {
      title: '资产单价',
      textAlign: 'right',
      width: 120,
      bodyRender: ({ studentId, eduCourseOrderDTOList }, { row }) => {
        if (row % eduCourseOrderDTOList.length === 0) {
          return {
            props: {
              rowSpan: eduCourseOrderDTOList.length
            },
            children: (
              <Field
                name={'unitPrice-' + studentId}
                component={UnitPriceField}
                className='field-input'
              />
            )
          };
        }
        return {
          props: {
            rowSpan: 0
          }
        };
      }
    }
  ];
  return columns;
}

import React, { useState, useCallback, useContext, useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { hashHistory } from 'react-router';
import { FullScreenLoading, Notify } from 'zent';
import { Form } from '@zent/compat';

import openUnlockDialog from '@ability-center/common/unlock-lesson-dialog';

import { BlockHeader, openPaymentSelect } from '@ability-center/assets/enrollment';
import ButtonGroup from './components/button-group';

import OtherInfo from './containers/other-info';
import StudentInfo from './containers/student-info';
import TransferOut from './containers/transfer-out';
import TransferIn from './containers/transfer-in';
import { Context as CourseOrderContext, INIT_STUDENT_IDS, INIT_ASSETNOS, UPDATE_DATA_LIST } from './contexts/course-order';

import { initQueryParams, forceValidForm, multi100AndFloor } from '../../util';

import { transferCourse } from '../../api';

import './styles.scss';

const { createForm, FormInputField } = Form;

const prefixcls = 'edu-adjustcourse';

const queryParams = initQueryParams();

const UnlockLessonTip = ({ name, mobile, transOut, locked }) => {
  return (
    <div className={`${prefixcls}-unlock-dialog-tips`}>
      学员：{name} {mobile} 转出课时：{transOut} 冻结课时：{locked}
    </div>
  );
};

function App({ handleSubmit, zentForm, ...props }, ref) {
  const [loading, setLoading] = useState(false);
  const { state: { list: dataList, studentIds, assetNos, transInCourseId }, dispatch } = useContext(CourseOrderContext);
  const kdtId = queryParams.kdtId || _global.kdtId;

  const getAmountStatistic = useCallback(() => {
    let transOutObj = zentForm.getFormValues()['totalTransOutAmount'] || {};
    let transInObj = zentForm.getFormValues()['totalTransInAmount'] || {};
    let totalTransOut = Object.keys(transOutObj).reduce((sum, item) => {
      return sum + transOutObj[item];
    }, 0);
    let totalTransIn = Object.keys(transInObj).reduce((sum, item) => {
      return sum + transInObj[item];
    }, 0);
    let totalArr = (totalTransIn - totalTransOut).toFixed(2).split('.');
    return {
      integer: totalArr[0],
      decimal: totalArr[1]
    };
  }, []);
  const amountStatistic = getAmountStatistic();

  useEffect(() => {
    dispatch({
      type: INIT_STUDENT_IDS,
      payload: {
        studentIds: queryParams.studentIds
      }
    });
    dispatch({
      type: INIT_ASSETNOS,
      payload: {
        assetNos: queryParams.assetNos
      }
    });
    window.onbeforeunload = () => {
      return '离开页面';
    };
  }, []);

  const onSubmit = useCallback((values) => {
    if (studentIds.length === 0) {
      Notify.error('请选择学员');
      return;
    }
    if (assetNos.length === 0) {
      Notify.error('请选择转出课程');
      return;
    }
    if (!transInCourseId) {
      Notify.error('请选择转入课程');
      return;
    }
    // zent form 的bug,提交的时候再走一遍校验
    forceValidForm(zentForm, (result) => {
      submitRequest(values);
    });
  }, [studentIds, assetNos, transInCourseId]);

  const submitRequest = useCallback((values) => {
    const { classId = '', seller, teacher, operateDate, comment, totalTransOutAmount = {}, totalTransInAmount = {}, beginTime, endTime, cashierName } = values;
    let studentTransferCourseObj = {};
    let needUnlockList = [];
    const amountStatistic = getAmountStatistic();
    const receivableAmt = multi100AndFloor(Number(`${amountStatistic.integer}.${amountStatistic.decimal}`));
    dataList.map(item => {
      if (studentTransferCourseObj[item.studentId]) return;
      let transferOutBuyAssert = 0;
      let transferOutReward = 0;
      const courseSellType = item.studentTransferOutCourseDTO.course.courseSellType;
      const transferOutOrderDTO = item.eduCourseOrderDTOList.map(orderItem => {
        if (courseSellType === 1 &&
          (Number(values[`adjustBuy-${orderItem.orderInfo.orderNo}`] || 0) > orderItem.courseTime.remainingBuy ||
          Number(values[`adjustReward-${orderItem.orderInfo.orderNo}`] || 0) > orderItem.courseTime.remainingReward)) {
          needUnlockList.push({
            assetNo: orderItem.assetNo,
            tip: (
              <UnlockLessonTip
                name={item.studentName}
                mobile={item.studentMobile}
                transOut={Number(values[`adjustBuy-${orderItem.orderInfo.orderNo}`] || 0) + Number(values[`adjustReward-${orderItem.orderInfo.orderNo}`] || 0)}
                locked={orderItem.courseTime.lockedReward + orderItem.courseTime.lockedBuy}
              />
            )
          });
        }
        transferOutBuyAssert += courseSellType === 1 ? multi100AndFloor(Number(values[`adjustBuy-${orderItem.orderInfo.orderNo}`] || 0))
          : Number(values[`adjustBuy-${orderItem.orderInfo.orderNo}`] || 0);
        transferOutReward += courseSellType === 1 ? multi100AndFloor(Number(values[`adjustReward-${orderItem.orderInfo.orderNo}`] || 0))
          : Number(values[`adjustReward-${orderItem.orderInfo.orderNo}`] || 0);
        return {
          assetNo: orderItem.assetNo,
          orderNo: orderItem.orderInfo.orderNo,
          orderTransferOutBuyAssert: courseSellType === 1 ? multi100AndFloor(Number(values[`adjustBuy-${orderItem.orderInfo.orderNo}`] || 0))
            : Number(values[`adjustBuy-${orderItem.orderInfo.orderNo}`] || 0),
          orderTransferOutReward: courseSellType === 1 ? multi100AndFloor(Number(values[`adjustReward-${orderItem.orderInfo.orderNo}`] || 0))
            : Number(values[`adjustReward-${orderItem.orderInfo.orderNo}`] || 0)
        };
      });

      studentTransferCourseObj[item.studentId] = {
        assetNo: item.assetNo,
        studentTransferDTO: {
          studentId: item.studentId,
          mobile: item.studentMobile,
          studentName: item.studentName
        },
        transferInCourseDTO: {
          buyAssert: courseSellType === 1 ? multi100AndFloor(Number(values[`buy-${item.studentId}`] || 0)) : Number(values[`buy-${item.studentId}`] || 0),
          eduCourseId: item.transInEduCourse.id,
          eduCourseName: item.transInEduCourse.name,
          reward: courseSellType === 1 ? multi100AndFloor(Number(values[`reward-${item.studentId}`] || 0)) : Number(values[`reward-${item.studentId}`] || 0),
          unitPrice: multi100AndFloor(Number(values[`unitPrice-${item.studentId}`] || 0)),
          receivableAmt,
          transferInAmt: multi100AndFloor((totalTransInAmount[item.studentId] || 0))
        },
        transferOutCourseDTO: {
          eduCourseId: item.studentTransferOutCourseDTO.eduCourse.id,
          courseSellType: item.studentTransferOutCourseDTO.course.courseSellType,
          eduCourseName: item.studentTransferOutCourseDTO.eduCourse.name,
          transferOutBuyAssert,
          transferOutAmt: multi100AndFloor((totalTransOutAmount[item.studentId] || 0)),
          transferOutReward,
          transferOutOrderDTO
        }
      };
    });
    if (needUnlockList.length > 0) {
      openUnlockDialog({
        title: '转课提示',
        list: needUnlockList,
        kdtId: kdtId,
        successCbk: (selectedRowData) => {
          selectedRowData.map(item => {
            let studentItem = dataList.find(studentItem => item.assetNo === studentItem.assetNo);
            studentItem.eduCourseOrderDTOList.map(orderItem => {
              if (Number(values[`adjustBuy-${orderItem.orderInfo.orderNo}`] || 0) > orderItem.courseTime.remainingBuy &&
                item.lockedNum > 0) {
                const remainUnLockNum = item.lockedNum - (orderItem.courseTime.lockedBuy * 100);
                if (remainUnLockNum >= 0) {
                  orderItem.courseTime.remainingBuy += orderItem.courseTime.lockedBuy;
                  orderItem.courseTime.lockedBuy = 0;
                  item.lockedNum = remainUnLockNum;
                } else {
                  orderItem.courseTime.remainingBuy += (item.lockedNum / 100);
                  orderItem.courseTime.lockedBuy -= (item.lockedNum / 100);
                  item.lockedNum = 0;
                }
              }
              if (Number(values[`adjustReward-${orderItem.orderInfo.orderNo}`] || 0) > orderItem.courseTime.remainingReward &&
                item.lockedNum > 0) {
                const remainUnLockNum = item.lockedNum - (orderItem.courseTime.lockedReward * 100);
                if (remainUnLockNum >= 0) {
                  orderItem.courseTime.remainingReward += orderItem.courseTime.lockedReward;
                  orderItem.courseTime.lockedReward = 0;
                  item.lockedNum = remainUnLockNum;
                } else {
                  orderItem.courseTime.remainingReward += (item.lockedNum / 100);
                  orderItem.courseTime.lockedReward -= (item.lockedNum / 100);
                  item.lockedNum = 0;
                }
              }
            });
          });
          dispatch({
            type: UPDATE_DATA_LIST,
            payload: {
              list: dataList
            }
          });
        }
      });
    } else {
      const data = {
        classId: +classId || null,
        kdtId: +kdtId,
        validStartTime: beginTime || null,
        validEndTime: endTime || null,
        otherDTO: {
          courseConsultantId: seller ? seller.sellerId : null,
          cashierId: window._global.userId,
          teacherId: teacher ? teacher.sellerId : null,
          operateDate,
          remark: comment,
          teacherName: teacher ? teacher.sellerName : '',
          cashierName,
          courseConsultantName: seller ? seller.sellerName : ''
        },
        studentTransferCourseList: Object.keys(studentTransferCourseObj).map(item => studentTransferCourseObj[item])
      };
      setLoading(true);
      transferCourse(data).then(({ orderList = [] }) => {
        window.onbeforeunload = () => {};
        const { price, payUrl, prepayId, orderId, orderNo } = orderList[0] || {};
        if (price) {
          // 防止中间价格被篡改
          if (price !== receivableAmt) {
            Notify.error('该转课订单存在风险，转课失败');
          } else {
            openPaymentSelect({ price,
              orderId,
              orderNo,
              payUrl,
              prepayId,
              onSuccess: () => {
                hashHistory.replace(`/certificate/${orderNo}/${_global.kdtId}`);
              } });
          }
        } else {
          Notify.success('转课成功');
          queryParams.studentIds.length > 1
            ? hashHistory.replace(`/success/${queryParams.eduClassId}/${queryParams.eduCourseId}/${kdtId}`)
            : hashHistory.replace(`/certificate/${orderNo}/${_global.kdtId}`);
        }
      }).catch((msg) => {
        Notify.error(msg || '转课失败');
      })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dataList]);
  return (
    <Form horizontal className={prefixcls} onSubmit={handleSubmit(onSubmit)} ref={ref}>
      {((queryParams.pageFrom === 'student' && queryParams.studentIds.length === 1) || (queryParams.pageFrom === 'menu')) &&
        <>
          <BlockHeader>学员信息</BlockHeader>
          <StudentInfo zentForm={zentForm} prefixcls={prefixcls} canAdd={queryParams.pageFrom === 'menu'} />
        </>
      }
      <BlockHeader>转出课程</BlockHeader>
      <TransferOut zentForm={zentForm} prefixcls={prefixcls}
        isSingleTrans={queryParams.studentIds.length === 1 || queryParams.pageFrom === 'menu'}
        canChoose={queryParams.pageFrom === 'menu'}
        kdtId={kdtId}
      />
      <BlockHeader>转入课程</BlockHeader>
      <TransferIn zentForm={zentForm} prefixcls={prefixcls} kdtId={kdtId} />
      <BlockHeader>其他信息</BlockHeader>
      <OtherInfo prefixcls={prefixcls} />
      <ButtonGroup prefixcls={prefixcls} amount={amountStatistic} />
      <FullScreenLoading loading={loading} iconSize={64} iconText="加载中" />
      {/* 增加转入转出统计的字段，页面不展示，为了在form中计算和保存 */}
      <FormInputField name='totalTransOutAmount' className='hidden-field' label='' type='hidden' />
      <FormInputField name='totalTransInAmount' className='hidden-field' label='' type='hidden' />
    </Form>
  );
}

export default hot(module)(createForm()(React.forwardRef(App)));

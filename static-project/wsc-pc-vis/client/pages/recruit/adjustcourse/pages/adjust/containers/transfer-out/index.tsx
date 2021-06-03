import { Pop } from '@zent/compat';
import React, { useEffect, useMemo, useCallback, useContext, useState } from 'react';
import { Grid, Button, FullScreenLoading, Notify } from 'zent';
import get from 'lodash/get';
import { Context as CourseOrderContext, INIT_TRANSOUT_LIST, INIT_COURSE_SELL_TYPE, INIT_ASSETNOS, CHANGE_TRANSIN_COURSE } from '../../contexts/course-order';
import AmountDisplay from '../../components/amount-display';
import AdjustRecord from '../../components/adjust-record';
import useSelectCardlist from '../../components/student-select';
import { getTransferOutCourseDetail } from '../../../../api';
import getColumn from './column';
import { div100 } from '../../../../util';

interface CourseOrderDetail {
  studentTransferOutCourseDTO: {
    course: {
      courseSellType: number;
      title: string;
    };
    eduCourse: {
      name: string;
    };
  };
  assetNo: string;
}

interface IProps {
  prefixcls: string;
  zentForm: any;
  isSingleTrans: boolean;
  kdtId: number;
  canChoose: boolean;
}

const TransferOut: React.FC<IProps> = ({ prefixcls, zentForm, isSingleTrans, kdtId, canChoose }) => {
  const [loading, setLoading] = useState(false);
  const { state: { list: dataList, courseSellType, studentIds, assetNos }, dispatch: courseOrderDispatch } =
    useContext(CourseOrderContext);

  useEffect(() => {
    if (studentIds.length === 0 || assetNos.length === 0) return;
    let studentAssetList = studentIds.map((item, index) => {
      return {
        assetNo: assetNos[index],
        studentId: item
      };
    });
    setLoading(true);
    getTransferOutCourseDetail({ studentAssetList, kdtId }).then((data = []) => {
      let dataList: CourseOrderDetail[] = [];
      let studentIdList: number[] = [];
      let courseSellTypeArr: number[] = [];
      data.map(item => {
        const courseSellType: number = get(item, 'studentTransferOutCourseDTO.course.courseSellType', 1);
        if (!courseSellTypeArr.includes(courseSellType)) {
          courseSellTypeArr.push(courseSellType);
        }
        studentIdList.push(item.studentId);
        item.eduCourseOrderDTOList.map((orderItem) => {
          const { courseTime, orderInfo } = orderItem;
          if (courseSellType === 1) {
            courseTime.reward = div100(courseTime.reward);
            courseTime.buy = div100(courseTime.buy);
            courseTime.lockedBuy = div100(courseTime.lockedBuy);
            courseTime.lockedReward = div100(courseTime.lockedReward);
            courseTime.remainingBuy = div100(courseTime.remainingBuy);
            courseTime.remainingReward = div100(courseTime.remainingReward);
            courseTime.returned = div100(courseTime.returned);
            courseTime.transfered = div100(courseTime.transfered);
            courseTime.used = div100(courseTime.used);
          }
          courseTime.unitPrice = div100(get(orderItem, 'courseTime.unitPrice', 0));
          const { remainingBuy, lockedBuy, remainingReward, lockedReward } = courseTime;
          const maxAdjustBuy = remainingBuy + lockedBuy;
          const maxAdjustReward = remainingReward + lockedReward;
          courseTime.maxAdjustBuy = maxAdjustBuy;
          courseTime.maxAdjustReward = maxAdjustReward;
          dataList.push({
            ...item,
            id: orderInfo.orderNo,
            eduCourseOrder: orderItem,
            courseSellType: get(item, 'studentTransferOutCourseDTO.course.courseSellType', 1),
            courseSellTypeUnit: get(item, 'studentTransferOutCourseDTO.course.courseSellType', 1) === 1 ? '课时' : '天'
          });
        });
      });
      courseOrderDispatch({
        type: INIT_TRANSOUT_LIST,
        payload: {
          list: dataList,
          studentIdList
        }
      });
      courseOrderDispatch({
        type: INIT_COURSE_SELL_TYPE,
        payload: {
          courseSellType: courseSellTypeArr
        }
      });
    }).catch(msg => {
      Notify.error(msg || '网络错误');
    }).finally(() => {
      setLoading(false);
    });
  }, [studentIds, assetNos]);
  const openAdjustRecord = useCallback(({ orderNo, assetNo }) => {
    AdjustRecord({
      assetNo,
      orderNo,
      targetKdtId: _global.kdtId
    });
  }, []);
  const columns = useMemo(() => {
    // 只有单个学员转课才需要展示转出课程表格，所以courseSellType 取第一个
    return getColumn({ courseSellType: courseSellType[0], zentForm, openAdjustRecord });
  }, [courseSellType, openAdjustRecord]);

  const getTotalTransAmt = useCallback(() => {
    let totalObj = zentForm.getFormValues()['totalTransOutAmount'] || {};
    let totalAmount = Object.keys(totalObj).reduce((sum, item) => {
      return sum + (totalObj[item] || 0);
    }, 0);
    let totalArr = totalAmount.toFixed(2).split('.');
    return {
      integer: totalArr[0],
      decimal: totalArr[1]
    };
  }, []);

  const totalTransAmt = getTotalTransAmt();

  const onSwitchOutDialogConfirm = (item: any) => {
    const { eduCourseStudentDTO } = item;
    if (!eduCourseStudentDTO.transferCourse) {
      Notify.warn('该课程暂不支持转出');
      return;
    }
    courseOrderDispatch({
      type: INIT_ASSETNOS,
      payload: {
        assetNos: [item.eduCourseStudentDTO.assetNo]
      }
    });
    courseOrderDispatch({
      type: CHANGE_TRANSIN_COURSE,
      payload: {
        transInCourseId: ''
      }
    });
    zentForm.setFieldsValue({
      classId: ''
    });
  };

  const openSwitchDialog = useSelectCardlist({
    studentInfo: {
      kdtId,
      studentId: studentIds[0],
    },
    onConfirm: onSwitchOutDialogConfirm,
  });

  return (
    <div className={`${prefixcls}-trans`}>
      <div className={`${prefixcls}-trans-add`}>
        {studentIds.length === 0
          ? <Pop trigger='hover' position="bottom-center" content="请先添加学员">
            <Button onClick={() => openSwitchDialog()} disabled={true}>
              选择转出课程
            </Button>
          </Pop>
          : <Button onClick={() => openSwitchDialog()} disabled={!canChoose}>
            选择转出课程
          </Button>
        }
      </div>
      {dataList[0] &&
        <div className={`${prefixcls}-trans-info`}>
          {isSingleTrans &&
            <div className='info-item'>
              <label>线下课：</label>{dataList[0].studentTransferOutCourseDTO.course.title}
            </div>
          }
          <div className='info-item'>
            <label>课程：</label>{dataList[0].studentTransferOutCourseDTO.eduCourse.name}
          </div>
          {isSingleTrans &&
            <div className='info-item'>
              <label>有效期：</label>{dataList[0].eduCourseOrderDTOList[0]?.eduCourseValidDescription}
            </div>
          }
        </div>
      }
      {isSingleTrans && dataList[0] &&
        <Grid
          className={`${prefixcls}-trans-table`}
          rowKey="id"
          columns={columns}
          datasets={dataList}
          scroll={{ x: 1500 }}
        />
      }
      {isSingleTrans && dataList[0] &&
        <AmountDisplay prefixcls={prefixcls} amount={totalTransAmt} label='转出学费' />
      }
      <FullScreenLoading loading={loading} iconSize={64} iconText="加载中" />
    </div>
  );
};

export default TransferOut;

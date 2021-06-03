import { Pop, Form } from '@zent/compat';
import React, { useContext, useEffect, useMemo, useCallback } from 'react';
import { Button, Grid, Notify } from 'zent';
import useEduCourseDetail from '@ability-center/common/use-edu-course-detail';
import useEduCourseClass from '@ability-center/common/use-edu-course-class';
import { ValuntaryAsyncSelect } from 'components/valuntary-async-select/ValuntaryAsyncSelect';

import { Context as CourseOrderContext, INIT_TRANSIN_LIST, CHANGE_TRANSIN_COURSE } from '../../contexts/course-order';
import AmountDisplay from '../../components/amount-display';

import { getSingleTransColumn, getMulTransColumn } from './column';
import { forceValidForm } from '../../../../util';
import useEducourseSelect from '@ability-center/edu-course/educourse-selector';

const { FormDatePickerField, Field, getControlGroup } = Form;
const AsyncSelectField = getControlGroup(ValuntaryAsyncSelect);

interface IProps {
  prefixcls: string;
  kdtId: number;
  zentForm: any;
}

interface CourseClassItem {
  eduClassName: string;
  id: string;
}

const TransferIn: React.FC<IProps> = ({ prefixcls, zentForm, kdtId }) => {
  const { state: { list: courseOrderList, courseSellType, studentIds, transInCourseId },
    dispatch: courseOrderDispatch } = useContext(CourseOrderContext);
  const [eduCourseDetail] = useEduCourseDetail({ id: transInCourseId });
  const { list: courseClassList }: { list: CourseClassItem[] } = useEduCourseClass({ id: transInCourseId });

  const isSingleTrans = studentIds.length === 1;

  useEffect(() => {
    if (eduCourseDetail.id && courseOrderList.length > 0) {
      courseOrderDispatch({
        type: INIT_TRANSIN_LIST,
        payload: {
          eduCourse: eduCourseDetail
        }
      });
    }
  }, [eduCourseDetail, courseOrderList.length]);

  const getClassOptions = useCallback(() => {
    return new Promise((resolve) => {
      return resolve(courseClassList);
    }).then((list) => {
      return (list as CourseClassItem[]).map(item => {
        return {
          text: item.eduClassName,
          value: item.id
        };
      });
    });
  }, [courseClassList]);
  const onRemove = useCallback(() => {
    courseOrderDispatch({
      type: CHANGE_TRANSIN_COURSE,
      payload: {
        transInCourseId: ''
      }
    });
    zentForm.setFieldsValue({
      totalTransInAmount: {}
    });
  }, []);
  const columns = useMemo(() => {
    return isSingleTrans ? getSingleTransColumn({ courseSellType: courseSellType[0], zentForm, onRemove })
      : getMulTransColumn({ zentForm });
  }, [courseSellType, isSingleTrans]);
  const getTotalTransAmt = useCallback(() => {
    const totalObj = zentForm.getFormValues().totalTransInAmount || {};
    let total = Object.keys(totalObj).reduce((sum, item) => {
      return sum + (totalObj[item] || 0);
    }, 0);
    let totalArr = total.toFixed(2).split('.');
    return {
      integer: totalArr[0],
      decimal: totalArr[1]
    };
  }, []);
  const totalTransAmt = getTotalTransAmt();

  const onSwitchinCourseSelect = useCallback((data) => {
    if (courseOrderList[0] && courseOrderList[0].studentTransferOutCourseDTO &&
        data.id === courseOrderList[0].studentTransferOutCourseDTO.eduCourse.id) {
      Notify.error('转入的课程与转出课程一样，请选择其他课程');
      return;
    }
    courseOrderDispatch({
      type: CHANGE_TRANSIN_COURSE,
      payload: {
        transInCourseId: data.id
      }
    });
    zentForm.setFieldsValue({
      classId: ''
    });
  }, [courseOrderList]);

  const getDiesableDate = time => {
    const currentTime = time.getTime();
    const values = zentForm.getFormValues();
    const defaultTime = values.beginTime;

    const beforeNow = currentTime < defaultTime;
    return beforeNow;
  };

  const openSwitchInDialog = useEducourseSelect({
    kdtId,
    onConfirm: onSwitchinCourseSelect,
  });
  const hasCourseSellType2 = courseSellType.includes(2);
  const hasCourseSellType1 = courseSellType.includes(1);
  return (
    <div className={`${prefixcls}-trans`}>
      <div className={`${prefixcls}-trans-add`}>
        {(studentIds.length === 0 || courseOrderList.length === 0)
          ? <Pop trigger='hover' position="bottom-center" content={studentIds.length === 0 ? '请先添加学员' : '请先选择转出课程'}>
            <Button onClick={() => openSwitchInDialog() } disabled={true}>
              选择转入课程
            </Button>
          </Pop>
          : <Button onClick={() => openSwitchInDialog() }>
            选择转入课程
          </Button>
        }
      </div>
      {!!transInCourseId && !isSingleTrans &&
        <div className={`${prefixcls}-trans-info`}>
          <div className='info-item'>
            <label>课程：</label>{eduCourseDetail.name}
          </div>
        </div>
      }
      {courseOrderList[0] && courseOrderList[0].transInEduCourse && !!transInCourseId &&
        <Grid
          className={`${prefixcls}-trans-table`}
          rowKey="assetNo"
          columns={columns}
          datasets={isSingleTrans ? [courseOrderList[0]] : courseOrderList}
        />
      }
      {isSingleTrans && !!transInCourseId &&
        <AmountDisplay prefixcls={prefixcls} amount={totalTransAmt} label='转入学费' />
      }
      {!!transInCourseId && (
        <div className={`${prefixcls}-trans-other`}>
          <FormDatePickerField
            name="beginTime"
            label="有效期开始日期："
            placeholder="请选择日期"
            autoComplete="off"
            valueType="number"
            helpDesc=""
            required={hasCourseSellType2}
            className='inline-field'
            width="180px"
            asyncValidation={(_, value) => {
              if (hasCourseSellType2) {
                if (!value) {
                  return Promise.reject('请选择开始日期');
                }
              }
              return Promise.resolve();
            }}
            onChange={(val) => {
              if (!val && hasCourseSellType1) {
                forceValidForm(zentForm);
              }
            }}
          />
          {hasCourseSellType1 &&
            <FormDatePickerField
              name="endTime"
              label="有效期结束日期："
              placeholder="请选择日期"
              autoComplete="off"
              valueType="number"
              helpDesc=""
              defaultTime="23:59:59"
              required={false}
              disabledDate={getDiesableDate}
              className='inline-field'
              asyncValidation={(values, value) => {
                let dateNow = new Date();
                let year = dateNow.getFullYear();
                let month = dateNow.getMonth() + 1;
                let day = dateNow.getDate();
                let lastTime = new Date(`${year}/${month}/${day} 23:59:59`).getTime();
                if (values.beginTime && !value) {
                  return Promise.reject('请选择结束日期');
                }
                if (value && lastTime > value) {
                  return Promise.reject('结束时间不能小于今天');
                }
                if (value && values.beginTime > value) {
                  return Promise.reject('结束日期必须大于开始日期');
                }
                return Promise.resolve();
              }}
              width="180px"
            />
          }
          <Field
            className='inline-field'
            name="classId"
            label="分入班级："
            component={AsyncSelectField}
            fetchOnLoad={false}
            width="180px"
            getOptions={getClassOptions}
            placeholder='请选择班级'
            create={false}
            refresh={false}
          />
        </div>
      )}
    </div>
  );
};

export default TransferIn;

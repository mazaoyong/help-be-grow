
import { Form } from '@zent/compat';
import React, { useCallback, useEffect, useContext, useState, useRef, useMemo } from 'react';
import { Notify } from 'zent';
import { format } from 'date-fns';

import { openShopRechargeDialog } from 'components/refund-dialog';

import BlockHeader from '../enrollment/components/block-header';
import ButtonGroup from './components/button-group';
import { openConfirmDialog, closeConfirmDialog } from './components/confirm-dialog';
import Warning from './components/warning';
import CourseList from './containers/course-list';
import OtherInfo from './containers/other-info';
import PresentList from './containers/present-list';

import { Context as CourseContext, CHANGE_COURSES } from './contexts/course';

import { getPreRefundFromOrder, getPreRefundFromUser, refund, getStaff, queryAssetRefundPhasePriceInfo } from './api';
import { parseParams, calcMaxRefundValue, formatList } from './util';
import './styles.scss';

const { createForm } = Form;

const current = format(new Date(), 'YYYY-MM-DD HH:mm:ss');

const urlParams = parseParams();

function CourseHeader() {
  const {
    state: courses,
  } = useContext(CourseContext);
  const title = courses[0] && courses[0].course && courses[0].course.title;
  return (
    <div className="edu-refund-course-header">
      <div>课程名称：{title}</div>
      <div>退课时间：{current}</div>
    </div>
  );
}

function App({ zentForm, handleSubmit }, ref) {
  const {
    state: courseState,
    dispatch: courseDispatch,
  } = useContext(CourseContext);

  const curRefundFee = useRef(0);

  const [staffName, setStaffName] = useState('');

  const [refundFeeTypeList, setRefundFeeTypeList] = useState([]);

  const formList = formatList(courseState.map(({ userAsset }) => ({
    courseSellType: userAsset && userAsset.courseSellType,
  })), zentForm.getFormValues());

  // 获取经办人员工姓名
  useEffect(() => {
    getStaff({ adminId: window._global.userId }).then(data => {
      setStaffName(data.name || '');
    });
  }, []);

  // 获取退款渠道分摊金额
  useEffect(() => {
    // 退款中的金额
    const refundFee = (formList[0] && formList[0].refundFee) || 0;

    if (curRefundFee.current === refundFee) {
      return;
    }

    curRefundFee.current = refundFee;

    if (!urlParams.orderNo) {
      setRefundFeeTypeList(formList.map(({ simpleOrderCreateCommand, payType, refundFee }) => {
        if (simpleOrderCreateCommand && simpleOrderCreateCommand.realPay) {
          return {
            payWayDesc: simpleOrderCreateCommand.payWayDesc,
            refundFee,
            isMark: true,
          };
        }
        return null;
      }).filter(Boolean));
      return;
    }

    const timer = setTimeout(() => {
      clearTimeout(timer);

      if (curRefundFee.current !== refundFee) {
        return;
      }
      queryAssetRefundPhasePriceInfo({
        assetNo: courseState[0]?.assetNo,
        refundFee,
        kdtId: courseState[0]?.kdtId,
      }).then(data => {
        setRefundFeeTypeList(data);
      });
    }, 1000);
  }, [courseState, formList]);

  // 获取退课信息
  useEffect(() => {
    let resPromise;
    if (urlParams.studentId) {
      const preRefundCommand = {
        targetKdtId: urlParams.kdtId || window._global.kdtId,
        studentId: urlParams.studentId,
        assetNo: urlParams.assetNo,
      };
      if (urlParams.orderNo) {
        preRefundCommand.orderNo = urlParams.orderNo;
      }
      if (urlParams.skuId) {
        preRefundCommand.skuId = urlParams.skuId;
      }
      resPromise = getPreRefundFromUser({
        preRefundCommand,
      });
    } else {
      const preRefundCommand = {
        targetKdtId: urlParams.kdtId || window._global.kdtId,
        orderNo: urlParams.orderNo,
        skuId: urlParams.skuId,
      };
      resPromise = getPreRefundFromOrder({
        preRefundCommand,
      });
    }
    resPromise.then(data => {
      const refundFields = data.reduce((obj, cur, index) => {
        return Object.assign(obj, {
          ['refundCourseValue-' + index]: calcMaxRefundValue(cur),
          ['refundFee-' + index]: '',
        });
      }, {});
      // initialize context
      courseDispatch({
        type: CHANGE_COURSES,
        payload: data,
      });
      // initialize form
      zentForm.setFieldsValue(refundFields);
    }).catch(err => {
      Notify.error(err);
    });
  }, [courseDispatch, zentForm]);

  const onSubmit = useCallback((data, setLoading) => {
    setLoading(true);
    refund(data).then((res) => {
      const { refundNo } = res.data || {};
      window.location.href = '/v4/vis/edu/page/refund-record#/print/' + refundNo + '?kdtId=' + urlParams.kdtId;
    }).catch(err => {
      setLoading(false);
      // 先关闭之前的弹窗
      closeConfirmDialog();
      openShopRechargeDialog(err);
    });
  }, []);

  const userAsset = (courseState[0] && courseState[0].userAsset) || {};
  const refundItemDTO = (courseState[0] && courseState[0].refundItemDTO) || {};
  const courseType = courseState[0] && courseState[0].courseType;

  const courseSellType = useMemo(() => userAsset.courseSellType || 0, [userAsset.courseSellType]);
  // 是否生效
  const isEffective = useMemo(() => userAsset.startTime && userAsset.endTime, [userAsset.startTime, userAsset.endTime]);
  // 手动退课导致资产失效
  const haveRefund = useMemo(() => userAsset.assetRefundTagList &&
    userAsset.assetRefundTagList.find(assetRefundTag => assetRefundTag === 'refund')
  , [userAsset.assetRefundTagList]);
  // 可以移除学员
  const canRefund = useMemo(() => courseType === 0 ||
    courseSellType === 3 ||
    (!isEffective && courseSellType === 0) ||
    (!isEffective && courseSellType === 2),
  [courseSellType, courseType, isEffective]);
  // 是否展示“将学员从课程中移除”checkbox
  const showRemoveStudent = useMemo(() => !haveRefund && canRefund, [haveRefund, canRefund]);

  // restProps 是列表表单数据，提交退课
  const handleConfirm = useCallback(({ remark, removeStudent, ...restProps }) => {
    const sourceRefundItemList = courseState.map(({
      userAsset,
      assetNo,
      bizIds,
      course,
      courseType,
      orderNo,
      refundItemDTO,
      studentId,
      student,
      courseTime,
      sellerId,
      sellerName,
    }, index) => {
      return {
        assetNo,
        bizIds,
        courseSellType: userAsset && userAsset.courseSellType,
        courseType,
        courseTime,
        orderNo,
        // refundFeeTypeList,
        removeStudent,
        skuId: refundItemDTO && refundItemDTO.skuId,
        studentId,
        sellerId,
        sellerName,
        simpleOrderCreateCommand: {
          courseName: (course && course.title) || '',
          phoneNumber: (student && student.mobile) || '',
          studentName: (student && student.name) || '',
        },
        num: 1,
      };
    });

    const refundItemList = formatList(sourceRefundItemList, restProps);

    const haveSet = Object.keys(restProps).findIndex(key => restProps[key] && restProps[key]) !== -1 || removeStudent;

    if (!haveSet) {
      if (!removeStudent && showRemoveStudent) {
        Notify.error('请勾选“将学员从课程中移除”');
        return;
      }
      Notify.error('请输入退课金额或者学员资产');
      return;
    }

    openConfirmDialog(onSubmit, {
      refundCommand: {
        remark,
        refundItemList,
        operatorId: window._global.userId,
        operatorName: staffName,
        targetKdtId: urlParams.kdtId || window._global.kdtId,
      },
    });
  }, [courseState, staffName, onSubmit, showRemoveStudent]);

  return (
    <Form horizontal className="edu-refund" onSubmit={handleSubmit(handleConfirm)} ref={ref}>
      <Warning courses={courseState} />
      <CourseHeader />
      <CourseList formList={formList} />
      <PresentList refundItemAlias={refundItemDTO && refundItemDTO.alias} />
      <BlockHeader>退课信息</BlockHeader>
      <OtherInfo
        formList={formList}
        refundFeeTypeList={refundFeeTypeList}
        refundItemDTO={refundItemDTO}
        userAsset={userAsset}
        courseType={courseType}
        courseSellType={courseSellType}
        showRemoveStudent={showRemoveStudent}
      />
      <ButtonGroup />
    </Form>
  );
}

export default createForm()(React.forwardRef(App));

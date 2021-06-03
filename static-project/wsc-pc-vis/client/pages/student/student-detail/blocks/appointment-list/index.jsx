// 体验课报名列表
import React, { useState, useCallback, useMemo } from 'react';
import { CardList } from '@youzan/ebiz-components';
import formatDate from '@youzan/utils/date/formatDate';
import format from '@youzan/utils/money/format';
import { Link as SamLink } from '@youzan/sam-components';
import { navigateToEnrollment } from '@ability-center/assets';

import StudentStatus from '@ability-center/student/student-status';

import { Notify } from 'zent';
import { RESERVE_STATUS_MAP, RESERVE_STATUS_COLOR_MAP, APPOINTMENT_STATUS_TYPE } from './config';

import { findStudentLessonsAPI } from '../../../api/student-detail';

import { Operations } from '@youzan/react-components';

import cancelAppointmentDialog from '../../../../edu-admin/appointment/components/dialog-appointment-cancel';
import { openSignInDialog } from '@ability-center/appointment/signin-util';

import { isInStoreCondition } from 'fns/chain';
import useCampusQuery from '../../utils/use-campus-query';

import VersionWrapper from 'fns/version';
import { makeAppointment } from '@ability-center/appointment';

// TODO: 此处不需要接受排序参数，写死
const buildQueryData = (query, pageInfo) => {
  const {
    current,
    pageSize
  } = pageInfo;
  return {
    query,
    pageRequest: {
      pageNumber: current || 1,
      pageSize: pageSize || 10,
      sort: {
        orders: [
          {
            property: 'created_at',
            direction: 'DESC'
          }
        ]
      }
    }
  };
};

const AppointmentList = ({ studentId = '', mobile = '', name = '', pageSize = 2, campusKdtId }) => {
  const [updateSignal, setUpdateSignal] = useState(0);
  const transfromResponseToDataSets = useMemo(() => ({
    studentLessons: {
      content = [],
      total
    } }) => ({
    total,
    datasets: content,
    pageSize
  }), [pageSize]);

  const refreshList = () => setUpdateSignal(updateSignal => updateSignal + 1);
  // 放在这里，很丑，但是要修掉
  // 根据校区kdtId更新列表
  // useEffect(
  //   () => {
  //     if (campusKdtId) {
  //       refreshList();
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [campusKdtId],
  // );

  const passiveQueries = useCampusQuery({
    mobile,
    name,
    studentId,
    kdtId: campusKdtId
  });
  const fetchAppointmentList = useCallback((pageInfo) => {
    const queryData = buildQueryData(
      passiveQueries,
      pageInfo
    );
    return findStudentLessonsAPI(queryData).then(transfromResponseToDataSets).catch(
      msg => {
        Notify.error(msg || '获取体验课列表失败');
      }
    );
  }, [passiveQueries, transfromResponseToDataSets]);

  const enrollmentURL = navigateToEnrollment({ studentId });

  const renderConfig = {
    // 标题
    renderTitle: (item) => {
      const { courseName, studentLessonStatus, sku } = item;
      return (<>
        <span style={{ marginRight: '8px' }}>
          {`${courseName || '-'}${sku ? `(${sku})` : ''}`}
        </span>
        <StudentStatus
          type={studentLessonStatus}
          customerStatus={RESERVE_STATUS_MAP}
          customerColors={RESERVE_STATUS_COLOR_MAP}
        />
      </>);
    },
    renderSubtitle: (item) => {
      const { eduCourseName } = item;
      return '适用课程：' + (eduCourseName || '-');
    },
    contentGroup: [
      [
        {
          'label': '上课时间',
          render: (item) => {
            const { startTime } = item;
            return startTime ? formatDate(startTime, 'YYYY-MM-DD HH:mm:ss') : '-';
          }
        },
        {
          'label': '上课地点',
          render: (item) => {
            const { addressName } = item;
            return addressName || '-';
          }
        }
      ],
      [
        {
          'label': '报名时间',
          render: (item) => {
            const { createTime } = item;
            return createTime ? formatDate(createTime, 'YYYY-MM-DD HH:mm:ss') : '-';
          }
        },
        {
          'label': '实付金额',
          render: (item) => {
            return `¥${format(item.realPay)}`;
          }
        },
        {
          'label': '预约人',
          render: (item) => {
            return item.originData || '-';
          }
        }
      ]
    ],

    operators: []
  };

  // 编辑日程
  const editAppointment = (appointment) => {
    makeAppointment.open({
      defaultData: appointment,
      type: 'edit-try',
      callback: () => refreshList()
    });
  };

  // 确认日程
  const confirmAppointment = (appointment) => {
    makeAppointment.open({
      defaultData: appointment,
      type: 'confirm-try',
      callback: () => refreshList()
    });
  };

  // 签到
  const handleSign = appointment => {
    const { consumeAssetNum, studentLessonNo, studentName, startTime, kdtId } = appointment;

    openSignInDialog({
      kdtId,
      signInType: 0, // 类型 0 签到 1 请假 2 旷课
      consumeNum: consumeAssetNum,
      studentName: studentName,
      studentLessonNos: [studentLessonNo],
      afterSignIn: refreshList,
      startTime: startTime
    });
  };

  // 取消预约
  const handleCancelAppointment = appointment => {
    cancelAppointmentDialog.open({
      defaultData: appointment,
      callback: refreshList
    });
  };

  const dropCourse = (item) => {
    const { eduCourseOrderDTO = {}, studentId, assetNo, kdtId } = item;
    const { orderNo, skuId } = eduCourseOrderDTO;
    window.open(`${_global.url.v4}/vis/edu/page/refund?assetNo=${assetNo}&studentId=${studentId}&orderNo=${orderNo}&skuId=${skuId}&kdtId=${kdtId}`);
  };

  // 根据数据来判断可以进行的操作
  const generateRenderOperators = (item) => {
    const { canOperate, studentLessonStatus, eduCourseOrderDTO } = item;

    if (!canOperate) {
      return null;
    }

    const operations = [];

    if (eduCourseOrderDTO) {
      operations.push(
        <SamLink name='退课' onClick={() =>
          dropCourse(item)
        }
        >退课</SamLink>
      );
    }

    if (studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED ||
      studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED
    ) {
      if (studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED) {
        operations.push(
          <a onClick={() =>
            confirmAppointment(item)
          }
          >确认</a>
        );
      }

      if (studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED) {
        const signElement = VersionWrapper(
          {
            name: 'recruit-detail-action',
            downgrade: { from: item.courseType === 0 },
            children: (<a onClick={() => handleSign(item)}>签到</a>)
          });
        const editElement = VersionWrapper({
          name: 'recruit-detail-action',
          downgrade: { from: item.courseType === 0 },
          children: (<a onClick={() =>
            canOperate !== false && editAppointment(item)
          }>修改预约</a>)
        });
        signElement && operations.push(
          signElement
        );
        editElement && operations.push(
          editElement
        );
      }

      operations.push(
        <a onClick={() =>
          handleCancelAppointment(item)
        }>取消预约</a>
      );

      if (!isInStoreCondition({ supportEduHqStore: true })) {
        operations.push(<a href={enrollmentURL}>办理报名</a>);
      }
    }

    return <Operations items={operations} />;
  };

  renderConfig.renderOperators = generateRenderOperators;

  return (
    <CardList
      selectable={false}
      fetchData={fetchAppointmentList}
      updatingSignal={updateSignal}
      renderConfig={renderConfig}
      pageInfo={{
        pageSize
      }}
    />);
};

export default AppointmentList;

// 体验课报名列表
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Notify } from 'zent';
import { Table } from '@zent/compat';
import cx from 'classnames';
import { RESERVE_SOURCE, RESERVE_STATUS_MAP, APPOINTMENT_STATUS_TYPE } from '../../config';
import { findStudentLessonsAPI } from '../../../../api';
import { format } from 'date-fns';
import './style.scss';

import cancelAppointmentDialog from '../../../../../../edu-admin/appointment/components/dialog-appointment-cancel';
import { openSignInDialog } from '@ability-center/appointment/signin-util';
import VersionWrapper from 'fns/version';
import { makeAppointment } from '@ability-center/appointment';

const AppointmentList = ({ telephone, name }) => {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const findStudentLessons = useCallback(
    () => {
      setLoading(true);
      findStudentLessonsAPI({
        query: {
          name,
          mobile: telephone,
        },
        pageRequest: {
          pageNumber: page,
          countEnabled: true,
          pageSize: 10,
          sort: {
            orders: [{
              property: 'created_at',
              direction: 'DESC',
            }],
          },
        },
      })
        .then((res = {}) => {
          const { studentLessons = {} } = res;
          const { content = [], total = 0 } = studentLessons;
          setTotal(total);
          setDatasets(content);
        })
        .catch(msg => {
          Notify.error(msg || '获取体验课列表失败');
        })
        .finally(() => {
          setLoading(false);
        });
    }, [page, telephone, name]);

  useEffect(findStudentLessons, [findStudentLessons]);

  const confirmAppointment = useCallback((appointment) => {
    makeAppointment.open({
      defaultData: appointment,
      type: 'confirm-try',
      callback: () => findStudentLessons(),
    });
  }, [findStudentLessons]);

  const editAppointment = useCallback((appointment) => {
    makeAppointment.open({
      defaultData: appointment,
      type: 'edit-try',
      callback: () => findStudentLessons(),
    });
  }, [findStudentLessons]);

  const cancelAppointment = useCallback(appointment => {
    cancelAppointmentDialog.open({
      defaultData: appointment,
      callback: () => findStudentLessons(),
    });
  }, [findStudentLessons]);

  const sign = useCallback(appointment => {
    const { consumeAssetNum, studentLessonNo, studentName, startTime, kdtId } = appointment;

    openSignInDialog({
      kdtId,
      signInType: 0, // 类型 0 签到 1 请假 2 旷课
      consumeNum: consumeAssetNum,
      studentName: studentName,
      studentLessonNos: [studentLessonNo],
      afterSignIn: () => findStudentLessons(),
      startTime: startTime,
    });
  }, [findStudentLessons]);

  const columns = useMemo(() => {
    return [{
      title: '线下课/课程',
      name: 'courseName',
      width: '20%',
      bodyRender: ({ courseName, eduCourseName }) => {
        return courseName || eduCourseName || '-';
      },
    }, {
      title: '状态',
      name: 'studentLessonStatus',
      width: '10%',
      bodyRender: ({ studentLessonStatus }) => {
        return RESERVE_STATUS_MAP[studentLessonStatus] || '-';
      },
    }, {
      title: '上课地点',
      name: 'addressName',
      width: '20%',
      bodyRender: ({ addressName }) => {
        return addressName || '-';
      },
    }, {
      title: '来源',
      name: 'origin',
      width: '15%',
      bodyRender: ({ origin }) => {
        return RESERVE_SOURCE[origin] || '-';
      },
    }, {
      title: '上课时间',
      name: 'createTime',
      width: '15%',
      bodyRender: ({ startTime }) => {
        return startTime ? format(startTime, 'YYYY-MM-DD HH:mm:ss') : '-';
      },
    }, {
      title: '操作',
      bodyRender: (appointment) => {
        const { studentLessonStatus, canOperate } = appointment;

        const linkClass = cx({
          'ui-link--split': true,
          'gray': canOperate === false,
        });

        if (
          studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED) {
          return (
            <>
              <span className={linkClass} onClick={() =>
                canOperate !== false && confirmAppointment(appointment)}
              >确认</span>
              <span className={linkClass} onClick={() => {
                canOperate !== false && cancelAppointment(appointment);
              }}>取消预约</span>
            </>
          );
        } else if (studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED) {
          return (
            <>
              <VersionWrapper name="recruit-detail-action" downgrade={{ from: appointment.courseType === 0 }}>
                <span className={linkClass} onClick={() => canOperate !== false && sign(appointment)}>签到</span>
              </VersionWrapper>
              <VersionWrapper name="recruit-detail-action" downgrade={{ from: appointment.courseType === 0 }}>
                <span className={linkClass} onClick={() =>
                  canOperate !== false && editAppointment(appointment)
                }>修改预约</span>
              </VersionWrapper>
              <span className={linkClass} onClick={() =>
                canOperate !== false && cancelAppointment(appointment)
              }>取消预约</span>
            </>
          );
        }

        return null;
      },
    }];
  }, [cancelAppointment, confirmAppointment, sign, editAppointment]);

  return (
    <Table
      columns={columns}
      datasets={datasets}
      loading={loading}
      emptyLabel="没有报名的体验课"
      pageInfo={{
        pageSize: 10,
        current: page,
        totalItem: total,
      }}
      onChange={({ current }) => setPage(current)}
    />
  );
};

export default AppointmentList;

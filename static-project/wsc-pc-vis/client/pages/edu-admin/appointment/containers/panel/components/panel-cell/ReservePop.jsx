import React, { Component } from 'react';
import { Link as SamLink } from '@youzan/sam-components';
import cx from 'classnames';
import makeDateTimeStr from 'zan-utils/date/makeDateTimeStr';
import { RESERVE_STATUS_MAP, APPOINTMENT_STATUS_TYPE } from '../../../../constants';
import { getDefaultText } from '../../../../utils';
import AppointmentDialog from '../../../../components/dialog-appointment';
import cancelAppointmentDialog from '../../../../components/dialog-appointment-cancel';
import { openSignInDialog } from '@ability-center/appointment/signin-util';
import { switchWrapper } from 'fns/chain';
import VersionWrapper from 'fns/version';

export default class ReservePop extends Component {
  isClassed = status => {
    return (
      +status === APPOINTMENT_STATUS_TYPE.COMPLETED ||
      +status === APPOINTMENT_STATUS_TYPE.ABSENCE ||
      +status === APPOINTMENT_STATUS_TYPE.ASK_FOR_LEAVED
    );
  };

  confirmAppointment = () => {
    const { appointment, updateData } = this.props;
    AppointmentDialog.open({ defaultData: appointment, callback: updateData });
  };

  editAppointment = () => {
    const { appointment, updateData } = this.props;
    AppointmentDialog.open({ defaultData: appointment, callback: updateData, type: 'edit-appointment' });
  }

  cancelAppointment = () => {
    const { appointment, updateData } = this.props;
    cancelAppointmentDialog.open({ defaultData: appointment, callback: updateData });
  };

  signin = () => {
    const { appointment, updateData } = this.props;
    const { consumeAssetNum, studentLessonNo, studentName, startTime, kdtId = _global.kdtId } = appointment;
    openSignInDialog({
      signInType: 0, // 类型 0 签到 1 请假 2 旷课
      consumeNum: consumeAssetNum,
      studentName: studentName,
      studentLessonNos: [studentLessonNo],
      afterSignIn: updateData,
      startTime: startTime,
      kdtId,
    });
  };

  renderLocation = () => {
    const { appointment } = this.props;
    return switchWrapper({
      supportBranchStore: () => null,
      supportHqStore: () => {
        return appointment.addressName && (
          <p className="reserve-pop__desc-item">
        上课校区：
            {appointment.addressName}
          </p>
        );
      },
      supportSingleStore: () => {
        return appointment.addressName && (
          <p className="reserve-pop__desc-item">
        上课地点：
            {appointment.addressName}
          </p>
        );
      },
    });
  }

  renderAction = (appointment) => {
    let el;
    if (appointment.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED) {
      el = (
        <SamLink name="新建、修改、确认预约" className="reserve-pop__operate-item" onClick={this.confirmAppointment}>
          确认
        </SamLink>
      );
    } else if (appointment.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED) {
      el = (
        <>
          <VersionWrapper name="appointment-list-action" downgrade={{ from: appointment.courseType === 0 }}>
            <SamLink className="reserve-pop__operate-item" onClick={this.signin}>
              签到
            </SamLink>
          </VersionWrapper>
          <VersionWrapper name="appointment-list-action" downgrade={{ from: appointment.courseType === 0 }}>
            <SamLink name="新建、修改、确认预约" className="reserve-pop__operate-item" onClick={this.editAppointment}>
              修改
            </SamLink>
          </VersionWrapper>
        </>
      );
    }
    return (
      <>
        {
          el
        }
      </>
    );
  }

  render() {
    const { appointment } = this.props;
    const wrapClass = cx({
      'reserve-pop': true,
      'reserve-pop__not-confirmed':
        +appointment.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED,
      'reserve-pop__not-class':
        +appointment.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED,
      'reserve-pop__classed': this.isClassed(appointment.studentLessonStatus),
    });

    const isShowOperate =
      +appointment.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED ||
      +appointment.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED;

    return (
      <div className={wrapClass}>
        <div className="reserve-pop__top" />
        <div className="reserve-pop__header">
          <div className="reserve-pop__header-top">
            <div className="reserve-pop__header-name">
              {getDefaultText(appointment.studentName)}
            </div>
            <span className="reserve-pop__header-status">
              {RESERVE_STATUS_MAP[appointment.studentLessonStatus]}
            </span>
          </div>
          <div className="reserve-pop__header-course">{getDefaultText(appointment.courseName)}</div>
        </div>
        <div className="reserve-pop__content">
          <div className="reserve-pop__gap-line" />
          <div className="reserve-pop__content-inner">
            {!!appointment.lessonContent && (
              <p className="reserve-pop__desc-item">
                课&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;节：
                {appointment.lessonContent}
              </p>
            )}
            {!!appointment.startTime && (
              <p className="reserve-pop__desc-item">
                时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：
                {appointment.startTime > 0 ? (
                  `${makeDateTimeStr(appointment.startTime, 'YYYY-MM-DD HH:mm')}-${makeDateTimeStr(appointment.trueEndTime || appointment.endTime, 'HH:mm')}`
                ) : '-'}
              </p>
            )}
            {
              this.renderLocation()
            }
            {!!appointment.classroom && (
              <p className="reserve-pop__desc-item">
                教&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室：
                {appointment.classroom}
              </p>
            )}
            {!!appointment.teacherName && (
              <p className="reserve-pop__desc-item">
                老&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;师：
                {appointment.teacherName}
              </p>
            )}
            {!!appointment.assistantNames && appointment.assistantNames.length !== 0 && (
              <p className="reserve-pop__desc-item reserve-pop__desc-item-assistants">
                助&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;教：
                {appointment.assistantNames.join('、')}
              </p>
            )}
            {!!appointment.remark && (
              <p className="reserve-pop__desc-item">
                备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：
                {appointment.remark}
              </p>
            )}
          </div>
          <div className="reserve-pop__gap-line" />
        </div>
        {isShowOperate && (
          <div className="reserve-pop__operate-line">
            {
              this.renderAction(appointment)
            }
            <SamLink name="取消预约" className="reserve-pop__operate-item" onClick={this.cancelAppointment}>
              取消预约
            </SamLink>
          </div>
        )}
      </div>
    );
  }
}


import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { BlockLoading, Button, Notify } from 'zent';
import { cancelAppointment } from '../../api';
import { APPOINTMENT_STATUS_TYPE } from '../../constants';
import formatDate from 'zan-utils/date/formatDate';

const { createForm } = Form;

class AppointmentCancelDialogContent extends Component {
  state = {
    loading: false,
  };

  onSubmit = values => {
    const userInfo = _global.userInfo;
    const { closeDialog, defaultData = {}, callback = () => { } } = this.props;

    this.setState({ loading: true });
    cancelAppointment({
      studentLessonNo: defaultData.studentLessonNo,
      operatorId: userInfo.id,
      kdtId: defaultData.kdtId || _global.kdtId,
    })
      .then(() => {
        Notify.success('取消预约成功');
        this.setState({ loading: false });
        callback();
        closeDialog();
      })
      .catch(error => {
        this.setState({ loading: false });
        Notify.error(error);
      });
  };

  getTimeRange = () => {
    const { defaultData = {} } = this.props;
    const isToBeConfirmed =
      +defaultData.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED;
    if (!isToBeConfirmed && +defaultData.startTime > 0) {
      return `${formatDate(defaultData.startTime, 'HH:mm')} - ${formatDate(
        defaultData.trueEndTime || defaultData.endTime,
        'HH:mm',
      )}`;
    }
    return '';
  };

  getRestStudentNumText = () => {
    const { defaultData = {} } = this.props;
    const isToBeConfirmed =
      +defaultData.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED;
    if (isToBeConfirmed) {
      return '确定取消预约？';
    } else {
      const rest = defaultData.maxStudentLessons - defaultData.currentStudentLessons;
      return `当前预约剩余名额${rest < 0 ? 0 : rest}/${
        defaultData.maxStudentLessons
      }，确定取消预约吗？`;
    }
  };

  render() {
    const { loading } = this.state;
    const { handleSubmit, closeDialog, defaultData = {} } = this.props;
    const isToBeConfirmed =
      +defaultData.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED;

    return (
      <BlockLoading>
        <div className="appointment-cancel-dialog-content">
          <Form
            horizontal
            onSubmit={handleSubmit(this.onSubmit)}
            className="appointment-cancel-dialog-content__form"
          >
            {!isToBeConfirmed && (
              <div className="appointment-cancel-dialog-content__em">
                当前选中日程：“{defaultData.studentName} {this.getTimeRange()}
                {' ' + (defaultData.lessonContent || '')}”
              </div>
            )}
            <p className="appointment-cancel-dialog-content__desc">
              {defaultData.maxStudentLessons !== 0 && this.getRestStudentNumText()}
            </p>
            <div className="appointment-cancel-dialog-content__actions">
              <Button type="primary" outline htmlType="submit" loading={loading}>
                取消预约
              </Button>
              <Button type="primary" onClick={closeDialog}>
                我再想想
              </Button>
            </div>
          </Form>
        </div>
      </BlockLoading>
    );
  }
}

const wrapped = createForm()(AppointmentCancelDialogContent);

export default wrapped;
